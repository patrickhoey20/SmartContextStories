import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css';
import { useDbData, writeToDb, usersHasEntry } from "../../utilities/firebase.js";
import { LeftOffPage } from "../LeftOffPage/LeftOffPage";
import { UpdatesPage } from "../UpdatesPage/UpdatesPage";
import { ChatGPTCall } from "../../utilities/api";
import { LinearProgress } from "@mui/material";

export const HomePage = (props) => {
    const { currUser, retry } = props;
    // FIREBASE STUFF
    const [current_user, setCurrentUser] = useState(null)
    var curr_user = currUser;

    const [data, error] = useDbData('/');
    const [runGetDataInit, setRunGetDataInit] = useState(false)
    useEffect(() => {
        if (data) {
            if (! data.users[curr_user]) {
                writeToDb(`/users/${curr_user}`, { 'username': curr_user });
                writeToDb(`/cache/${curr_user}`, { 'username': curr_user });
            }
            setRunGetDataInit(true)
        }
    }, [data])

    const [user_data, setUserData] = useState(null)
    const [cache_data, setCacheData] = useState(null)
    const [runGetData, setRunGetData] = useState(false)

    useEffect(() => {
        if (data) {
            if ((! runGetData) && runGetDataInit) {
                setRunGetData(true)
                setUserData(data.users[curr_user])
                setCacheData(data.cache[curr_user])
                console.log("setting user_data to", data.users[curr_user])
                console.log("setting cache date to", data.cache[curr_user])
            }
        }
    }, [data, runGetDataInit])

    const [nytError, setNYTError] = useState(false)

    // STEP 1: GET CURRENT URL, IDENTIFY TOPIC FROM PRE-DETERMINED LIST USING CHAT-GPT
    // "topics" below is a list of NYT Article Keywords (subjects, specifically)
    let topics = ['New York State Criminal Case Against Trump (71543-23)',
                  'Coronavirus (2019-nCoV)', 
                  'Russian Invasion of Ukraine (2022)', 
                  'Opioids and Opiates',
                  'Presidential Election of 2024',
                  'Stocks and Bonds']
    const [curr_url, setCurrURL] = useState(null)
    useEffect(() => { // get current URL
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            setCurrURL(activeTab.url)
          });
    }, []);
    const [article_NYT, setArticleNYT] = useState([]);
    const [article_NYT_run, setArticleNYTRun] = useState(false);
    useEffect(() =>  {
        if (curr_url && curr_url.includes('nytimes') && curr_url.includes('html')) {
            const apiKey = import.meta.env.VITE_NYT_API_KEY;
            let index = curr_url.indexOf("html");
            let new_url = curr_url;
            if (index !== -1) {
                new_url = curr_url.substring(0, index + 4);
            }
            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=web_url:("${new_url}")&api-key=${apiKey}`;
            fetch(url)
                .then(response => response.json())
                .then(data => setArticleNYT(data.response.docs))
                .catch(error => setNYTError(true));
            setArticleNYTRun(true)
        }
    }, [curr_url])
    const [articleTopic, setArticleTopic] = useState(null)
    const [runGPTTopic, setRunGPTTopic] = useState(false)
    useEffect(() => {
        if (!runGPTTopic && article_NYT_run) {
            setRunGPTTopic(true)
            let keywords = article_NYT[0].keywords
            for (let i = 0; i < keywords.length; i++) {
                let keyword = keywords[i]
                if (keyword.name === 'subject') {
                    if (topics.includes(keyword.value)) {
                        setArticleTopic(keyword.value)
                        break
                    }
                }
                if (i == (keywords.length - 1)) {
                    setArticleTopic('N/A')
                }
            }
        }
    }, [article_NYT])

    // STEP 1.5: Cache if necessary
    
    // Caching steps: check if user has anything in the DB for this topic
    // If so, check if the last date viewed is today
    // If last date viewed is today then generate content from that cached data
    // Otherwise, continue with the rest of the steps and then cache the data
    const [run_code, setRunCode] = useState(true)
    const [hasRunCache, setHasRunCache] = useState(false)
    useEffect(() => {
        let today = getTodayDate()
        if (cache_data && articleTopic) {
            setHasRunCache(true)
            console.log(cache_data)
            console.log(articleTopic)
            let personal_cache = cache_data[articleTopic]
            // console.log('cache', personal_cache)
            if (personal_cache && !retry) {
                if (personal_cache.last_date === today) {
                    console.log('if')
                    setRunCode(false)
                    // generate from the cached data
                } else {
                    console.log('else')
                    // run GPT code to generate new content
                }
            }
        }
    }, [articleTopic, cache_data])

    // only run this code if we did not find a cached version of the data
    
    // STEP 2: Get info from NYT API relavant to the current topic
    // Grabs the 10 most relevant NYT articles on a given topic between the user's last date of viewing
    // an article on this topic and today
    const [articles, setArticles] = useState([]);
    const [date_viewed, setDateViewed] = useState(null);
    const [last_url, setLastURL] = useState(null);
    var articlesTextContent = {} // dictionary of the form {article_url: lead_paragraph}
    useEffect(() => {
        if (run_code && hasRunCache && articleTopic && user_data && (! articleTopic.includes('N/A'))) {
            console.log('YEAH')
            const apiKey = import.meta.env.VITE_NYT_API_KEY;
            var start_date = null;
            if (user_data[articleTopic]) {
                if (retry) {
                    start_date = new Date(cache_data[articleTopic].last_date_prev)
                } else {
                    start_date = new Date(user_data[articleTopic].last_date)
                }
                if (! date_viewed) {
                    if (retry) {
                        setDateViewed(cache_data[articleTopic].last_date_prev_to_show)
                    } else {
                        setDateViewed(user_data[articleTopic].last_date)
                    }
                    if (!retry) {
                        writeToDb(`/cache/${curr_user}/${articleTopic}/last_date_prev`, user_data[articleTopic].last_date);
                        writeToDb(`/cache/${curr_user}/${articleTopic}/last_date_prev_to_show`, user_data[articleTopic].last_date);
                    }
                }
                if (! last_url) {
                    setLastURL(user_data[articleTopic].last_article_url)
                }
            } else {
                start_date = new Date()
                start_date.setDate(start_date.getDate() - 7)
                if (! date_viewed) {
                    setDateViewed('N/A')
                    writeToDb(`/cache/${curr_user}/${articleTopic}/last_date_prev`, getWeekAgoDate());
                    writeToDb(`/cache/${curr_user}/${articleTopic}/last_date_prev_to_show`, getTodayDate());
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
            writeToDb(`/users/${curr_user}/${articleTopic}`, data);
            // Make NYT API Call
            console.log('start date', start_date)
            start_date = dateToNYTString(start_date)
            var end_date = new Date();
            end_date = dateToNYTString(end_date)
            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=subject:("${articleTopic}")&api-key=${apiKey}&begin_date=${start_date}&end_date=${end_date}&sort=relevance`;
            // const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${articleTopic}&api-key=${apiKey}&begin_date=${start_date}&end_date=${end_date}&sort=relevance`; // using q instead of fq
            fetch(url)
                .then(response => response.json())
                .then(data => setArticles(data.response.docs))
                .catch(error => setNYTError(true));
        }
    }, [articleTopic, user_data, run_code, hasRunCache]);
    useEffect(() => {
        if (run_code && hasRunCache && articles.length > 0) {
            console.log('articles length', articles.length)
            for (let i = 0; i < articles.length; i++) {
                // note: for now setting the value to the article's lead paragraph
                articlesTextContent[articles[i].web_url] = articles[i].lead_paragraph;
                console.log("article", i, "publication date", articles[i].pub_date);
                console.log("article", i, "lead paragraph", articles[i].lead_paragraph);
                console.log("article", i, "title", articles[i].headline.main);
            }
        }
    }, [articles, run_code, hasRunCache])

    // Helper for NYT API date formatting
    function dateToNYTString(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const ymd = `${year}${month}${day}`;
        return ymd;
    }

    // Helpers to get dates in mm-dd-yyyy
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${month}-${day}-${year}`;
    }
    function getWeekAgoDate() {
        const today = new Date();
        today.setDate(today.getDate() - 7)
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${month}-${day}-${year}`;
    }

    // Helper to split article url and title for sources
    var sourcesUrls = articles.map(article => article.web_url);
    var sourcesTitles = articles.map(article => article.headline.main);

    // Helper to get number of days since last day
    function getDaysPassed(inputtedDay) {
        var currentDate = new Date();
        var inputtedDate = new Date(inputtedDay);
        var timeDiff = currentDate.getTime() - inputtedDate.getTime();
        var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
        return daysPassed;
    } 

    // STEP 3: Use Chat-GPT to compress NYT information into four bullet points
    const [relevantUpdatesResponse, setRelevantUpdatesResponse] = useState(null)
    async function RelevantUpdatesGPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setRelevantUpdatesResponse(response.choices[0].text.replace(/\n/g, ''))
    }
    const [runRelevant, setRunRelevant] = useState(false)
    useEffect(() => {
        if (run_code && hasRunCache && !runRelevant && articles.length > 0) {
            setRunRelevant(true)

            let relevantGPTCall = `I am going to give you a list of lead paragraphs from News Stories. 
            Please summarize the most important information into four bullet points. Use '- ' to represent each bullet point. The bullet points should be in order of importance and be easily readable by a person. Do not create any new information that is not in the articles.
            Only include information if it is relevant to the topic. The topic is '${articleTopic}'.
            These are the paragraphs: ${Object.values(articlesTextContent).join(', ')}.`
            
            console.log(relevantGPTCall)
            RelevantUpdatesGPTResponse(relevantGPTCall)
        }
    }, [articles, run_code, hasRunCache])
    // split the response into bullet points
    var relevantUpdatesBullets = relevantUpdatesResponse ? relevantUpdatesResponse.split('- ') : null
    if (relevantUpdatesBullets) {
        relevantUpdatesBullets.shift()
    }

    // REACT CODE - FRONTEND STUFF
    if (! run_code) {
        let personal_cache = cache_data[articleTopic]
        return (
            <>
                <LeftOffPage recent={false} last_url={personal_cache.last_url} bullet_points={personal_cache.last_output} date_viewed={personal_cache.last_date_prev_to_show} topic={articleTopic} sources_urls={personal_cache.sourcesUrls} sources_titles={personal_cache.sourcesTitles} curr_user={curr_user}/>
            </>
        )
    }
    if (curr_url && (! curr_url.includes('nytimes'))) {
        return (
            <div className="loading-div">
                <h1 className="loading-message">This tool only works with New York Times articles :(</h1>
            </div>
        )
    }
    if (nytError) {
        return (
            <div className="loading-div">
                <h1 className="loading-message">Too many New York Times API calls; wait 60 seconds</h1>
            </div>
        )
    }
    if (curr_url && (curr_url.includes('nytimes')) && (! curr_url.includes('html'))) {
        return (
            <div className="loading-div">
                <h1 className="loading-message">This is a New York Times page, but not an article!</h1>
            </div>
        )
    }
    if (articleTopic && articleTopic.includes('N/A')) {
        return (
            <div className="loading-div">
                <h1 className="loading-message">Current tab doesn't match a topic from our list!</h1>
            </div>
        )
    }
    if (articleTopic && user_data && relevantUpdatesBullets) {
        writeToDb(`/cache/${curr_user}/${articleTopic}/last_output`, relevantUpdatesBullets);
        writeToDb(`/cache/${curr_user}/${articleTopic}/last_url`, curr_url);
        writeToDb(`/cache/${curr_user}/${articleTopic}/sourcesUrls`, sourcesUrls);
        writeToDb(`/cache/${curr_user}/${articleTopic}/sourcesTitles`, sourcesTitles);
        writeToDb(`/cache/${curr_user}/${articleTopic}/last_date`, getTodayDate());
        if (! articleTopic.includes('N/A')) {
            return (<>
                        <LeftOffPage recent={false} last_url={last_url} bullet_points={relevantUpdatesBullets} date_viewed={date_viewed} topic={articleTopic} sources_urls={sourcesUrls} sources_titles={sourcesTitles} curr_user={curr_user}/>
                    </>)
        }
    } else {
        return (<div className="loading-div">
                    <h1 className="loading-message">Loading...</h1>
                    <LinearProgress/>
                </div>)
    }
}