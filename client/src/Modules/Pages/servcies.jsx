import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Teaimage1 from "../../assets/teaimage1.png";
import Teaimage2 from "../../assets/teaimage2.png";
import Teaimage3 from "../../assets/teaimage3.png";

gsap.registerPlugin(ScrollTrigger);

const images = [Teaimage1, Teaimage2, Teaimage3];

const content = [
  {
    title: "A HEALTHY SIP!",
    description:
      "Ya! It's cup of tea, let's be fresh and cherish every moment in each sip. It's refreshing burst and where there is tea, there is always freshness ...",
  },
  {
    title: "ANOTHER GREAT SIP!",
    description:
      "This is another great tea experience. Enjoy the burst of flavor that awakens your senses and refreshes your mind with every sip.",
  },
  {
    title: "A THIRD SIP!",
    description:
      "Yet another refreshing experience. Savor the perfect blend of aroma and taste that makes each moment special with our premium tea selection.",
  },
];

function Services() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);
  const dotsRef = useRef([]);
  const progressRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const supportsClipPath =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      (CSS.supports("clip-path: inset(0 0 0 0)") ||
        CSS.supports("clipPath", "inset(0 0 0 0)"));

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;

      // Dots + rail colors for orange theme
      gsap.set(dotsRef.current, {
        transformOrigin: "center",
        scale: 0.9,
        backgroundColor: "#ea580c", // orange-600
      });
      if (dotsRef.current[0]) {
        gsap.set(dotsRef.current[0], {
          scale: 1.15,
          backgroundColor: "#f97316", // orange-500
        });
      }
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleY: 0, transformOrigin: "bottom" });
      }

      // Initial state for cards
      gsap.set(cards, {
        y: 60,
        scale: 0.94,
        rotate: 0,
        filter: "blur(8px)",
        visibility: "hidden",
        ...(supportsClipPath ? { clipPath: "inset(0% 0% 100% 0%)" } : {}),
        transformOrigin: "center center",
      });

      // Prepare inner elements
      cards.forEach((card) => {
        const q = gsap.utils.selector(card);
        gsap.set(q(".card-image"), {
          y: 40,
          filter: "blur(8px)",
          ...(supportsClipPath ? { clipPath: "inset(0% 0% 100% 0%)" } : {}),
        });
        gsap.set([q(".card-title"), q(".card-desc")], {
          y: 24,
          ...(supportsClipPath ? { clipPath: "inset(0% 0% 100% 0%)" } : {}),
        });
        gsap.set(q(".sheen"), { xPercent: -110 });
      });

      // First card visible
      gsap.set(cards[0], {
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        visibility: "visible",
        ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
      });
      {
        const q0 = gsap.utils.selector(cards[0]);
        gsap.set(q0(".card-image"), {
          y: 0,
          filter: "blur(0px)",
          ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
        });
        gsap.set([q0(".card-title"), q0(".card-desc")], {
          y: 0,
          ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
        });
        gsap.set(q0(".sheen"), { xPercent: 110 });
      }

      const steps = cards.length - 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=" + steps * (window.innerHeight * 0.9),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          snap:
            steps > 0
              ? { snapTo: 1 / steps, duration: 0.35, ease: "power1.inOut" }
              : false,
          onUpdate: (self) => {
            // Progress rail
            if (progressRef.current) {
              gsap.to(progressRef.current, {
                scaleY: self.progress,
                ease: "none",
                duration: 0.12,
              });
            }
            // Active dot color/scale
            const active = Math.round(self.progress * steps);
            dotsRef.current.forEach((dot, idx) => {
              gsap.to(dot, {
                scale: idx === active ? 1.15 : 0.9,
                backgroundColor: idx === active ? "#f97316" : "#ea580c",
                duration: 0.18,
                overwrite: "auto",
              });
            });
          },
        },
        defaults: { ease: "power2.out", duration: 0.7 },
      });

      // Stacked transitions
      cards.forEach((card, i) => {
        if (i === 0) return;
        const q = gsap.utils.selector(card);

        tl.to(
          card,
          {
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
            onStart: () => gsap.set(card, { visibility: "visible" }),
          },
          "+=0.02"
        )
          .to(
            q(".card-image"),
            {
              y: 0,
              filter: "blur(0px)",
              duration: 0.55,
              ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
            },
            "<+0.05"
          )
          .to(
            [q(".card-title"), q(".card-desc")],
            {
              y: 0,
              stagger: 0.08,
              duration: 0.45,
              ...(supportsClipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
            },
            "<+0.05"
          )
          .fromTo(
            q(".sheen"),
            { xPercent: -110 },
            { xPercent: 110, duration: 0.5, ease: "power1.out" },
            "<"
          )
          .to(
            cards[i - 1],
            { y: -24, scale: 0.965, rotate: -0.6, duration: 0.6 },
            "<"
          );
      });

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDotClick = (idx) => {
    const tl = tlRef.current;
    const st = tl?.scrollTrigger;
    if (!st) return;

    const cards = cardsRef.current.filter(Boolean);
    const steps = Math.max(cards.length - 1, 1);
    const rel = idx / steps;
    const y = st.start + (st.end - st.start) * rel;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#ff6b35] via-[#f59e0b] to-[#ea580c]"
    >
      {/* Orange gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[42rem] h-[42rem] bg-orange-500/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-64 -right-40 w-[36rem] h-[36rem] bg-orange-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-amber-500/20 rounded-full blur-3xl" />

      <div
        ref={pinRef}
        className="relative h-screen flex items-center justify-center"
      >
       <div className="relative w-full max-w-6xl lg:max-w-7xl h-[78vh] px-2 md:px-4 lg:px-6">

          {content.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="absolute inset-0 rounded-[24px] md:rounded-[28px] bg-orange-900/40 backdrop-blur-xl ring-1 ring-orange-300/30 overflow-hidden will-change-transform"
              style={{ zIndex: idx + 1 }}
            >
              {/* Sheen sweep overlay (orange tint) */}
              <div className="sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full p-6 md:p-10">
                {/* Image */}
                <div className="flex items-center justify-center">
                  <img
                    src={images[idx]}
                    alt={item.title}
                    className="card-image max-h-[60vh] object-contain rounded-2xl drop-shadow-[0_10px_20px_rgba(234,88,12,0.3)] will-change-transform"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center text-center md:text-left">
                  <h2 className="card-title text-4xl md:text-5xl font-semibold text-orange-50 tracking-tight mb-4 leading-snug will-change-transform">
                    {item.title}
                  </h2>
                  <p className="card-desc text-orange-100 text-lg md:text-xl max-w-lg md:max-w-none mx-auto md:mx-0 will-change-transform">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right progress rail + dots (orange theme) */}
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30">
          <div className="relative h-48 w-[3px] rounded-full bg-gray-300/40 overflow-hidden">
            <div
              ref={progressRef}
              className="absolute bottom-0 left-0 w-full h-full bg-white origin-bottom scale-y-0"
            />
          </div>
          <div className="flex flex-col gap-3">
            {content.map((_, idx) => (
              <button
                key={idx}
                ref={(el) => (dotsRef.current[idx] = el)}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to card ${idx + 1}`}
                className="w-3.5 h-3.5 rounded-full bg-[#FFD9AA] transition-transform duration-200 outline-none ring-0"
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-orange-100 text-sm select-none flex items-center gap-2">
          <span className="bg-yellow-900/50 px-3 py-1 rounded-full">
            Scroll to explore
          </span>
          <span className="motion-safe:animate-bounce text-orange-50">↓</span>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white-500/20 blur-xl" />
        <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-amber-500/20 blur-xl" />
      </div>
    </section>
  );
}

export default Services;
