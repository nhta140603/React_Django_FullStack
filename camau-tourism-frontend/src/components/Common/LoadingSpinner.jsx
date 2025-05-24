import { motion } from "framer-motion";

export default function  LoadingSpinner(){
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute w-24 h-24 border-t-4 border-green-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute w-24 h-24"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-green-700">
            <path d="M50,10 C60,25 70,20 75,35 C78,45 72,60 65,70 C60,75 55,85 50,90 C45,85 40,75 35,70 C28,60 22,45 25,35 C30,20 40,25 50,10" />
          </svg>
        </motion.div>
      </div>
      <p className="mt-4 text-lg font-medium text-green-800">Đang tải thông tin Cà Mau...</p>
    </div>
  );
};