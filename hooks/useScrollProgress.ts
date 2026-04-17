"use client";

import { useEffect, useState } from "react";

export function useScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let mutationObserver: MutationObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const getDocumentHeight = () =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      );

    const updateProgress = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const fullHeight = getDocumentHeight();
        const maxScrollable = fullHeight - viewportHeight;

        // Browser rounding can leave scrollY slightly below max at page bottom.
        if (scrollTop + viewportHeight >= fullHeight - 2) {
          setScrollPercent(100);
          return;
        }

        const percent = maxScrollable > 0 ? Math.round((scrollTop / maxScrollable) * 100) : 0;
        setScrollPercent(Math.min(percent, 100));
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("load", updateProgress);

    // Recalculate when DOM/content dimensions change after hydration.
    mutationObserver = new MutationObserver(updateProgress);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateProgress);
      resizeObserver.observe(document.body);
      resizeObserver.observe(document.documentElement);
    }

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("load", updateProgress);
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return scrollPercent;
}
