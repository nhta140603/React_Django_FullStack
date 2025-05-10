const AVATAR_BASE_URL = "http://localhost:8000";

export default function Avatar({ src, alt, size = "default" }) {
  const avatarUrl = src
    ? src.startsWith("http")
      ? src
      : AVATAR_BASE_URL + src
    : "/default-avatar.png";
    
  const sizeClasses = {
    small: "w-12 h-12 border-2",
    default: "w-24 h-24 border-3",
    large: "w-full h-full border-4"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-white shadow-lg`}>
      <img 
        src={avatarUrl} 
        alt={alt || "Avatar"} 
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" 
        onError={(e) => {e.target.src = "/default-avatar.png"}}
      />
    </div>
  );
}