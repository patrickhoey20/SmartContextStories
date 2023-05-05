import React from "react";
import "./SourcesPage.css";

export const SourcesPage = (props) => {
  const { sources_urls, sources_titles } = props;

  const renderListItems = (sources_urls, sources_titles) => {
    const listItems = [];
    for (let i = 0; i < sources_urls.length; i++) {
      listItems.push(
        <li className="card-list-item-sources">
          <span className="card-list-item-span-sources">
            {sources_titles[i]}
            <a
              className="card-list-item-a"
              href={sources_urls[i]}
              target="_blank"
            >
              (link)
            </a>
          </span>
        </li>
      );
    }
    return listItems;
  };

  return (
    <div className="sources-card-contents">
      <ul className="card-list">
        {renderListItems(sources_urls, sources_titles)}
      </ul>
    </div>
  );
};
