"use client";

import React, { useEffect, useRef } from "react";

interface MagazineViewerProps {
  html: string;
}

export default function MagazineViewer({ html }: MagazineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find and re-execute script tags inserted via innerHTML
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.textContent || ""));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose max-w-none text-sm sm:text-base text-[#282828]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
