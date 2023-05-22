import React, { useState } from "react";
import './LeftOffPage.css';
import { SourcesPage } from "../SourcesPage/SourcesPage";

export const LeftOffPage = (props) => {
    const { last_url, date_viewed, topic, recent, bullet_points, sources_urls, sources_titles } = props;
    function getDaysPassed(inputtedDay) {
        var currentDate = new Date();
        var inputtedDate = new Date(inputtedDay);
        var timeDiff = currentDate.getTime() - inputtedDate.getTime();
        var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
        return daysPassed;
    }

    const recentOrRelevant = recent ? "Most Recent" : "Most Relevant";

    const [showSourcesComponent, setShowSourcesComponent] = useState(false);

    const handleLinkClick = (e) => {
        e.preventDefault();
        setShowSourcesComponent(!showSourcesComponent);
    };

    if (date_viewed != 'N/A') {
        return (
            <div className="centering">
                <div className="leftoff-card">
                    <div className="leftoff-card-contents">
                        <div className="card-h2">Here's what you missed about <span className="topic">{topic}</span></div>
                        <div className="card-h5">Since <a href={last_url} target="_blank">{date_viewed}</a> ({getDaysPassed(date_viewed)} days ago)</div>
                        <p></p>
                        <ul className="card-list">
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[0]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[1]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[2]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[3]}</span></li>
                        </ul>
                        <h4 className="card-h4"><a className="sources-h4" href="#" onClick={handleLinkClick}>Sources</a></h4>
                        {showSourcesComponent && <SourcesPage sources_urls={sources_urls} sources_titles={sources_titles} />}
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
                        <p></p>
                        <ul className="card-list">
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[0]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[1]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[2]}</span></li>
                            <li className="card-list-item"><span className="card-list-item-span">{bullet_points[3]}</span></li>
                        </ul>
                        <h4 className="card-h4"><a className="sources-h4" href="#" onClick={handleLinkClick}>Sources</a></h4>
                        {showSourcesComponent && <SourcesPage sources_urls={sources_urls} sources_titles={sources_titles} />}
                    </div>
                </div>
            </div>
        )
    }
}