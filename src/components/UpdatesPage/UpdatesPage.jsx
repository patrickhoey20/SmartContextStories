import React, { useState, useEffect, useCallback } from "react";
import './UpdatesPage.css'
import { useDbData } from "../../utilities/firebase.js"

export const UpdatesPage = (props) => {
    const { recent } = props;
    const recentOrRelevant = recent ? "Most Recent" : "Most Relevant";
    return (
        <div className="centering">
            <div className="updates-card">
                <div className="updates-card-contents">
                    <h2 className="card-h2">Updates <span className="card-h2-span">- {recentOrRelevant}</span></h2>
                    <ul className="card-list">
                        <li className="card-list-item"><span className="card-list-item-span"></span></li>
                        <li className="card-list-item"><span className="card-list-item-span"></span></li>
                        <li className="card-list-item"><span className="card-list-item-span"></span></li>
                        <li className="card-list-item"><span className="card-list-item-span"></span></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}