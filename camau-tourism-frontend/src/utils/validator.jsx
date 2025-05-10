export function validateRegister({name, email, password, confirmPassword}){
    const error = {};
    if (!name.trim()) {
        error.name = "Họ tên không được để trống!"
    }
    if (/^\d+$/.test(name)) {
        error.name = "Vui lòng nhập kí tự khác kí tự số!"
    }
    if (password.length < 6){
        error.password = "Mật khẩu không được dưới 6 kí tự"
    }
    if (confirmPassword !== password){
        error.confirmPassword = "Mật khẩu xác nhận không khớp"
    }
    return error;
}
