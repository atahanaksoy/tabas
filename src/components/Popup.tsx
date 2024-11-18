import React, { useState, useEffect } from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { TabiLogo } from "./TabiLogo";
import PopupFolders from "./PopupFolders";
import { useStateContext } from "./StateContext";

export const Popup = () => {
  const { selectedProfile, profiles, folders, selectProfile, createFolder, saveCurrentTab } = useStateContext();
  const [isTabasOpen, setIsTabasOpen] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { message: "isTabasOpen" },
          (response) => {
            if (response && response.isOpen) {
              setIsTabasOpen(true);
            }
          }
        );
      }
    });
  }, [isTabasOpen])

  if (!selectedProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div
      data-theme="dim"
      className="p-4 overflow-hidden"
      style={{ width: "420px", maxHeight: "500px", minHeight: "300px" }}
    >
      {isTabasOpen ? (
        <div className="flex flex-col items-center min-h-full">
          <div className="text-center text-lg font-bold text-secondary">
            Tabas is already open!
          </div>
          <div className="text-center text-sm">
            Please close the new tab page to use this popup.
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex w-full justify-between">
            <ProfileDrawer
              profiles={profiles}
              selectedProfile={selectedProfile}
              selectProfile={selectProfile}
            />
            <TabiLogo />
          </div>
          <PopupFolders
            selectedProfile={selectedProfile}
            folders={folders}
            createFolder={createFolder}
            saveCurrentTab={saveCurrentTab}
          />
        </div>
      )}
    </div>
  );
};