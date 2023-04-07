import React, { useState, useEffect, useCallback } from "react";
import './HomePage.css'
import { useDbData } from "../../utilities/firebase.js"

export default function HomePage() {
    const [data, error] = useDbData('/');
    const [realdata, setRealData] = useState([])
    useEffect(() => {
        if (data) {
            setRealData(data)
        }
    }, [data])
    return (<>
                <h1>{JSON.stringify(realdata)}</h1>
            </>)
}