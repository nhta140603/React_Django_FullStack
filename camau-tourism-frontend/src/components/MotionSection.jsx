import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

export default function MotionSection({
  children,
  className = "",
  delay = 0,
  duration = 0.7,
  y = 50,
  thresholdShow = 0.15,
}) {
  const [hasShown, setHasShown] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: thresholdShow,
  });

  useEffect(() => {
    if (inView && !hasShown) {
      setHasShown(true);
    }
  }, [inView, hasShown]);

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={hasShown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, type: "spring", stiffness: 80 }}
    >
      {children}
    </motion.section>
  );
}