import React from "react";

const AuthLayout = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-400">
    <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white bg-opacity-90">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6 drop-shadow">
        {title}
      </h2>
      {children}
    </div>
  </div>
);

export default AuthLayout;