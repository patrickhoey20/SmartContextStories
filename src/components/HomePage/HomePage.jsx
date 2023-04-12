import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css'
import { useDbData } from "../../utilities/firebase.js"
import { LeftOffPage } from '../LeftOffPage/LeftOffPage'
import { UpdatesPage } from '../UpdatesPage/UpdatesPage'


export default function HomePage() {
    const [data, error] = useDbData('/');
    const [realdata, setRealData] = useState([])
    useEffect(() => {
        if (data) {
            setRealData(data)
        }
    }, [data])
    return (<>
                <LeftOffPage/>
                <UpdatesPage recent={true}/>
                <UpdatesPage recent={false}/>
            </>)
}