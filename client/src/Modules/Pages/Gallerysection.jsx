"use client";

import Carousel from "@/components/ui/carousel";
import React from "react";
import { motion } from "framer-motion";

export const Gallerysection = () => {
  const slideData = [
    {
      title: "Mystic Mountains",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Urban Dreams",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Neon Nights",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Desert Whispers",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      {/* Heading + tagline */}
      <div className="text-center mb-12 px-4">
        <motion.h1
          className="relative text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-orange-500 relative z-10">Our </span>{" "}
          <span className="relative z-10">Gallery</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Discover the power of our franchise network. From vibrant storefronts
          to community-driven experiences, our gallery showcases the essence of
          what makes us unique.
        </motion.p>
      </div>

      {/* Carousel */}
      <Carousel slides={slideData} />
    </div>
  );
};
