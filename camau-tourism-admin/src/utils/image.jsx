const BASE_URLS = {
  default: (window?.configs && window.configs.IMAGE_BASE_URL)
              ? window.configs.IMAGE_BASE_URL
              : (import.meta.env.VITE_IMAGE_BASE_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1'),
  avatar: (window?.configs && window.configs.AVATAR_BASE_URL)
              ? window.configs.AVATAR_BASE_URL
              : (import.meta.env.VITE_AVATAR_BASE_URL || '/avatar-path'),
}

export function getImageUrl(imagePath, defaultImg = "/default-image.png", type = "default") {
  if (!imagePath) return defaultImg;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${BASE_URLS[type] || BASE_URLS.default}${imagePath}`;
}