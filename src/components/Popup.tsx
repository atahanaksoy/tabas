import React from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { TabiLogo } from "./TabiLogo";
import PopupFolders from "./PopupFolders";



export const Popup = () => {
  return (
    <div
      data-theme="dim"
      className="p-4"
      style={{ width: "420px", maxHeight: "600px", minHeight: "300px" }}
    >
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-between">
          <ProfileDrawer />
          <TabiLogo />
        </div>
          <PopupFolders />
      </div>
    </div>
  );
};
