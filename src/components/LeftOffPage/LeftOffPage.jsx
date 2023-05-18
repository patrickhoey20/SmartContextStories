import React from "react";
import './LeftOffPage.css';

export const LeftOffPage = (props) => {
    const { last_url, date_viewed, topic } = props;
    function getDaysPassed(inputtedDay) {
        var currentDate = new Date();
        var inputtedDate = new Date(inputtedDay);
        var timeDiff = currentDate.getTime() - inputtedDate.getTime();
        var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
        return daysPassed;
    }
    if (date_viewed != 'N/A') {
        return (
            <div className="centering">
                <div className="leftoff-card">
                    <div className="leftoff-card-contents">
                        <div className="card-h2">Here's what you missed about <span className="topic">{topic}</span></div>
                        <div className="card-h5">Since <a href={last_url} target="_blank">{date_viewed}</a> ({getDaysPassed(date_viewed)} days ago)</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="centering">
                <div className="leftoff-card">
                    <div className="leftoff-card-contents">
                        <div className="card-h2">Here's what you missed about <span className="topic">{topic}</span></div>
                        <div className="card-h5">First article viewed on this topic!</div>
                    </div>
                </div>
            </div>
        )
    }
}