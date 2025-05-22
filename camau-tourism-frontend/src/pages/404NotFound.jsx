import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const calculateMovement = (value, axis) => {
        const maxMovement = 20;
        const windowSize = axis === 'x' ? window.innerWidth : window.innerHeight;
        const mousePos = axis === 'x' ? mousePosition.x : mousePosition.y;

        return value * (maxMovement * (mousePos / windowSize - 0.5));
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-cyan-100 to-blue-200 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
            <div className="absolute inset-0 z-0 opacity-10">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 150 + 100}px`,
                            background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 160'%3E%3Cpath d='M50,0 C50,50 20,70 20,110 C20,140 40,160 50,160 C60,160 80,140 80,110 C80,70 50,50 50,0' fill='%23006400'/%3E%3C/svg%3E\")",
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                        animate={{
                            x: calculateMovement(i % 2 === 0 ? 1 : -1, 'x'),
                            y: calculateMovement(i % 2 === 0 ? -1 : 1, 'y'),
                        }}
                        transition={{ type: 'spring', stiffness: 50 }}
                    />
                ))}
            </div>

            <motion.div
                className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl max-w-3xl w-full border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600 mt-12">404</h1>
                <motion.h2
                    className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 mb-6"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    Lạc lối trong rừng ngập mặn Cà Mau
                </motion.h2>

                <p className="text-lg text-gray-600 mb-8">
                    Có vẻ như bạn đã đi lạc trong hành trình khám phá vẻ đẹp của Cà Mau.
                    Hãy quay về bến để tiếp tục chuyến du lịch!
                </p>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                    <motion.button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/'}
                    >
                        Về trang chủ
                    </motion.button>

                    <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/danh-sach-dia-diem'}
                    >
                        Khám phá điểm du lịch
                    </motion.button>
                </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-48 bg-contain bg-repeat-x"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Cpath d='M0,150 C100,120 200,180 300,150 C400,120 500,180 600,150 C700,120 800,180 900,150 C1000,120 1100,180 1200,150 L1200,200 L0,200 Z' fill='%23006400'/%3E%3C/svg%3E\")",
                }} />

            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={`bird-${i}`}
                    className="absolute z-20"
                    style={{
                        top: `${30 + i * 10}%`,
                        left: '-50px',
                        width: '30px',
                        height: '15px',
                    }}
                    animate={{
                        x: [0, window.innerWidth + 100],
                        y: [0, Math.sin(i) * 50, 0],
                    }}
                    transition={{
                        duration: 15 + i * 2,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                >
                    <svg viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15,0 C10,5 5,7 0,8 C5,9 10,11 15,15 C20,11 25,9 30,8 C25,7 20,5 15,0Z" fill="#222" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

export default NotFound;