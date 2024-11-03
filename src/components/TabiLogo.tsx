import React from "react";

export const TabiLogo = () => {
    const handleTabiClick = () => {
      chrome.tabs.create({ url: "chrome://newtab" });
    };
  
    return (
      <div className="flex items-center ml-4">
        <span
          className="text-xl font-bold cursor-pointer hover:text-secondary"
          onClick={handleTabiClick}
        >
          tabi
        </span>
      </div>
    );
  };
  