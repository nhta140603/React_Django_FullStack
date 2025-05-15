const API_URL =
  (window?.configs && window.configs.API_URL)
    ? window.configs.API_URL
    : (import.meta.env.VITE_API_URL || '/choreo-apis/djangoreactapp/camautourismbackend/v1/api/client/');

export async function registerUser(data) {
  const response = await fetch(`${API_URL}register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.name,
      email: data.email,
      password: data.password,
    }),
  });
  const result = await response.json();
  if(!response.ok)
  {
    throw new Error(result.email?.[0] || result.detail || "Đăng Ký Thất Bại")
  }
  return result
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}login/`, {
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
  if(!response.ok)
  {
    throw new Error(
      result.disable_account?.[0] ||
      result.password?.[0] ||
      result.username?.[0] ||
      result.detail ||
      "Đăng Nhập Thất Bại"
    );
  }
  return result
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}logout/`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    let result;
    try {
      result = await response.json();
    } catch {
      result = {};
    }
    throw new Error(result.detail || "Đăng xuất thất bại");
  }
  return true;
}