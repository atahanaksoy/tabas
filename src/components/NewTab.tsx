import React, { useEffect, useState } from "react";
import FoldersView from "./FoldersView";
import CreateProfileForm from "./CreateProfileForm";
import { useStateContext } from "./StateContext";

export const NewTab = () => {
  const [tabId, setTabId] = useState<number | null>(null);
  const {fetchProfiles, fetchSelectedProfile, selectedProfile, profiles} = useStateContext();
  useEffect(() => {
    // We need to send message to check if Tabas is open as a tab so we avoid showing the extension in the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "isTabasOpen") {
        sendResponse({ isOpen: true });
      }
    });

    const fetchTabIdFromChrome = async () => {
        const tab = await chrome.tabs.getCurrent();
        setTabId(tab?.id || null);
    }

    const handleTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.id === tabId) {
        await fetchProfiles();
        await fetchSelectedProfile();
      }
    };

    fetchTabIdFromChrome().then(() => {
      chrome.tabs.onActivated.addListener(handleTabActivated);
    });

    fetchProfiles();
    fetchSelectedProfile();

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
    };
  }, [tabId]);

  if (!selectedProfile) {
    return <div>Loading...</div>;
  }

  if (profiles.length === 0) {
    return <CreateProfileForm onProfileCreated={() => window.location.reload()} />;
  }

  return (
    <div data-theme="dim" className="w-screen h-screen overflow-hidden">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-1 p-4">
          profiles here
        </div>
        <div className="col-span-9 p-4">
          <FoldersView />
        </div>
        <div className="col-span-2 p-4">
          open tabs here
        </div>
      </div>
    </div>
  );
};