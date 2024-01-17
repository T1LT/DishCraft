"use client";

import Typewriter from "typewriter-effect";

export default function SplashHeader() {
  return (
    <h1 className="flex flex-col sm:flex-row sm:gap-2 lg:gap-3 text-center font-extrabold tracking-tight text-5xl lg:text-7xl mb-12 select-none">
      What will you
      <span className="flex justify-center gap-2 lg:gap-3">
        <Typewriter
          options={{
            strings: ["cook", "bake", "grill", "fry"],
            autoStart: true,
            loop: true,
            cursor: "",
            wrapperClassName:
              "bg-gradient-to-b from-orange-400 to-red-500 bg-clip-text text-transparent",
          }}
        />
        next?
      </span>
    </h1>
  );
}
