import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css'
import { useDbData } from "../../utilities/firebase.js"
import { LeftOffPage } from '../LeftOffPage/LeftOffPage'
import { UpdatesPage } from '../UpdatesPage/UpdatesPage'
import { ChatGPTCall } from "../../utilities/api"

export default function HomePage() {
    // FIREBASE STUFF
    const [data, error] = useDbData('/');
    const [realdata, setRealData] = useState([])
    useEffect(() => {
        if (data) {
            setRealData(data)
        }
    }, [data])

    // EXAMPLE CHAT GPT API CALL
    // const [chatGPTResponse, setChatGPTResponse] = useState(null)
    // async function GPTResponse(prompt) {
    //     const response = await ChatGPTCall(prompt)
    //     setChatGPTResponse(response.choices[0].text.replace(/\n/g, ''))
    // }
    // let run = false
    // useEffect(() => { // useEffect so it only runs on page load (one API call per page load)
    //     if (! run) {
    //         run = true
    //         GPTResponse('What is the meaning of life?')
    //     }
    // }, [])
    // useEffect(() => {
    //     if (chatGPTResponse) {
    //         console.log(chatGPTResponse)
    //     }
    // }, [chatGPTResponse])

    // STEP 1: GET CURRENT URL, IDENTIFY TOPIC FROM PRE-DETERMINED LIST USING CHAT-GPT
    let topic = null
    let topics = `Russian Invasion of Ukraine, COVID-19 Pandemic, Opiod Epidemic, Trump Indictment and Arrest, 
                  2024 United States Presidential Election, The Stock Market`
    const [curr_url, setCurrURL] = useState(null)
    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            setCurrURL(activeTab.url)
          });
    }, [])
    const [chatGPTTopic, setChatGPTTopic] = useState(null)
    async function GPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setChatGPTTopic(response.choices[0].text.replace(/\n/g, ''))
    }
    let run = false
    useEffect(() => {
        if (! run && curr_url) {
            run = true
            console.log(curr_url)
            GPTResponse(`You're given this list of topics: ${topics}, and this URL: ${curr_url}. Identify which of the
                         topics given in this list matches with the content of the website that the URL links to. Output
                         the name of the topic exactly as formatted in the list. If none of the topics match the content
                         of the site, then output N/A.`)
        }
    }, [curr_url])
    useEffect(() => {
        if (chatGPTTopic) {
            console.log(chatGPTTopic)
        }
    }, [chatGPTTopic])

    // REACT CODE - FRONTEND STUFF
    return (<>
                <LeftOffPage/>
                <UpdatesPage recent={true}/>
                <UpdatesPage recent={false}/>
            </>)
}