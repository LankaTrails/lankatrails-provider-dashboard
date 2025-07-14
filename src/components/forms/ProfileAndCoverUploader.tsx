import React, { useRef, useState } from "react";
import { Camera, X, User } from "lucide-react";

interface ProfileAndCoverUploaderProps {
  profileImage: File | null;
  setProfileImage: (file: File | null) => void;
  profilePreview: string | null;
  setProfilePreview: (url: string | null) => void;
  coverImage: File | null;
  setCoverImage: (file: File | null) => void;
  coverPreview: string | null;
  setCoverPreview: (url: string | null) => void;
  disabled?: boolean;
  profileError?: string;
  coverError?: string;
  error?: string;
  userName?: string;
}

const ProfileAndCoverUploader: React.FC<ProfileAndCoverUploaderProps> = ({
  profileImage,
  setProfileImage,
  profilePreview,
  setProfilePreview,
  coverImage,
  setCoverImage,
  coverPreview,
  setCoverPreview,
  disabled = false,
  profileError,
  coverError,
  error,
  userName = "User Name",
}) => {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [profileHover, setProfileHover] = useState(false);
  const [coverHover, setCoverHover] = useState(false);

  const handleImageChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  const handleRemove = (
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    setFile(null);
    setPreview(null);
  };

  const openFileDialog = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Photo Section */}
      <div className="relative">
        <div
          className={`
            relative w-full h-80 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden
            ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}
            ${coverHover ? 'brightness-75' : ''}
            transition-all duration-300
          `}
          onMouseEnter={() => setCoverHover(true)}
          onMouseLeave={() => setCoverHover(false)}
          onClick={() => !disabled && openFileDialog(coverInputRef)}
        >
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-70" />
                <p className="text-lg font-medium">Add Cover Photo</p>
                <p className="text-sm opacity-80">Upload a cover photo</p>
              </div>
            </div>
          )}
          
          {/* Cover Photo Controls */}
          <div className={`
            absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300
            ${coverHover ? 'bg-opacity-20' : ''}
          `}>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog(coverInputRef);
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-md"
                disabled={disabled}
              >
                <Camera size={16} />
                {coverPreview ? 'Edit Cover Photo' : 'Add Cover Photo'}
              </button>
              
              {coverPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(setCoverImage, setCoverPreview);
                  }}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 p-2 rounded-lg transition-all duration-200 shadow-md"
                  disabled={disabled}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null, setCoverImage, setCoverPreview)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="flex items-end gap-4 -mt-20">
          {/* Profile Photo */}
          <div className="relative">
            <div
              className={`
                relative w-40 h-40 bg-white rounded-full p-1 shadow-lg
                ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}
                ${profileHover ? 'shadow-xl' : ''}
                transition-all duration-300
              `}
              onMouseEnter={() => setProfileHover(true)}
              onMouseLeave={() => setProfileHover(false)}
              onClick={() => !disabled && openFileDialog(profileInputRef)}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <User className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">Add Photo</p>
                  </div>
                )}
                
                {/* Profile Photo Overlay */}
                <div className={`
                  absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center
                  ${profileHover ? 'bg-opacity-30' : ''}
                `}>
                  <div className={`
                    opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-center
                    ${profileHover ? 'opacity-100' : ''}
                  `}>
                    <Camera className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-medium">
                      {profilePreview ? 'Edit' : 'Add Photo'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Camera Icon Badge */}
              <div className="absolute bottom-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-md border-2 border-white transition-colors duration-200">
                <Camera className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null, setProfileImage, setProfilePreview)}
              className="hidden"
              disabled={disabled}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{userName}</h1>
            <p className="text-gray-600">Update your profile and cover photos</p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(profileError || coverError || error) && (
        <div className="px-6 pb-4 space-y-2">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <X size={16} />
              <span>{error}</span>
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <X size={16} />
              <span>Profile Photo: {profileError}</span>
            </div>
          )}
          {coverError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <X size={16} />
              <span>Cover Photo: {coverError}</span>
            </div>
          )}
        </div>
      )}

      {/* File Info */}
      {(profileImage || coverImage) && (
        <div className="px-6 pb-4 space-y-2">
          {profileImage && (
            <div className="text-xs text-gray-500">
              Profile: {profileImage.name} • {(profileImage.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
          {coverImage && (
            <div className="text-xs text-gray-500">
              Cover: {coverImage.name} • {(coverImage.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileAndCoverUploader;