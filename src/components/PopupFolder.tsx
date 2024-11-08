import React from "react";
import "daisyui/dist/full.css";

interface PopupFolderProps {
  folderName: string;
  tabCount: number;
  onSaveSession: () => void;
  onSaveCurrentTab: () => void;
}

const SaveSessionIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
);

const AddTabIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export const PopupFolder: React.FC<PopupFolderProps> = ({
  folderName,
  tabCount,
  onSaveSession,
  onSaveCurrentTab,
}) => {
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
            {SaveSessionIcon}
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip="Add Tab">
          <button
            className="btn btn-sm flex items-center"
            onClick={onSaveCurrentTab}
          >
            {AddTabIcon}
          </button>
        </div>
      </div>
    </div>
  );
};
