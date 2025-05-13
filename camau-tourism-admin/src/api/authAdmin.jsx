const API_URL =
  (window?.configs && window.configs.API_URL)
    ? window.configs.API_URL
    : (import.meta.env.VITE_API_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1/api/admin/');

export async function loginUser(data) {
  const response = await fetch(`${API_URL}loginAdmin/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
    }),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
      result.non_field_errors?.[0] ||
      result.password?.[0] ||
      result.no_admin?.[0] ||
      "Đăng nhập thất bại"
    );
  }
  return result;
}

export async function getInfoUser() {
  const res = await fetch(`${API_URL}me/`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error('Không thể lấy thông tin người dùng');
  }
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}logoutAdmin/`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error('Không thể đăng xuất');
  }
  return res.json();
}