import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";

import Vector from "@/assets/teacartoon.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headingRef = useRef(null);
  const iconRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isTablet, isMobile } = context.conditions;

        // Scope selectors to this component only
        const q = gsap.utils.selector(containerRef);

        let startSize, endSize;
        let startScale, endScale;
        let startX, endX, startY, endY;

        if (isDesktop) {
          startSize = "1.9rem";
          endSize = "6rem";
          startScale = 0.5;
          endScale = 2;
          startX = "-20vw";
          endX = "0vw";
          startY = "10vh";
          endY = "0vh";
        } else if (isTablet) {
          startSize = "2rem";
          endSize = "3rem";
          startScale = 0.8;
          endScale = 1.2;
          startX = "-10vw";
          endX = "0vw";
          startY = "5vh";
          endY = "0vh";
        } else {
          // Mobile
          startSize = "1rem";
          endSize = "2rem";
          startScale = 0.7;
          endScale = 1.1;
          startX = "-5vw";
          endX = "0vw";
          startY = "3vh";
          endY = "0vh";
        }

        // Master timeline
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: true,
          },
        });

        // 1) Main heading zoom
        tl.fromTo(
          headingRef.current,
          { fontSize: startSize, opacity: 0.8 },
          { fontSize: endSize, opacity: 1, duration: 0.8 }
        );

        // 2) Image + Our Story text together
        tl.add("imgAndText", "+=0.2"); // small pause after heading

        // Image motion
        tl.fromTo(
          iconRef.current,
          { scale: startScale, x: startX, y: startY, opacity: 0 },
          { scale: endScale, x: endX, y: endY, opacity: 1, duration: 0.6 },
          "imgAndText"
        );

        // Our Story heading (same time as image)
        tl.fromTo(
          q(".our-story-heading"),
          { opacity: 1, y: 50 },
          { opacity: 1, y: 0, duration: 1 },
          "imgAndText"
        );

        // Our Story paragraph (same time, tiny offset for a nice feel)
        tl.fromTo(
          q(".our-story-text"),
          { opacity: 1, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          "imgAndText+=0.05"
        );

        // Cleanup for this media query block when it no longer matches
        return () => {
          tl.kill();
        };
      }
    );

    // Cleanup all media queries on unmount
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="p-8 flex flex-col items-center relative overflow-hidden"
    >
      {/* Zooming Heading */}
      <h1
        ref={headingRef}
        className="font-extrabold text-center mb-12 leading-tight relative z-20"
        style={{ fontSize: "2rem" }}
      >
        <span className="text-black block">THE STORY BEHIND</span>
        <span className="text-[#FF7A00] block">SUCCESSFUL TEA BRAND</span>
      </h1>

      {/* Flex row: Image left, Paragraph right */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 max-w-6xl">
        {/* Image */}
        <div
          ref={iconRef}
          className="w-40 h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 flex-shrink-0 relative z-10"
        >
          <img
            src={Vector}
            alt="Tea Cartoon"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Our Story Section */}
        <div className="max-w-3xl text-center lg:text-center">
          <h2 className="our-story-heading text-2xl md:text-3xl font-extrabold text-[#FF7A00] mb-4">
            Our Story
          </h2>
          <p className="our-story-text text-lg md:text-xl text-justify font-bold text-gray-600 leading-loose">
            Single Tea began with a simple vision: to bring authentic,
            high-quality tea experiences to every corner of India. From sourcing
            the finest leaves to crafting blends that celebrate tradition and
            taste, Single Tea has become a trusted name among tea lovers
            nationwide. With an accessible business model and strong operational
            support, Single Tea is redefining how India enjoys and shares its
            favorite beverage.
          </p>
        </div>
      </div>

      {/* Scrolling Velocity Text */}
      <ScrollVelocityContainer className="w-full text-4xl mt-16 md:mt-40 bg-[#ff7a00] text-white md:text-7xl font-bold">
        <ScrollVelocityRow baseVelocity={15} direction={1}>
          INDIA'S NO.1 SUCCESSFUL TEA BRAND
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  );
};

export default About;