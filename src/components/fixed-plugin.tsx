"use client";

import React from "react";
import { IconButton } from "@material-tailwind/react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

export function FixedPlugin() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 200); // 200px scroll ke baad show hoga
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-16 right-6 z-50">
      <IconButton
        onClick={scrollToTop}
        color="gray"
        className="rounded-full shadow-lg"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </IconButton>
    </div>
  );
}

export default FixedPlugin;
