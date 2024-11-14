import React, { useState } from "react";
import { Profile } from "../types";
import { createProfile as createProfileInStorage } from "../services/ChromeStorageService";

interface CreateProfileFormProps {
  onProfileCreated: () => void;
}

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({ onProfileCreated }) => {
  const [profileName, setProfileName] = useState("");

  const handleCreateProfile = async () => {
    if (profileName.trim()) {
      const newProfile: Profile = {
        id: Date.now().toString(),
        displayName: profileName,
        description: "",
        creationDate: new Date(),
        folders: [],
      };
      await createProfileInStorage(newProfile);
      setProfileName("");
      onProfileCreated();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create New Profile</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter profile name"
              className="input input-bordered"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleCreateProfile}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileForm;