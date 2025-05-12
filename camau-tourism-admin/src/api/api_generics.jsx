const API_URL =
  (window?.configs && window.configs.API_URL)
    ? window.configs.API_URL
    : (import.meta.env.VITE_API_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1/api/admin/');

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
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