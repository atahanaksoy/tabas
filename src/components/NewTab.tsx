import React, { useEffect, useState } from "react";
import FoldersView from "./FoldersView";
import CreateProfileForm from "./CreateProfileForm";
import { Profile, Folder, Tab } from "../types";
import { getSelectedProfile, getProfiles, createFolder as createFolderInStorage, updateFolder as updateFolderInStorage, deleteFolder as deleteFolderInStorage, createTab as createTabInStorage, updateTab as updateTabInStorage, deleteTab as deleteTabInStorage } from "../services/ChromeStorageService";

export const NewTab = () => {
  const [tabId, setTabId] = useState<number | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    // We need to send message to check if Tabas is open as a tab so we avoid showing the extension in the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "isTabasOpen") {
        sendResponse({ isOpen: true });
      }
    });
    
    const fetchProfiles = async () => {
      try {
        const profiles = await getProfiles();
        setProfiles(() => [...profiles]);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    
    const fetchSelectedProfile = async () => {
      try {
        const profileId = await getSelectedProfile();
        if (profileId) {
          const profiles = await getProfiles();
          const profile = profiles.find(p => p.id === profileId);
          setSelectedProfile(() => (profile ? { ...profile } : null));
        }
      } catch (error) {
        console.error("Error fetching selected profile:", error);
      }
    };

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

  const createFolder = async (profileId: string, folderName: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      displayName: folderName,
      description: "",
      creationDate: new Date(),
      tabs: [],
    };
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return { ...profile, folders: [newFolder, ...profile.folders] };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    if (selectedProfile?.id === profileId) {
    }
    await createFolderInStorage(profileId, newFolder);
  };

  const updateFolder = async (profileId: string, folder: Folder) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map(f => (f.id === folder.id ? folder : f)),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await updateFolderInStorage(profileId, folder);
  };

  const deleteFolder = async (profileId: string, folderId: string) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.filter(f => f.id !== folderId),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await deleteFolderInStorage(profileId, folderId);
  };

  const createTab = async (profileId: string, folderId: string, tab: Tab) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map(f => {
            if (f.id === folderId) {
              return { ...f, tabs: [...f.tabs, tab] };
            }
            return f;
          }),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await createTabInStorage(profileId, folderId, tab);
  };

  const updateTab = async (profileId: string, folderId: string, tab: Tab) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map(f => {
            if (f.id === folderId) {
              return {
                ...f,
                tabs: f.tabs.map(t => (t.id === tab.id ? tab : t)),
              };
            }
            return f;
          }),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await updateTabInStorage(profileId, folderId, tab);
  };

  const deleteTab = async (profileId: string, folderId: string, tabId: string) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map(f => {
            if (f.id === folderId) {
              return {
                ...f,
                tabs: f.tabs.filter(t => t.id !== tabId),
              };
            }
            return f;
          }),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await deleteTabInStorage(profileId, folderId, tabId);
  };

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
          <FoldersView 
            profile={selectedProfile}
            onCreateFolder={createFolder}
            onUpdateFolder={updateFolder}
            onDeleteFolder={deleteFolder}
            onCreateTab={createTab}
            onUpdateTab={updateTab}
            onDeleteTab={deleteTab}
          />
        </div>
        <div className="col-span-2 p-4">
          open tabs here
        </div>
      </div>
    </div>
  );
};