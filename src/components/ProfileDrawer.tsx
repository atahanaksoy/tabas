import React, { useState, useEffect, useRef } from "react";
import { Profile } from "../types";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface ProfileDrawerProps {
  profiles: Profile[],
  selectedProfile: Profile
  selectProfile: (selectedProfileId: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = (props) => {
  const { profiles, selectedProfile, selectProfile } = props;
  const drawerCheckboxRef = useRef<HTMLInputElement>(null);

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
      />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="drawer-button">
          <Bars3Icon className="h-4 w-4" cursor="pointer" />
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay h-100"></label>
        <ul className="menu p-4 bg-base-200 min-h-full w-60 text-base-content">
          <li className="menu-title sticky top-0 bg-base-200 z-10 flex justify-between">
            <span>Profiles</span>
          </li>
          <div className="overflow-y-auto top-0" style={{ maxHeight: "80vh" }}>
            {profiles.map((profile) => (
              <li key={profile.id} className="flex justify-between space-x-2">
                <div
                  className={`flex flex-1 ${
                    selectedProfile?.id === profile.id ? "bg-base-300" : ""
                  }`}
                >
                  <button
                    onClick={() => selectProfile(profile.id)}
                    className="text-left flex-1"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-8 rounded-full mr-2">
                        <span className="text-xs">
                          {profile.displayName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    {profile.displayName}
                  </button>
                </div>
              </li>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};
