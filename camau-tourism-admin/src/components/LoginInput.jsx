export default function LoginInput({ name, type, value, onChange, placeholder, icon }) {
  return (
    <div className="flex items-center border rounded px-3 py-2">
      {icon}
      <input
        className="flex-1 outline-none"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}