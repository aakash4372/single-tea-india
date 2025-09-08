"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { ImagesSlider } from "../../components/ui/images-slider";
import Banner2 from "../../assets/teabanner2.png";
import Banner3 from "../../assets/teabanner3.png";

export function ImagesSliderDemo() {
  const images = [ Banner2, Banner3];

  const texts = [
    "The hero section slideshow nobody asked for",
    "Sip the freshness, embrace the vibes",
    "A new story unfolds with every slide",
  ];

  const [currentText, setCurrentText] = useState(0);

  return (
    <ImagesSlider
      className="w-full h-[45rem] md:h-[32rem] lg:h-screen"
      images={images}
      onSlideChange={(index) => setCurrentText(index)} // 👈 update text when slide changes
    >
      <div className="z-50 flex flex-col justify-center items-center h-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText} // 👈 re-animate on change
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-3xl md:text-5xl lg:text-7xl text-center 
            bg-clip-text text-transparent bg-gradient-to-b 
            from-neutral-50 to-neutral-400 py-4 leading-tight"
          >
            {texts[currentText]}
          </motion.p>
        </AnimatePresence>
      </div>
    </ImagesSlider>
  );
}
