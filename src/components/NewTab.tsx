import React from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import FoldersView from "./FoldersView";

export const NewTab = () => {
  return (
    <div data-theme="dim" className="w-screen h-screen">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-2 p-4">
          <ProfileDrawer showCreateProfileButton={true} />
        </div>
        <div className="col-span-10 py-8 pr-8">
          <FoldersView />
        </div>
      </div>
    </div>
  );
};
