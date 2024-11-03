import React from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { TabiLogo } from "./TabiLogo";
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

export const Popup = () => {
  return (
    <div
      data-theme="cupcake"
      className="p-4"
      style={{ width: "420px", maxHeight: "600px", minHeight: "300px" }}
    >
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-between">
          <ProfileDrawer />
          <TabiLogo />
        </div>
        <div className="flex flex-col w-full mt-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
          {dummyFolders.map((folder, index) => (
            <div className="flex w-full justify-around mb-2" key={index}>
              <PopupFolder
                folderName={folder.folderName}
                tabCount={folder.tabCount} onSaveSession={function (): void {
                  throw new Error("Function not implemented.");
                } } onSaveCurrentTab={function (): void {
                  throw new Error("Function not implemented.");
                } }              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
