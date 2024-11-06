export enum FoldersViewLayout {
    Compact = 'compact'
}

export type Tab = {
    id: string;
    URL: string;
    displayName: string;
    description?: string;
    notes?: string;
};

export type Folder = {
    id: string;
    description?: string;
    notes?: string;
    displayName: string;
    creationDate: Date;
    tabs: Tab[];
};

export type Profile = {
    id: string;
    displayName: string;
    description?: string;
    creationDate: Date;
    folders: Folder[];
};