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
    // CHAT GPT API STUFF
    const [chatGPTResponse, setChatGPTResponse] = useState(null)
    async function GPTResponse(prompt) {
        const response = await ChatGPTCall(prompt)
        setChatGPTResponse(response.choices[0].text.replace(/\n/g, ''))
    }
    let run = false
    useEffect(() => { // useEffect so it only runs on page load (one API call per page load)
        if (! run) {
            run = true
            GPTResponse('What is the meaning of life?')
        }
    }, [])
    useEffect(() => {
        if (chatGPTResponse) {
            console.log(chatGPTResponse)
        }
    }, [chatGPTResponse])
    // REACT CODE - FRONTEND STUFF
    return (<>
                <LeftOffPage/>
                <UpdatesPage recent={true}/>
                <UpdatesPage recent={false}/>
            </>)
}