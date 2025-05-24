import { useRef, useLayoutEffect, useState } from "react";

export function useDescriptionExpand(extraExpand, html, defaultHeight = 300) {
  const descRef = useRef(null);
  const [descMaxHeight, setDescMaxHeight] = useState(defaultHeight);

  useLayoutEffect(() => {
    if (extraExpand && descRef.current) {
      setDescMaxHeight(descRef.current.scrollHeight);
    } else {
      setDescMaxHeight(defaultHeight);
    }
  }, [extraExpand, html, defaultHeight]);

  return { descRef, descMaxHeight };
}