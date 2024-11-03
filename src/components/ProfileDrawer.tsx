import React, { useState, useRef } from "react";

export const ProfileDrawer = () => {
  const profiles = [
    { id: 1, name: "Personal" },
    { id: 2, name: "Work" },
    { id: 3, name: "Gaming" },
    { id: 4, name: "Travel" },
    { id: 5, name: "Fitness" },
    { id: 6, name: "Music" },
    { id: 7, name: "Reading" },
    { id: 8, name: "Cooking" },
  ];

  const [selectedProfile, setSelectedProfile] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const drawerCheckboxRef = useRef<HTMLInputElement>(null);

  const handleProfileSelect = (profile: { id: number; name: string }) => {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay h-100"></label>
        <ul className="menu p-4 bg-base-200 min-h-full w-60 text-base-content">
          <li className="menu-title sticky top-0 bg-base-200 z-10">
            <span>Profiles</span>
          </li>
          <div className="overflow-y-auto max-h-60 top-0">
            {profiles.map((profile) => (
              <li key={profile.id} className="flex space-x-2">
                <button
                  onClick={() => handleProfileSelect(profile)}
                  className={`text-left ${
                    selectedProfile?.id === profile.id ? "bg-base-300" : ""
                  }`}
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                      <span className="text-xs">{profile.name.charAt(0)}</span>
                    </div>
                  </div>
                  {profile.name}
                </button>
              </li>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};
