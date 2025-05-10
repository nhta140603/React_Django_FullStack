const API_URL = "http://localhost:8000/api/admin/";

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
    const token = localStorage.getItem("accessToken"); 
    const res = await fetch(`${API_URL}me/`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    return res.json();
  }