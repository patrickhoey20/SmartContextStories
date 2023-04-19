import React, { useState, useEffect, useCallback } from "react";;
import './LeftOffPage.css';
import { TextField } from "@mui/material";

export const LeftOffPage = (props) => {
    const { last_url, bullet_points, date_viewed } = props;
    return (
        <div className="centering">
            <div className="leftoff-card">
                <div className="leftoff-card-contents">
                    <h2 className="card-h2">Where You Left Off</h2>
                    <h4 className="card-h4">Last Article You Viewed:</h4>
                    <div className="centering">
                        <TextField 
                            variant="standard"
                            disabled 
                            sx={{
                                background: '#d9d9d9', 
                                borderRadius: '10px',
                                width: '100%',
                                fontFamily: 'Iowan Old Style Bold',
                                fontSize: '1.5rem',
                                height: '3rem'
                            }}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            inputProps={{
                                style: { 
                                    fontFamily: 'Iowan Old Style Bold', 
                                    fontSize: '1.5rem' 
                                }
                            }}
                            value={last_url ? last_url : "No URL Found"}
                        />
                    </div>
                    <h5 className="card-h5">Date Viewed: {date_viewed}</h5>
                    <h4 className="card-h4">Summary of What You've Already Read:</h4>
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