import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef } from "react";
export function MotionItem({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  x = 0,
  y = 40,
  direction = "down",
  thresholdHide = 0.20,
  hideOnScrollUp = true,
  hideOnScrollDown = false,
  showOnScrollIn = false,
}) {
  let offset = {};
  switch (direction) {
    case "up":
      offset = { y: Math.abs(y) * -1, x: 0 };
      break;
    case "down":
      offset = { y: Math.abs(y), x: 0 };
      break;
    case "left":
      offset = { x: Math.abs(x) * -1, y: 0 };
      break;
    case "right":
      offset = { x: Math.abs(x), y: 0 };
      break;
    default:
      offset = { y, x };
  }

  const [isDown, setIsDown] = useState(true);
  const lastScroll = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  const { ref: refHide, inView: inHideView } = useInView({
    triggerOnce: false,
    threshold: thresholdHide,
  });

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY;
      setIsDown(currentScroll > lastScroll.current);
      lastScroll.current = currentScroll;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [shouldHide, setShouldHide] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!inHideView) {
      if ((hideOnScrollUp && !isDown) || (hideOnScrollDown && isDown)) {
        setShouldHide(true);
      }
    } else {
      setShouldHide(false);
    }

    if (inHideView && showOnScrollIn && !hasShown) {
      setHasShown(true);
    }
  }, [inHideView, isDown, hideOnScrollUp, hideOnScrollDown, showOnScrollIn, hasShown]);

  let initial = { opacity: 1, ...offset, ...((direction === "up" || direction === "down") ? { x: 0 } : { y: 0 }) };
  let show = { opacity: 1, x: 0, y: 0 };
  let hide = { opacity: 0, ...offset };

  let animate;
  if (showOnScrollIn) {
    animate = hasShown ? show : initial;
  } else {
    animate = shouldHide ? hide : show;
  }

  return (
    <motion.div
      ref={refHide}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, type: "spring", stiffness: 80 }}
    >
      {children}
    </motion.div>
  );
}