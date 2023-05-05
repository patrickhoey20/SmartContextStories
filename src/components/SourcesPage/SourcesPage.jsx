import React from "react";
import "./SourcesPage.css";

export const SourcesPage = (props) => {
  const { sources_urls, sources_titles } = props;

  return (
    <div className="sources-card-contents">
      <ul className="card-list">
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[0]} 
            <a className="card-list-item-a" href={sources_urls[0]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[1]} 
            <a className="card-list-item-a" href={sources_urls[1]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[2]} 
            <a className="card-list-item-a" href={sources_urls[2]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[3]} 
            <a className="card-list-item-a" href={sources_urls[3]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[4]} 
            <a className="card-list-item-a" href={sources_urls[4]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[5]} 
            <a className="card-list-item-a" href={sources_urls[5]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[6]} 
            <a className="card-list-item-a" href={sources_urls[6]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[7]} 
            <a className="card-list-item-a" href={sources_urls[7]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[8]} 
            <a className="card-list-item-a" href={sources_urls[8]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[9]} 
            <a className="card-list-item-a" href={sources_urls[9]} target="_blank">
                 (link)
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
};
