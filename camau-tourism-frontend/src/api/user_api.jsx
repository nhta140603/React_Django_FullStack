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