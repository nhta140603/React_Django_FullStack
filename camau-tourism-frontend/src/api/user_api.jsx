const AVATAR_BASE_URL =
  (window?.configs && window.configs.AVATAR_BASE_URL)
    ? window.configs.AVATAR_BASE_URL
    : (import.meta.env.VITE_AVATAR_BASE_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1');

const API_URL =
  (window?.configs && window.configs.API_URL)
    ? window.configs.API_URL
    : (import.meta.env.VITE_API_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1/api/client/');

const fetchWithAuth = async (url, options = {}, _retry = false) => {
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
  if (res.status === 401 && !_retry) {
    const refreshRes = await fetch(`${API_URL}refresh/`, {
      method: "POST",
      credentials: "include"
    });
    if (refreshRes.ok) {
      return fetchWithAuth(url, options, true);
    } else {
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
    }
  }

  if (!res.ok) throw new Error('Lỗi API');
  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

export const getList = (resource) =>
  fetchWithAuth(`${API_URL}${resource}/`);

export const getDetail = (resource, slug) =>
  fetchWithAuth(`${API_URL}${resource}/${slug}/`);

export async function updateInfoUser(data) {
  return fetchWithAuth(`${API_URL}me/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getInfoUser() {
  return fetchWithAuth(`${API_URL}me/`, {
    method: "GET",
    credentials: "include"
  });
}

export async function updateAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  return fetchWithAuth(`${API_URL}profile/avatar/`, {
    method: 'POST',
    body: formData,
  });
}

export function getAvatarUrl(src) {
  if (!src) return "/default-avatar.png";
  if (src.startsWith("https")) return src;
  return AVATAR_BASE_URL + src;
}

export const getPage = (resource, page, page_size) =>
  fetchWithAuth(`${API_URL}${resource}/?page=${page}&page_size=${page_size}`);

export async function createMomoPayment(amount, tour_id, people_count) {
  return fetchWithAuth(`${API_URL}momo/create/`, {
    method: "POST",
    body: JSON.stringify({ amount, tour_id, people_count }),
  });
}

export async function createRoomBooking(resource, data) {
  const isFormData = data instanceof FormData;
  return fetchWithAuth(`${API_URL}${resource}/`, {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data)
  });
}

export async function cancelRoomBooking(id) {
  return fetchWithAuth(`${API_URL}room-booking/${id}/cancel/`, {
    method: "POST",
  });
}

export const postReview = (entityType, entityId, data) => {
  switch (entityType) {
    case "destination":
      return postDestinationReview(entityId, data);
    case "food":
      return postFoodReview(entityId, data);
    case "hotel":
      return postHotelReview(entityId, data);
    default:
      throw new Error("Unknown entity type");
  }
};

export function postRating(entity, entityId, data) {
  const isFormData = data instanceof FormData;
  return fetchWithAuth(`${API_URL}${entity}/${entityId}/ratings/`, {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data)
  });
}

export function getRatings(entityType, entityId) {
  return fetchWithAuth(`${API_URL}${entityType}/${entityId}/ratings/`, {
    method: "GET",
  });
}

export function postComment(entity, entityId, data) {
  const isFormData = data instanceof FormData;
  return fetchWithAuth(`${API_URL}${entity}/${entityId}/comments/`, {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data)
  });
}

export function getComments(entityType, entityId) {
  return fetchWithAuth(`${API_URL}${entityType}/${entityId}/comments/`, {
    method: "GET",
  });
}

export const getReviews = (entityType, entityId) => {
  switch (entityType) {
    case "destination":
      return getDestinationReviews(entityId);
    case "food":
      return getFoodReviews(entityId);
    case "hotel":
      return getHotelReviews(entityId);
    default:
      throw new Error("Unknown entity type");
  }
};

export function postDestinationReview(destinationId, data) {
  return fetchWithAuth(`${API_URL}destination/${destinationId}/reviews/`, {
    method: "POST",
    body: data,
  });
}
export function getDestinationReviews(destinationId) {
  return fetchWithAuth(`${API_URL}destination/${destinationId}/reviews/`);
}

export function postFoodReview(foodId, data) {
  return fetchWithAuth(`${API_URL}food/${foodId}/reviews/`, {
    method: "POST",
    body: data,
  });
}
export function getFoodReviews(foodId) {
  return fetchWithAuth(`${API_URL}food/${foodId}/reviews/`);
}

export function postHotelReview(hotelId, data) {
  return fetchWithAuth(`${API_URL}hotel/${hotelId}/reviews/`, {
    method: "POST",
    body: data,
  });
}
export function getHotelReviews(hotelId) {
  return fetchWithAuth(`${API_URL}hotel/${hotelId}/reviews/`);
}

export function getNotifications(page = 1, page_size = 20) {
  return fetchWithAuth(`${API_URL}notifications/?page=${page}&page_size=${page_size}`);
}

export function getNotificationDetail(id) {
  return fetchWithAuth(`${API_URL}notifications/${id}/`);
}

export function markNotificationAsRead(id) {
  return fetchWithAuth(`${API_URL}notifications/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: true }),
  });
}

export function markAllNotificationsAsRead() {
  return fetchWithAuth(`${API_URL}notifications/mark-all-read/`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export function deleteNotification(id) {
  return fetchWithAuth(`${API_URL}notifications/${id}/`, {
    method: 'DELETE',
  });
}

export async function AvailableQuantity(roomId, checkIn, checkOut) {
  if (!roomId || !checkIn || !checkOut) {
    throw new Error('Thiếu tham số roomId, checkIn hoặc checkOut');
  }
  const url = `${API_URL}room-booking/available-quantity/?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`;
  const res = await fetchWithAuth(url);
  if (!res) {
    throw new Error('Lỗi khi lấy số phòng còn lại');
  }

  return res.available_quantity ?? 0;
}