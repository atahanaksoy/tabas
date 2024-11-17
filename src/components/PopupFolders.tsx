import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreatePopupFolder, PopupFolder } from "./PopupFolder";
import { Folder, Profile } from "../types";

interface PopupFoldersProps {
  selectedProfile: Profile;
  folders: Folder[];
  createFolder: (profileId: string, folderName: string) => void;
}

const PopupFolders: React.FC<PopupFoldersProps> = (props) => {
  const { selectedProfile, folders, createFolder } = props;

  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);

  const handleCreateFolder = (folderName: string) => {
    console.log("Creating folder:", folderName);
    createFolder(selectedProfile.id, folderName);
    setIsCreatingFolder(false);
  };

  const handleButtonClick = () => {
    console.log("Button clicked, setting isCreatingFolder to true");
    setIsCreatingFolder(true);
  };

  console.log(isCreatingFolder);

  return (
    <div className="flex flex-col w-full py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">
            Folders for{" "}
            <span className="text-accent">{selectedProfile.displayName}</span>
          </h1>
          <p className="text-sm text-gray-500">
            {folders.length} folder{folders.length > 1 && "s"}
          </p>
        </div>
        <button
          className="btn btn-sm flex items-center"
          onClick={handleButtonClick}
          disabled={isCreatingFolder}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
      {isCreatingFolder && folders.length > 0 && (
        <CreatePopupFolder onAddFolder={handleCreateFolder} />
      )}
      {folders.length === 0 ? (
        <div className="flex flex-col text-center my-4">
          <span className="text-sm text-gray-500">
            You seem to have no folders. Start by
          </span>
          <span
            className="text-sm text-secondary font-bold cursor-pointer"
            onClick={handleButtonClick}
          >
            creating a new folder!
          </span>
          {isCreatingFolder && (
            <CreatePopupFolder onAddFolder={handleCreateFolder} />
          )}
        </div>
      ) : (
        <div
          className="flex flex-col w-full my-4 pb-8"
          style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
        >
          {folders.map((folder, index) => (
            <div className="flex w-full justify-around my-2" key={index}>
              <PopupFolder
                folderName={folder.displayName}
                tabCount={folder.tabs.length}
                onSaveSession={function (): void {}}
                onSaveCurrentTab={function (): void {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopupFolders;
