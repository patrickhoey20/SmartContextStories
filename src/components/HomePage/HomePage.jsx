import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css';
import { useDbData } from "../../utilities/firebase.js";
import { LeftOffPage } from "../LeftOffPage/LeftOffPage";
import { UpdatesPage } from "../UpdatesPage/UpdatesPage";
import { ChatGPTCall } from "../../utilities/api";
import axios from "axios"; // todo: do we need this????

export default function HomePage() {
    // FIREBASE STUFF
    var curr_user = 'Joe Shmoe' // change this based on user id from Google later
    const [data, error] = useDbData('/');
    const [user_data, setUserData] = useState(null)
    useEffect(() => {
        if (data) {
            setUserData(data.users[curr_user])
            console.log("setting user_data to", data.users[curr_user])
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
    async function GPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setChatGPTTopic(response.choices[0].text.replace(/\n/g, ''))
        console.log("setting chatGPTTopic to", response.choices[0].text.replace(/\n/g, ''))
    }
    let run = false
    useEffect(() => { // find topic using URL and Chat GPT
        if (! run && curr_url) {
            run = true
            GPTResponse(`You're given this list of topics: ${topics}, and this URL: ${curr_url}. Identify which of the
                         topics given in this list matches with the content of the website that the URL links to. Output
                         the name of the topic exactly as formatted in the list. If none of the topics match the content
                         of the site, then output N/A.`)
        }
    }, [curr_url])

    // STEP 3: Get info from NYT API relavant to the current topic
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        const apiKey = import.meta.env.VITE_NYT_API_KEY;
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&api-key=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => setArticles(data.response.docs))
            .catch(error => console.log("error", error));
    }, []);

    // REACT CODE - FRONTEND STUFF
    if (chatGPTTopic && user_data) {
        return (<>
                    <LeftOffPage last_url={user_data[chatGPTTopic].last_article_url}/>
                    <UpdatesPage recent={true}/>
                    <UpdatesPage recent={false}/>
                </>)
    } else {
        return (<h1 className="loading-message">Loading...</h1>)
    }
}