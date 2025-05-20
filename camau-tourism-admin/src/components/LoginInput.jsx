export default function LoginInput({ name, type, value, onChange, placeholder, icon }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        className="block w-full pl-10 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-500 bg-gray-50 rounded-t-lg transition-colors duration-200"
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