import React, { createContext, useContext, useState, useEffect } from "react";
import { getSelectedProfile, getProfiles, saveSelectedProfile, createFolder as createFolderInStorage, updateFolder as updateFolderInStorage, deleteFolder as deleteFolderInStorage, createTab as createTabInStorage, updateTab as updateTabInStorage, deleteTab as deleteTabInStorage, updateProfileFolders as updateProfileFoldersInStorage } from "../services/ChromeStorageService";
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
  deleteTab: (profileId: string, folderId: string, tabId: string) => Promise<void>;
  saveCurrentTab: (folderId: string) => Promise<void>;
  updateProfileFolders: (profileId: string, folders: Folder[]) => Promise<void>;
  fetchProfiles: () => Promise<void>;
  fetchSelectedProfile: () => Promise<void>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    fetchProfiles();
    fetchSelectedProfile();
  }, []);

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
          folders: profile.folders.map((f) => (f.id === folder.id ? folder : f)),
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

  const deleteTab = async (profileId: string, folderId: string, tabId: string) => {
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
      };

      const updatedProfiles = profiles.map((profile) => {
        if (profile.id === selectedProfile.id) {
          return {
            ...profile,
            folders: profile.folders.map((folder) => {
              if (folder.id === folderId) {
                return { ...folder, tabs: [...folder.tabs, newTab] };
              }
              return folder;
            }),
          };
        }
        return profile;
      });

      setProfiles(updatedProfiles);
      setFolders(updatedProfiles.find((p) => p.id === selectedProfile.id)?.folders || []);
      await createTabInStorage(selectedProfile.id, folderId, newTab);
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
    <StateContext.Provider value={{ fetchProfiles, fetchSelectedProfile, selectedProfile, profiles, folders, selectProfile, createFolder, updateFolder, deleteFolder, createTab, updateTab, deleteTab, saveCurrentTab, updateProfileFolders }}>
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