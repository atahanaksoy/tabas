import React, { useState, useEffect } from "react";
import { Folder, Profile, Tab } from "../types";
import {
  PencilIcon,
  TrashIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Reorder, useDragControls } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import "./FoldersView.css";
import { useStateContext } from "./StateContext";

interface FoldersViewProps {
}

const FoldersView: React.FC<FoldersViewProps> = ({}) => {
  const { selectedProfile, folders, deleteFolder, updateProfileFolders, canAddTab } = useStateContext();

  const [localFolders, setLocalFolders] = useState(folders);
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean;
  }>(
    selectedProfile?.folders.reduce((acc, folder) => {
      acc[folder.id] = true;
      return acc;
    }, {} as { [key: string]: boolean }) || {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProfile) {
      setLocalFolders(selectedProfile.folders);
    }
  }, [selectedProfile]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleDeleteClick = (folderId: string) => {
    setFolderToDelete(folderId);
    setIsModalOpen(true);
  };
  const confirmDelete = async () => {
    if (folderToDelete && selectedProfile && localFolders) {
      await deleteFolder(selectedProfile.id, folderToDelete);
      setLocalFolders(localFolders.filter(folder => folder.id !== folderToDelete));
      setIsModalOpen(false);
      setFolderToDelete(null);
    }
  };
  const handleReorder = async (newFolders: Folder[]) => {
    if (selectedProfile) {
      setLocalFolders(newFolders);
      updateProfileFolders(selectedProfile.id, newFolders);
    }
  };

  const dragControls = useDragControls();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">
            Folders for <span className="text-accent">{selectedProfile && selectedProfile.displayName}</span>
          </h1>
          <p className="text-sm text-gray-500">{localFolders && localFolders.length} folder{localFolders && localFolders.length > 1 && "s"}</p>
        </div>
      </div>
      <div className="h-screen overflow-y-auto">
        <Reorder.Group axis="y" values={localFolders || []} onReorder={handleReorder}>
          {localFolders && localFolders.map((folder) => (
            <Reorder.Item
              key={folder.id}
              value={folder}
              dragListener={true}
              dragControls={dragControls}
              className="relative flex flex-col mb-2 w-full bg-base-200 rounded-lg p-4 group grab-cursor"
            >
              <div className="flex items-center justify-between w-full pb-6">
                <div className="flex items-center">
                  <span className="text-lg font-bold">{folder.displayName}</span>
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="ml-2"
                  >
                    {expandedFolders[folder.id] ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="mx-4"
                    onClick={() => {
                      /* Open all tabs logic */
                    }}
                  >
                    <FolderOpenIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="mx-4"
                    onClick={() => {
                      /* Edit folder name logic */
                    }}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="mx-4"
                    onClick={() => handleDeleteClick(folder.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expandedFolders[folder.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Reorder.Group
                      values={folder.tabs}
                      onReorder={(newTabs) => {
                        const updatedFolders = localFolders.map((f) =>
                          f.id === folder.id ? { ...f, tabs: newTabs } : f
                        );
                        setLocalFolders(updatedFolders);
                      }}
                    ></Reorder.Group>
                    <div className="ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {folder.tabs.map((tab) => (
                        <Reorder.Item
                          drag={true}
                          key={tab.id}
                          value={tab}
                          className="flex items-center mb-1 p-4 bg-base-300 rounded-lg"
                        >
                          <span className="mr-2 text-base font-medium">
                            {tab.displayName}
                          </span>
                          {/* Additional tab actions can be added here */}
                        </Reorder.Item>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-300 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p>Are you sure that you want to delete the folder?</p>
            <div className="mt-4 flex justify-end">
              <button className="btn btn-primary mr-2" onClick={confirmDelete}>
                Yes
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoldersView;