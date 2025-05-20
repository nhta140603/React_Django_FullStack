const AVATAR_BASE_URL = 
  (window?.configs && window.configs.AVATAR_BASE_URL)
    ? window.configs.AVATAR_BASE_URL
    : (import.meta.env.VITE_AVATAR_BASE_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1');
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";

export default function Avatar({ src, alt, size = "default", sizeClasses }) {
  const avatarUrl = src
    ? src.startsWith("https")
      ? src
      : AVATAR_BASE_URL + src
    : defaultAvatar;
    
  const defaultSizeClasses = {
    small: "w-12 h-12 border-2",
    default: "w-24 h-24 border-3",
    large: "w-full h-full border-4"
  };
  
  // Use custom size classes if provided, otherwise use default
  const finalSizeClasses = sizeClasses || defaultSizeClasses[size];
  
  return (
    <div className={`${finalSizeClasses} rounded-full overflow-hidden border-white shadow-lg`}>
      <img 
        src={avatarUrl} 
        alt={alt || "Avatar"} 
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" 
        onError={(e) => {e.target.src = defaultAvatar}}
      />
    </div>
  );
}