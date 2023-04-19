import React, { useState, useEffect, useCallback } from "react";
import './UpdatesPage.css'

export const UpdatesPage = (props) => {
    const { recent, bullet_points } = props;
    const recentOrRelevant = recent ? "Most Recent" : "Most Relevant";
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
            </div>
        </div>
    )
}