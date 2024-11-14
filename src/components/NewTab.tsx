import React, { useEffect, useState } from "react";
import FoldersView from "./FoldersView";
import CreateProfileForm from "./CreateProfileForm";
import { Profile, Folder, Tab } from "../types";
import { getSelectedProfile, getProfiles, saveSelectedProfile, createFolder as createFolderInStorage, updateFolder as updateFolderInStorage, deleteFolder as deleteFolderInStorage, createTab as createTabInStorage, updateTab as updateTabInStorage, deleteTab as deleteTabInStorage } from "../services/ChromeStorageService";

export const NewTab = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "isTabasOpen") {
        sendResponse({ isOpen: true });
      }
    });
    
    const fetchProfiles = async () => {
      const profiles = await getProfiles();
      setProfiles(profiles);
    };

    const fetchSelectedProfile = async () => {
      const profileId = await getSelectedProfile();
      if (profileId) {
        const profiles = await getProfiles();
        const profile = profiles.find(p => p.id === profileId);
        setSelectedProfile(profile || null);
        setFolders(profile?.folders || []);
      }
    };

    fetchProfiles();
    fetchSelectedProfile();
  }, []);

  const selectProfile = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
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
    const updatedProfiles = profiles.map(profile => {
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
    if (selectedProfile?.id === profileId) {
      setFolders(folders.map(f => (f.id === folder.id ? folder : f)));
    }
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
    if (selectedProfile?.id === profileId) {
      setFolders(folders.filter(f => f.id !== folderId));
    }
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
    if (selectedProfile?.id === profileId) {
      setFolders(
        folders.map(f => {
          if (f.id === folderId) {
            return { ...f, tabs: [...f.tabs, tab] };
          }
          return f;
        })
      );
    }
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
    if (selectedProfile?.id === profileId) {
      setFolders(
        folders.map(f => {
          if (f.id === folderId) {
            return {
              ...f,
              tabs: f.tabs.map(t => (t.id === tab.id ? tab : t)),
            };
          }
          return f;
        })
      );
    }
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
    if (selectedProfile?.id === profileId) {
      setFolders(
        folders.map(f => {
          if (f.id === folderId) {
            return {
              ...f,
              tabs: f.tabs.filter(t => t.id !== tabId),
            };
          }
          return f;
        })
      );
    }
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
          sidebar here
        </div>
        <div className="col-span-9 p-4">
          {selectedProfile && (
            <FoldersView 
              profile={selectedProfile}
              onCreateFolder={createFolder}
              onUpdateFolder={updateFolder}
              onDeleteFolder={deleteFolder}
              onCreateTab={createTab}
              onUpdateTab={updateTab}
              onDeleteTab={deleteTab}
            />
          )}
        </div>
        <div className="col-span-2 p-4">
          open tabs here
        </div>
      </div>
    </div>
  );
};