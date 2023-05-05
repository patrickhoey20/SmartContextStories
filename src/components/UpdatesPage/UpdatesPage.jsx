import React, { useState } from "react";
import './UpdatesPage.css'
import { SourcesPage } from "../SourcesPage/SourcesPage";

export const UpdatesPage = (props) => {
    const { recent, bullet_points, sources_urls, sources_titles } = props;
    const recentOrRelevant = recent ? "Most Recent" : "Most Relevant";

    const [showSourcesComponent, setShowSourcesComponent] = useState(false);

    const handleLinkClick = (e) => {
        e.preventDefault();
        setShowSourcesComponent(!showSourcesComponent);
    };

    return (
        <div className="centering">
            <div className="updates-card">
                <div className="updates-card-contents">
                    <h2 className="card-h2">Updates <span className="card-h2-span">- {recentOrRelevant}</span></h2>
                    <ul className="card-list">
                        <li className="card-list-item"><span className="card-list-item-span">{bullet_points[0]}</span></li>
                        <li className="card-list-item"><span className="card-list-item-span">{bullet_points[1]}</span></li>
                        <li className="card-list-item"><span className="card-list-item-span">{bullet_points[2]}</span></li>
                        <li className="card-list-item"><span className="card-list-item-span">{bullet_points[3]}</span></li>
                    </ul>
                </div>
                <div>
                    <h4 className="card-h4"><a className="sources-h4" href="#" onClick={handleLinkClick}>Sources</a></h4>
                    {showSourcesComponent && <SourcesPage sources_urls={sources_urls} sources_titles={sources_titles} />}
                </div>
            </div>
        </div>
    )
}