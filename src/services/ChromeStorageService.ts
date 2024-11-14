import { Profile, Folder, Tab } from "../types";

const PROFILES_KEY = "tabas.profiles";
const SELECTED_PROFILE_KEY = "tabas.selectedProfile";

// Save profiles to Chrome storage
export const saveProfiles = (profiles: Profile[], newProfileId?: string) => {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.set({ [PROFILES_KEY]: profiles }, async () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        if (newProfileId) {
          try {
            await saveSelectedProfile(newProfileId);
          } catch (error) {
            reject(error);
            return;
          }
        }
        resolve();
      }
    });
  });
};

// Get profiles from Chrome storage
export const getProfiles = (): Promise<Profile[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([PROFILES_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[PROFILES_KEY] || []);
      }
    });
  });
};

// Create a new profile
export const createProfile = async (profile: Profile) => {
  const profiles = await getProfiles();
  profiles.push(profile);
  await saveProfiles(profiles, profile.id);
};

// Save selected profile to Chrome storage
export const saveSelectedProfile = (profileId: string) => {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.set({ [SELECTED_PROFILE_KEY]: profileId }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

// Get selected profile from Chrome storage
export const getSelectedProfile = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([SELECTED_PROFILE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[SELECTED_PROFILE_KEY] || null);
      }
    });
  });
};

// Delete a profile
export const deleteProfile = async (profileId: string) => {
  const profiles = await getProfiles();
  const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
  await saveProfiles(updatedProfiles);
};

// Create a folder
export const createFolder = async (profileId: string, folder: Folder) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    profile.folders.unshift(folder); // Add the new folder to the beginning of the list
    await saveProfiles(profiles);
  }
};

// Update a folder
export const updateFolder = async (profileId: string, folder: Folder) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    const folderIndex = profile.folders.findIndex(f => f.id === folder.id);
    if (folderIndex !== -1) {
      profile.folders[folderIndex] = folder;
      await saveProfiles(profiles);
    }
  }
};

// Delete a folder
export const deleteFolder = async (profileId: string, folderId: string) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    profile.folders = profile.folders.filter(folder => folder.id !== folderId);
    await saveProfiles(profiles);
  }
};

// Update folders of a given profile
export const updateProfileFolders = async (profileId: string, folders: Folder[]) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    profile.folders = folders;
    await saveProfiles(profiles);
  }
};

// Create a tab
export const createTab = async (profileId: string, folderId: string, tab: Tab) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    const folder = profile.folders.find(f => f.id === folderId);
    if (folder) {
      folder.tabs.push(tab);
      await saveProfiles(profiles);
    }
  }
};

// Update a tab
export const updateTab = async (profileId: string, folderId: string, tab: Tab) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    const folder = profile.folders.find(f => f.id === folderId);
    if (folder) {
      const tabIndex = folder.tabs.findIndex(t => t.id === tab.id);
      if (tabIndex !== -1) {
        folder.tabs[tabIndex] = tab;
        await saveProfiles(profiles);
      }
    }
  }
};

// Delete a tab
export const deleteTab = async (profileId: string, folderId: string, tabId: string) => {
  const profiles = await getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    const folder = profile.folders.find(f => f.id === folderId);
    if (folder) {
      folder.tabs = folder.tabs.filter(tab => tab.id !== tabId);
      await saveProfiles(profiles);
    }
  }
};