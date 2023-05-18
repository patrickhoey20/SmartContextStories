import React, { useState } from "react";
import './LoginPage.css'
import { HomePage } from "../HomePage/HomePage";

export default function LoginPage() {
    const [currUser, setCurrUser] = useState("");
    const [hasRender, setRender] = useState(false);
    const onShow = React.useCallback(() => setRender(true), []);

    const getInput = (t) => {
        console.log(t);
        setCurrUser(t);
    }

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
            {hasRender && <HomePage currUser={currUser}/>}
        </>
    )
}