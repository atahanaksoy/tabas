import {Folder, Profile, Tab } from './types';

export const mockTabs: Tab[] = [
    { id: "1", URL: "https://example.com", displayName: "Example", description: "Example description", notes: "Example notes" },
    { id: "2", URL: "https://example2.com", displayName: "Example2", description: "Example2 description", notes: "Example2 notes" },
    { id: "3", URL: "https://example3.com", displayName: "Example3", description: "Example3 description", notes: "Example3 notes" },
];

export const mockFolders: Folder[] = [
    { id: "1", displayName: "Folder 1", description: "Folder 1 description", creationDate: new Date(), tabs: mockTabs },
    { id: "2", displayName: "Folder 2", description: "Folder 2 description", creationDate: new Date(), tabs: mockTabs },
    { id: "3", displayName: "Folder 3", description: "Folder 3 description", creationDate: new Date(), tabs: mockTabs },
];

export const mockProfiles: Profile[] = [
    { id: "1", displayName: "Personal", description: "Personal profile", creationDate: new Date(), folders: mockFolders },
    { id: "2", displayName: "Work", description: "Work profile", creationDate: new Date(), folders: mockFolders },
    { id: "3", displayName: "Gaming", description: "Gaming profile", creationDate: new Date(), folders: mockFolders },
    { id: "4", displayName: "Travel", description: "Travel profile", creationDate: new Date(), folders: mockFolders },
    { id: "5", displayName: "Fitness", description: "Fitness profile", creationDate: new Date(), folders: mockFolders },
    { id: "6", displayName: "Music", description: "Music profile", creationDate: new Date(), folders: mockFolders },
    { id: "7", displayName: "Reading", description: "Reading profile", creationDate: new Date(), folders: mockFolders },
    { id: "8", displayName: "Cooking", description: "Cooking profile", creationDate: new Date(), folders: mockFolders },
    { id: "9", displayName: "Photography", description: "Photography profile", creationDate: new Date(), folders: mockFolders },
    { id: "10", displayName: "Blogging", description: "Blogging profile", creationDate: new Date(), folders: mockFolders },
    { id: "11", displayName: "Gardening", description: "Gardening profile", creationDate: new Date(), folders: mockFolders },
    { id: "12", displayName: "DIY", description: "DIY profile", creationDate: new Date(), folders: mockFolders },
    { id: "13", displayName: "Tech", description: "Tech profile", creationDate: new Date(), folders: mockFolders },
    { id: "14", displayName: "Fashion", description: "Fashion profile", creationDate: new Date(), folders: mockFolders },
    { id: "15", displayName: "Finance", description: "Finance profile", creationDate: new Date(), folders: mockFolders },
    { id: "16", displayName: "Education", description: "Education profile", creationDate: new Date(), folders: mockFolders },
];