export default function formatDateVN(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date)) return ""; 

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateFullVN(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date)) return "";

  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day} tháng ${month} năm ${year}`;
}