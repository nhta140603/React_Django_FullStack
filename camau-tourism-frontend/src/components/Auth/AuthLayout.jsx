import React from "react";

const AuthLayout = ({ children, title }) => (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#89f7fe] via-[#66a6ff] to-[#f7b2fe] overflow-hidden">
    <div className="absolute top-[-100px] left-[-80px] w-[350px] h-[350px] bg-pink-300 opacity-40 rounded-full filter blur-3xl z-0"></div>
    <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-blue-300 opacity-40 rounded-full filter blur-3xl z-0"></div>
    <div className="absolute top-1/2 left-1/2 w-[400px] h-[250px] bg-yellow-200 opacity-30 rounded-full filter blur-2xl z-0 translate-x-[-50%] translate-y-[-50%]"></div>
      {children}
  </div>
);

export default AuthLayout;