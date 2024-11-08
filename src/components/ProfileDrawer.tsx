import React, { useState, useRef } from "react";
import { mockProfiles } from "../mocks";
import { Profile } from "../types";

const DrawerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 9h16.5m-16.5 6.75h16.5"
    />
  </svg>
);

interface ProfileDrawerProps {
  showCreateProfileButton?: boolean;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  showCreateProfileButton = false,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const drawerCheckboxRef = useRef<HTMLInputElement>(null);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

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
          {DrawerIcon}
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay h-100"></label>
        <ul className="menu p-4 bg-base-200 min-h-full w-60 text-base-content">
          <li className="menu-title sticky top-0 bg-base-200 z-10">
            <span>Profiles</span>
          </li>
          <div className="overflow-y-auto top-0" style={{maxHeight: "72vh"}}>
            {mockProfiles.map((profile) => (
              <li key={profile.id} className="flex space-x-2">
                <button
                  onClick={() => handleProfileSelect(profile)}
                  className={`text-left ${
                    selectedProfile?.id === profile.id ? "bg-base-300" : ""
                  }`}
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                      <span className="text-xs">{profile.displayName.charAt(0)}</span>
                    </div>
                  </div>
                  {profile.displayName}
                </button>
              </li>
            ))}
          </div>
          {showCreateProfileButton && (
            <div className="w-full flex">
              <button className="mx-auto btn btn-primary mt-4">Add new profile</button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
