const API_URL =
  (window?.configs && window.configs.API_URL)
    ? window.configs.API_URL
    : (import.meta.env.VITE_API_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1/api/admin/');

const fetchWithAuth = async (url, options = {}) => {
  let headers = {
    ...options.headers,
  };
  if (options.body instanceof FormData) {
    headers = Object.fromEntries(
      Object.entries(headers).filter(([k]) => k.toLowerCase() !== 'content-type')
    );
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers, credentials: 'include' });
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

export const getDetail = (resource, id) =>
  fetchWithAuth(`${API_URL}${resource}/${id}/`);

export const createItem = (resource, data) => {
  const isFormData = data instanceof FormData;
  return fetchWithAuth(`${API_URL}${resource}/`, {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  });
};

export const updateItem = (resource, id, data) => {
  const isFormData = data instanceof FormData;
  return fetchWithAuth(`${API_URL}${resource}/${id}/`, {
    method: isFormData ? "PUT" : "PATCH",
    body: isFormData ? data : JSON.stringify(data),
  });
};

export const deleteItem = (resource, id) =>
  fetchWithAuth(`${API_URL}${resource}/${id}/`, {
    method: "DELETE",
  });

export const getPage = (resource, page, page_size) =>
  fetchWithAuth(`${API_URL}${resource}/?page=${page}&page_size=${page_size}`);


export async function uploadImageToServer(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetchWithAuth(`${API_URL}upload-image/`, {
    method: "POST",
    body: formData
  });
  let url = res.url;
  url = url.replace('/upload/', '/upload/f_auto,q_auto/');
  return url;
}


export const getTourBookingPendingCount = () =>
  fetchWithAuth(`${API_URL}tour-bookings/pending-count/`);

export const getRoomBookingPendingCount = () =>
  fetchWithAuth(`${API_URL}room-bookings/pending-count/`);

export const getNotificationsUnreadCount = () =>
  fetchWithAuth(`${API_URL}notifications/unread-count/`);