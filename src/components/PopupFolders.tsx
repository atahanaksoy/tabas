import React from "react";
import { PopupFolder } from "./PopupFolder";

const dummyFolders = [
  { folderName: "Work", tabCount: 5 },
  { folderName: "Personal", tabCount: 3 },
  { folderName: "Travel", tabCount: 7 },
  { folderName: "Shopping", tabCount: 2 },
  { folderName: "Research", tabCount: 4 },
  { folderName: "Fitness", tabCount: 6 },
  { folderName: "Finance", tabCount: 8 },
  { folderName: "Hobbies", tabCount: 5 },
  { folderName: "Education", tabCount: 9 },
  { folderName: "Entertainment", tabCount: 3 },
];

const PopupFolders: React.FC = () => {
  return (
    <div className="flex flex-col w-full mt-4">
      <div
        className="flex flex-col w-full"
        style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
      >
        {dummyFolders.map((folder, index) => (
          <div className="flex w-full justify-around mb-2" key={index}>
            <PopupFolder
              folderName={folder.folderName}
              tabCount={folder.tabCount}
              onSaveSession={function (): void {}}
              onSaveCurrentTab={function (): void {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopupFolders;
