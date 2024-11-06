import React, { useState } from 'react';
import { Folder, FoldersViewLayout } from '../types';
import { mockProfiles } from '../mocks';
import { PencilIcon, TrashIcon, FolderOpenIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Reorder, useDragControls } from "framer-motion";
import { AnimatePresence, motion } from 'framer-motion';
import "./FoldersView.css";

interface FoldersViewProps {
    layout?: FoldersViewLayout;
}

interface LayoutProps {
    folders: Folder[];
}

const FoldersView: React.FC<FoldersViewProps> = ({ layout = FoldersViewLayout.Compact }) => {
    const [selectedLayout, setSelectedLayout] = useState<FoldersViewLayout>(layout);
    const profile = mockProfiles[0];

    const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLayout(event.target.value as FoldersViewLayout);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="layout-select" className="mr-2">Choose Layout:</label>
                <select id="layout-select" value={selectedLayout} onChange={handleLayoutChange} className="select select-bordered">
                    <option value={FoldersViewLayout.Compact}>Compact</option>
                </select>
            </div>
            {selectedLayout === FoldersViewLayout.Compact && <CompactLayout folders={profile.folders} />}
        </div>
    );
};

export default FoldersView;

const CompactLayout: React.FC<LayoutProps> = ({ folders: initialFolders }) => {
    const [folders, setFolders] = useState(initialFolders);
    const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>(
        initialFolders.reduce((acc, folder) => {
            acc[folder.id] = true;
            return acc;
        }, {} as { [key: string]: boolean })
    );

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const dragControls = useDragControls();

    return (
        <Reorder.Group axis="y" values={folders} onReorder={setFolders}>
            {folders.map((folder) => (
                <Reorder.Item
                    key={folder.id}
                    value={folder}
                    dragListener={true}
                    dragControls={dragControls}
                    className="relative flex flex-col mb-2 w-full bg-base-200 rounded-lg p-4 group grab-cursor"
                >
                    <div className="flex items-center justify-between w-full pb-6">
                        <span className="text-lg font-bold">{folder.displayName}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="mx-4" onClick={() => {/* Open all tabs logic */}}>
                                <FolderOpenIcon className="h-4 w-4" />
                            </button>
                            <button className="mx-4" onClick={() => {/* Edit folder name logic */}}>
                                <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="mx-8" onClick={() => {/* Delete folder logic */}}>
                                <TrashIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => toggleFolder(folder.id)}>
                                {expandedFolders[folder.id] ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {expandedFolders[folder.id] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="ml-4 mt-2">
                                    {folder.tabs.map((tab) => (
                                        <div key={tab.id} className="flex items-center mb-1">
                                            <span className="mr-2">{tab.displayName}</span>
                                            {/* Additional tab actions can be added here */}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
};
