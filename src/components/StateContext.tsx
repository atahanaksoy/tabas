import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getSelectedProfile,
  getProfiles,
  saveSelectedProfile,
  createFolder as createFolderInStorage,
  updateFolder as updateFolderInStorage,
  deleteFolder as deleteFolderInStorage,
  createTab as createTabInStorage,
  updateTab as updateTabInStorage,
  deleteTab as deleteTabInStorage,
  updateProfileFolders as updateProfileFoldersInStorage,
} from "../services/ChromeStorageService";
import { Profile, Folder, Tab } from "../types";

interface StateContextProps {
  selectedProfile: Profile | null;
  profiles: Profile[];
  folders: Folder[];
  selectProfile: (profileId: string) => Promise<void>;
  createFolder: (profileId: string, folderName: string) => Promise<void>;
  updateFolder: (profileId: string, folder: Folder) => Promise<void>;
  deleteFolder: (profileId: string, folderId: string) => Promise<void>;
  createTab: (profileId: string, folderId: string, tab: Tab) => Promise<void>;
  updateTab: (profileId: string, folderId: string, tab: Tab) => Promise<void>;
  deleteTab: (
    profileId: string,
    folderId: string,
    tabId: string
  ) => Promise<void>;
  saveCurrentTab: (folderId: string) => Promise<void>;
  updateProfileFolders: (profileId: string, folders: Folder[]) => Promise<void>;
  fetchProfiles: () => Promise<void>;
  fetchSelectedProfile: () => Promise<void>;
  canAddTab: (folderId: string, tabUrl: string) => boolean;
  canAddCurrentTab: (folderId: string) => boolean;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activePageUrl, setActivePageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
    fetchSelectedProfile();
    updateActivePageUrl();

    chrome.tabs.onActivated.addListener(updateActivePageUrl);
    chrome.tabs.onUpdated.addListener(updateActivePageUrl);

    return () => {
      chrome.tabs.onActivated.removeListener(updateActivePageUrl);
      chrome.tabs.onUpdated.removeListener(updateActivePageUrl);
    };
  }, []);

  const canAddCurrentTab = (folderId: string) => {
    return canAddTab(folderId, activePageUrl || "");
  }

  const canAddTab = (folderId: string, tabUrl: string): boolean => {
    if (!selectedProfile) {
      console.log("no selected profile");
      return true;
    }

    const folder = selectedProfile.folders.find((f) => f.id === folderId);
    if (!folder) {
      console.log("no folder with the id", folderId);
      return true;
    }

    const tabExists = folder.tabs.some((t) => t.URL === tabUrl);
    console.log("tabExists", tabExists);
    return !tabExists;
  }

  const fetchProfiles = async () => {
    const profiles = await getProfiles();
    setProfiles(profiles);
  };

  const fetchSelectedProfile = async () => {
    const profileId = await getSelectedProfile();
    if (profileId) {
      const profiles = await getProfiles();
      const profile = profiles.find((p) => p.id === profileId);
      setSelectedProfile(profile || null);
      setFolders(profile?.folders || []);
    }
  };

  const updateActivePageUrl = async () => {
    const activeTab = await new Promise<chrome.tabs.Tab>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      });
    });

    if (activeTab && activeTab.url) {
      console.log("Active page URL:", activeTab.url);
      setActivePageUrl(activeTab.url);
    }
  };

  const selectProfile = async (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    setSelectedProfile(profile || null);
    setFolders(profile?.folders || []);
    await saveSelectedProfile(profileId);
  };

  const createFolder = async (profileId: string, folderName: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      displayName: folderName,
      description: "",
      creationDate: new Date(),
      tabs: [],
    };
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return { ...profile, folders: [newFolder, ...profile.folders] };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    if (selectedProfile?.id === profileId) {
      setFolders([newFolder, ...folders]);
    }
    await createFolderInStorage(profileId, newFolder);
  };

  const updateFolder = async (profileId: string, folder: Folder) => {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map((f) =>
            f.id === folder.id ? folder : f
          ),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await updateFolderInStorage(profileId, folder);
  };

  const deleteFolder = async (profileId: string, folderId: string) => {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.filter((f) => f.id !== folderId),
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    await deleteFolderInStorage(profileId, folderId);
  };

  const createTab = async (profileId: string, folderId: string, tab: Tab) => {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map((f) => {
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
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map((f) => {
            if (f.id === folderId) {
              return {
                ...f,
                tabs: f.tabs.map((t) => (t.id === tab.id ? tab : t)),
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

  const deleteTab = async (
    profileId: string,
    folderId: string,
    tabId: string
  ) => {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          folders: profile.folders.map((f) => {
            if (f.id === folderId) {
              return {
                ...f,
                tabs: f.tabs.filter((t) => t.id !== tabId),
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

  const saveCurrentTab = async (folderId: string) => {
    const activeTab = await new Promise<chrome.tabs.Tab>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      });
    });

    if (selectedProfile && activeTab) {
      const newTab: Tab = {
        id: activeTab.id?.toString() || Date.now().toString(),
        displayName: activeTab.title || "Untitled",
        URL: activeTab.url || "",
        faviconUrl: activeTab.favIconUrl || "",
      };

      // Create the tab in storage
      await createTabInStorage(selectedProfile.id, folderId, newTab);

      // Fetch the updated profiles
      await fetchSelectedProfile();
    }
  };

  const updateProfileFolders = async (profileId: string, folders: Folder[]) => {
    await updateProfileFoldersInStorage(profileId, folders);
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return { ...profile, folders };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    if (selectedProfile?.id === profileId) {
      setFolders(folders);
    }
  };

  return (
    <StateContext.Provider
      value={{
        canAddCurrentTab,
        canAddTab,
        fetchProfiles,
        fetchSelectedProfile,
        selectedProfile,
        profiles,
        folders,
        selectProfile,
        createFolder,
        updateFolder,
        deleteFolder,
        createTab,
        updateTab,
        deleteTab,
        saveCurrentTab,
        updateProfileFolders,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
