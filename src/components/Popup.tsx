import React, { useState, useEffect } from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { TabiLogo } from "./TabiLogo";
import PopupFolders from "./PopupFolders";
import {
  getSelectedProfile,
  getProfiles,
  saveSelectedProfile,
  createFolder as createFolderInStorage,
} from "../services/ChromeStorageService";
import { Profile, Folder } from "../types";

export const Popup = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
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

    fetchProfiles();
    fetchSelectedProfile();
  }, []);

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
          />
        </div>
      )}
    </div>
  );
};
