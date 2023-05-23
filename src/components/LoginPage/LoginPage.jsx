import React, { useState, useEffect } from "react";
import './LoginPage.css'
import { HomePage } from "../HomePage/HomePage";
import { saveUsername, getUsername } from '../../utilities/storage';

export default function LoginPage() {
    const [currUser, setCurrUser] = useState("");
    const [hasRender, setRender] = useState(false);
    const [cachedUser, setCachedUser] = useState(false);
    const onShow = React.useCallback(() => setRender(true), []);

    const getInput = (t) => {
        saveUsername(t);
        setCurrUser(t);
    }

    useEffect(() => {
        let username = getUsername()
        console.log(username)
        if (username) {
            setCachedUser(true)
            setCurrUser(username);
            onShow()
        }
      }, []);

    return (
        <>
            <div className="centering" style={!hasRender ? {} : { display: 'none' }}>
                <div className="login-card">
                    <div className="login-card-contents">
                        <h1 className="card-h1">Smart Context Stories</h1>
                        <h2 className="card-h2">Enter your username:</h2>
                        <input className="card-input" type="text" placeholder="username" onChange={(e) => getInput(e.target.value)}></input>
                        <button className="login-button" onClick={onShow}>Log In!</button>
                    </div>
                </div>
            </div>
            {(hasRender || cachedUser) && <HomePage currUser={currUser} retry={false}/>}
        </>
    )
}