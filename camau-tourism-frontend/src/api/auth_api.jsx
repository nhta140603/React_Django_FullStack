const API_URL = "http://localhost:8000/api/client/";

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