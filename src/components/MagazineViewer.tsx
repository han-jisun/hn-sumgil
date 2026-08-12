"use client";

import React, { useEffect, useRef, useState } from "react";

interface MagazineViewerProps {
  html: string;
  isFullLayout?: boolean;
}

export default function MagazineViewer({ html, isFullLayout = false }: MagazineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("1200px");

  useEffect(() => {
    if (!isFullLayout) {
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
    }
  }, [html, isFullLayout]);

  useEffect(() => {
    if (isFullLayout && iframeRef.current) {
      const updateHeight = () => {
        try {
          const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
          if (doc && doc.body) {
            const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
            if (height > 0) {
              setIframeHeight(`${height}px`);
            }
          }
        } catch {
          // ignore cross-origin error if any
        }
      };

      const timer1 = setTimeout(updateHeight, 100);
      const timer2 = setTimeout(updateHeight, 500);
      const timer3 = setTimeout(updateHeight, 1500);
      window.addEventListener("resize", updateHeight);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [html, isFullLayout]);

  if (isFullLayout) {
    return (
      <iframe
        ref={iframeRef}
        srcDoc={html}
        className="w-full border-0 overflow-hidden block"
        style={{ height: iframeHeight, minHeight: "800px" }}
        title="Theme Magazine View"
        onLoad={() => {
          try {
            const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
            if (doc && doc.body) {
              const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
              if (height > 0) {
                setIframeHeight(`${height}px`);
              }
            }
          } catch {
            // ignore
          }
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
