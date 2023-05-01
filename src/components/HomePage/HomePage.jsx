import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css';
import { useDbData, writeToDb } from "../../utilities/firebase.js";
import { LeftOffPage } from "../LeftOffPage/LeftOffPage";
import { UpdatesPage } from "../UpdatesPage/UpdatesPage";
import { DinoGame } from "../DinoGame/DinoGame";
import { ChatGPTCall } from "../../utilities/api";
import { LinearProgress } from "@mui/material";

export default function HomePage() {
    // FIREBASE STUFF
    const [current_user, setCurrentUser] = useState(null)
    // Jeff Bezos only has one topic in the DB, Joe Shmoe has all of them
    // useEffect(() => { // get current URL
    //     chrome.identity.getProfileUserInfo(function(userInfo) {
    //         console.log('user email', userInfo.email);
    //         console.log('user id', userInfo.id);
    //     });
    // }, [])
    var curr_user = 'Jeff Bezos' // change this based on user id from Google later
    const [data, error] = useDbData('/');
    const [user_data, setUserData] = useState(null)
    const [runGetData, setRunGetData] = useState(false)
    useEffect(() => {
        if (data) {
            if (! runGetData) {
                setRunGetData(true)
                setUserData(data.users[curr_user])
                console.log("setting user_data to", data.users[curr_user])
            }
        }
    }, [data])

    // STEP 1: GET CURRENT URL, IDENTIFY TOPIC FROM PRE-DETERMINED LIST USING CHAT-GPT
    let topics = `Russian Invasion of Ukraine, COVID-19 Pandemic, Opioid Epidemic, Trump Indictment and Arrest, 
                  2024 United States Presidential Election, The Stock Market`
    const [curr_url, setCurrURL] = useState(null)
    useEffect(() => { // get current URL
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            setCurrURL(activeTab.url)
          });
    }, [])
    const [chatGPTTopic, setChatGPTTopic] = useState(null)
    async function TopicGPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setChatGPTTopic(response.choices[0].text.replace(/\n/g, ''))
        console.log("setting chatGPTTopic to", response.choices[0].text.replace(/\n/g, ''))
    }
    const [runGPTTopic, setRunGPTTopic] = useState(false)
    useEffect(() => { // find topic using URL and Chat GPT
        if (!runGPTTopic && curr_url) {
            setRunGPTTopic(true)
            TopicGPTResponse(`You're given this list of topics: ${topics}, and this URL: ${curr_url}. Identify which of the
                         topics given in this list matches with the content of the website that the URL links to. Output
                         the name of the topic exactly as formatted in the list. If none of the topics match the content
                         of the site, then output N/A.`)
        }
    }, [curr_url])

    // Helper for NYT API date formatting
    function dateToNYTString(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const ymd = `${year}${month}${day}`;
        return ymd;
    }

    // Helper to get today's date in mm-dd-yyyy
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${month}-${day}-${year}`;
    }
      
    // STEP 4: Get info from NYT API relavant to the current topic
    // Grabs the 10 most relevant NYT articles on a given topic between the user's last date of viewing
    // an article on this topic and today
    const [articles, setArticles] = useState([]);
    const [date_viewed, setDateViewed] = useState(null);
    const [last_url, setLastURL] = useState(null);
    var articlesTextContent = {} // dictionary of the form {article_url: full_text_content}
    useEffect(() => {
        if (chatGPTTopic && user_data && (! chatGPTTopic.includes('N/A'))) {
            const apiKey = import.meta.env.VITE_NYT_API_KEY;
            var start_date = null;
            if (user_data[chatGPTTopic]) {
                console.log('yesss')
                start_date = new Date(user_data[chatGPTTopic].last_date)
                if (! date_viewed) {
                    setDateViewed(user_data[chatGPTTopic].last_date)
                }
                if (! last_url) {
                    setLastURL(user_data[chatGPTTopic].last_article_url)
                }
            } else {
                start_date = new Date()
                start_date.setDate(start_date.getDate() - 7)
                if (! date_viewed) {
                    setDateViewed('N/A')
                }
                if (! last_url) {
                    setLastURL('First article viewed on this topic!')
                }
            }
            // UPDATE FIREBASE DB HERE
            var data = {
                    'last_article_url': curr_url,
                    'last_date': getTodayDate()
            }
            writeToDb(`/users/${curr_user}/${chatGPTTopic}`, data);
            // Make NYT API Call
            console.log('start date', start_date)
            start_date = dateToNYTString(start_date)
            var end_date = new Date();
            end_date = dateToNYTString(end_date)
            // This isn't currently filtering by start date, end date, or relavance
            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${chatGPTTopic}&api-key=${apiKey}&begin_date=${start_date}&end_date=${end_date}&sort=relevance`;
            fetch(url)
                .then(response => response.json())
                .then(data => setArticles(data.response.docs))
                .catch(error => console.log("error", error));
        }
    }, [chatGPTTopic, user_data]);
    useEffect(() => {
        if (articles.length > 0) {
            console.log('articles', articles)
            for (let i = 0; i < articles.length; i++) {
                // note: for now setting the value to the article's lead paragraph
                // need to change to full text content later... potentially
                articlesTextContent[articles[i].web_url] = articles[i].lead_paragraph
                console.log("article", i, "publication date", articles[i].pub_date)
                console.log("article", i, "lead paragraph", articles[i].lead_paragraph)
            }
        }
    }, [articles])
    // Grabs the 10 most recent NYT articles on a given topic between the user's last date of viewing
    // an article on this topic and today
    // const [articles_recent, setArticlesRecent] = useState([]);
    // var articlesTextContentRecent = {} // dictionary of the form {article_url: full_text_content}
    // useEffect(() => {
    //     if (chatGPTTopic && user_data && (! chatGPTTopic.includes('N/A'))) {
    //         const apiKey = import.meta.env.VITE_NYT_API_KEY;
    //         var start_date = null;
    //         if (user_data[chatGPTTopic]) {
    //             start_date = new Date(user_data[chatGPTTopic].last_date)
    //             setDateViewed(user_data[chatGPTTopic].last_date)
    //             setLastURL(user_data[chatGPTTopic].last_article_url)
    //         } else {
    //             start_date = new Date()
    //             start_date.setDate(start_date.getDate() - 7)
    //             // TODO: UPDATE FIREBASE DB HERE
    //         }
    //         console.log('start date', start_date)
    //         start_date = dateToNYTString(start_date)
    //         var end_date = new Date();
    //         end_date = dateToNYTString(end_date)
    //         // This isn't currently filtering by start date, end date, or relavance
    //         const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${chatGPTTopic}&api-key=${apiKey}&begin_date=${start_date}&end_date=${end_date}&sort=newest`;
    //         fetch(url)
    //             .then(response => response.json())
    //             .then(data => setArticlesRecent(data.response.docs))
    //             .catch(error => console.log("error", error));
    //     }
    // }, [chatGPTTopic, user_data]);
    // useEffect(() => {
    //     if (articles_recent.length > 0) {
    //         console.log('articles_recent', articles_recent)
    //         for (let i = 0; i < articles_recent.length; i++) {
    //             // note: for now setting the value to the article's lead paragraph
    //             // need to change to full text content later... potentially
    //             articlesTextContentRecent[articles_recent[i].web_url] = articles_recent[i].lead_paragraph
    //             console.log("article", i, "publication date", articles_recent[i].pub_date)
    //             console.log("article", i, "lead paragraph", articles_recent[i].lead_paragraph)
    //         }
    //     }
    // }, [articles_recent])

    // STEP 4.5: Get full text content of each article
    // todo: do. for now we will just use article snippets

    // STEP 5: Use Chat-GPT to compress NYT information into four bullet points
    // Updates - by relevance
    const [relevantUpdatesResponse, setRelevantUpdatesResponse] = useState(null)
    async function RelevantUpdatesGPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setRelevantUpdatesResponse(response.choices[0].text.replace(/\n/g, ''))
    }
    const [runRelevant, setRunRelevant] = useState(false)
    useEffect(() => {
        if (!runRelevant && articles.length > 0) {
            setRunRelevant(true)
            console.log(`I am giving this to GPT: ${Object.values(articlesTextContent).join(', ')}.`)
            RelevantUpdatesGPTResponse(`Briefly summarize the following articles into four bullet 
            points (using "- " as the bullet points) as if you were reporting them to a person: ${Object.values(articlesTextContent).join(', ')}.`)
        }
    }, [articles])
    // Updates - by recency
    // const [recentUpdatesResponse, setRecentUpdatesResponse] = useState(null)
    // async function RecentUpdatesGPTResponse(prompt) {
    //     const response = await ChatGPTCall(prompt)
    //     setRecentUpdatesResponse(response.choices[0].text.replace(/\n/g, ''))
    // }
    // const [runRecent, setRunRecent] = useState(false)
    // useEffect(() => {
    //     if (!runRecent && articles_recent.length > 0) {
    //         setRunRecent(true)
    //         RecentUpdatesGPTResponse(`Briefly summarize the following articles into four bullet points (using "- " as the bullet points) as if you were reporting them to a person: ${Object.keys(articlesTextContentRecent).join(', ')}.`)
    //     }
    // }, [articles_recent])

    // split the response into bullet points
    var relevantUpdatesBullets = relevantUpdatesResponse ? relevantUpdatesResponse.split('- ') : null
    if (relevantUpdatesBullets) relevantUpdatesBullets.shift()
    // var recentUpdatesBullets = recentUpdatesResponse ? recentUpdatesResponse.split('- ') : null
    // if (recentUpdatesBullets) recentUpdatesBullets.shift()

    // REACT CODE - FRONTEND STUFF
    if (chatGPTTopic && chatGPTTopic.includes('N/A')) {
        return (
            <div className="loading-div">
                <h1 className="loading-message">Current tab doesn't match a topic from our list!</h1>
            </div>
        )
    }
    if (chatGPTTopic && user_data && relevantUpdatesBullets) { // && recentUpdatesBullets
        if (! chatGPTTopic.includes('N/A')) {
            return (<>
                        <div className="curr-user-div">
                            <div className="curr-user-banner">Current User: {curr_user}</div>
                        </div>
                        <LeftOffPage last_url={last_url} bullet_points={["", "", "", ""]} date_viewed={date_viewed}/>
                        {/* <UpdatesPage recent={true} bullet_points={recentUpdatesBullets}/> */}
                        <UpdatesPage recent={false} bullet_points={relevantUpdatesBullets}/>
                    </>)
        }
    } else {
        return (<div className="loading-div">
                    <h1 className="loading-message">Loading...</h1>
                    <DinoGame/>
                    <LinearProgress color="success"/>
                </div>)
    }
}