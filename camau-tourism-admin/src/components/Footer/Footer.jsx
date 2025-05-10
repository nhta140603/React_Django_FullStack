import React from "react";
import { FaHeart, FaExternalLinkAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-cyan-100 to-white shadow text-sm text-gray-500 px-8 py-4 flex justify-between items-center flex-wrap gap-2 rounded-t-lg">
      {/* <div>
        <a
          href="https://your-portfolio.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 font-medium hover:underline flex items-center gap-1"
        >
          Tuấn Anh <FaExternalLinkAlt className="inline-block" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <a className="text-cyan-600 hover:underline" href="/chinh-sach">Chính sách</a>
        <span className="mx-1">|</span>
        <a className="text-cyan-600 hover:underline" href="/lien-he">Liên hệ</a>
        <span className="mx-1">|</span>
        <span className="flex items-center gap-1 text-cyan-800"><FaHeart /> Made with love</span>
      </div> */}
    </footer>
  );
}

export default Footer;