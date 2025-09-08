import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Target } from "lucide-react"; // ✅ React Icons
import Tea from "../../assets/tea.png";

gsap.registerPlugin(ScrollTrigger);

const WhatWeDo = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const vectorRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ✅ Responsive heading zoom animations
      ScrollTrigger.matchMedia({
        "(max-width: 767px)": () => {
          gsap.fromTo(
            headingRef.current,
            { scale: 0.85, opacity: 0.5, y: -40 },
            {
              scale: 1.1,
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            }
          );
        },
        "(min-width: 768px) and (max-width: 1023px)": () => {
          gsap.fromTo(
            headingRef.current,
            { scale: 0.85, opacity: 0.5, y: -50 },
            {
              scale: 1.25,
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            }
          );
        },
        "(min-width: 1024px)": () => {
          gsap.fromTo(
            headingRef.current,
            { scale: 0.85, opacity: 0.5, y: -60 },
            {
              scale: 1.4,
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            }
          );
        },
      });

      // ✅ Cards animation
      cardsRef.current.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              scrub: true,
            },
          }
        );
      });

      // ✅ Floating vectors animation
      vectorRefs.current.forEach((vec, i) => {
        gsap.to(vec, {
          y: i % 2 === 0 ? 20 : -20,
          duration: 3 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden py-24 bg-gradient-to-b from-[#fffaf7] to-[#faeae6]"
    >
      {/* Floating vectors */}
      <img
        src={Tea}
        alt="leaf"
        ref={(el) => (vectorRefs.current[0] = el)}
        className="absolute top-20 left-10 w-16 opacity-60"
      />
      <img
        src={Tea}
        alt="leaf"
        ref={(el) => (vectorRefs.current[1] = el)}
        className="absolute bottom-32 right-12 w-20 opacity-60"
      />

      {/* Heading */}
      <div
        className="text-center max-w-3xl mx-auto mb-16"
        ref={headingRef}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-black">
          What
          <span className="text-[#FF7A00]"> we do.</span>
        </h2>
        <p className="text-base md:text-xl text-[#5a3825] leading-relaxed">
          It's what we follow and start your teavolution with us to bring an
          inspiring cup of rarest tea experiences. We make you feel morning
          wonders throughout the day. It's all about{" "}
          <span className="text-[#FF7A00] font-semibold">
            Exceptional Aroma.
          </span>
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 relative z-10">
        {/* Card 1 */}
        <div
          ref={(el) => (cardsRef.current[0] = el)}
          className="group relative p-10 bg-white rounded-3xl shadow-lg border border-[#faeae6] hover:border-[#FF7A00]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-[#FF7A00] rounded-full flex items-center justify-center mr-4 text-white shadow-md">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black group-hover:text-[#FF7A00] transition-colors">
              Who we are
            </h3>
          </div>
          <p className="text-lg text-[#5a3825] leading-relaxed">
            At TeaBENCH, we are passionate about creating delightful experiences
            through our perfect blend of tea.
          </p>
        </div>

        {/* Card 2 */}
        <div
          ref={(el) => (cardsRef.current[1] = el)}
          className="group relative p-10 bg-white rounded-3xl shadow-lg border border-[#faeae6] hover:border-[#FF7A00]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-[#FF7A00] rounded-full flex items-center justify-center mr-4 text-white shadow-md">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black group-hover:text-[#FF7A00] transition-colors">
              Striving to
            </h3>
          </div>
          <p className="text-lg text-[#5a3825] leading-relaxed">
            We constantly improve by setting high standards and prioritizing
            customer delight with refreshing experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
