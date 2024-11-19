import React, { useState } from "react";
import { PlusIcon, FolderArrowDownIcon } from "@heroicons/react/24/outline";

interface PopupFolderProps {
  folderName: string;
  tabCount: number;
  onSaveSession: () => void;
  onSaveCurrentTab: () => void;
  canAddTab: boolean;
}

export const PopupFolder: React.FC<PopupFolderProps> = ({
  folderName,
  tabCount,
  onSaveSession,
  onSaveCurrentTab,
  canAddTab,
}) => {
  console.log("canaddtab is", canAddTab);
  return (
    <div className="popup-folder p-4 bg-base-200 w-full flex justify-between items-center rounded-lg">
      <div>
        <h3 className="text-md font-bold">{folderName}</h3>
        <p className="text-sm">{tabCount} tabs</p>
      </div>
      <div className="flex space-x-2">
        <div className="tooltip tooltip-bottom" data-tip="Save Session">
          <button
            className="btn btn-sm flex items-center"
            onClick={onSaveSession}
          >
            <FolderArrowDownIcon className="h-4 w-4" cursor="pointer"/>
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={canAddTab ? "Add Tab" : "Tab already added"}>
          <button
            disabled={!canAddTab}
            className="btn btn-sm flex items-center"
            onClick={onSaveCurrentTab}
            >
            <PlusIcon className="h-4 w-4" cursor="pointer"/>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreatePopupFolderProps {
  onAddFolder: (folderName: string) => void;
}

export const CreatePopupFolder: React.FC<CreatePopupFolderProps> = ({ onAddFolder }) => {
  const [folderName, setFolderName] = useState('');

  const handleAddFolder = () => {
    if (folderName.trim()) {
      onAddFolder(folderName);
      setFolderName('');
    }
  };

  return (
    <div className="flex items-center w-full mt-4 p-2">
      <textarea
        className="textarea textarea-bordered w-full h-8 resize-none"
        placeholder="Enter folder name"
        value={folderName}
        maxLength={20}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <button className="btn btn-sm flex items-center ml-4 btn-primary" onClick={handleAddFolder}>
        Save
      </button>
    </div>
  );
};
