import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ".split("");
const STATS = [
  { value: "58%", label: "Increase in pick up point use" },
  { value: "23%", label: "Decreased in customer phone calls" },
  { value: "27%", label: "Increase in pick up point use" },
  { value: "40%", label: "Decreased in customer phone calls" },
];

export default function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ---------- 1. Intro (time-based) ----------
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".letter", { y: 40, opacity: 0, duration: 0.9, stagger: 0.06 })
        .from(".car", { opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".stat", { y: 30, opacity: 0, duration: 0.8, stagger: 0.18 }, "-=0.4");

      // ---------- 2. Scroll-driven (progress-based) ----------
      const distance = () =>
        window.innerWidth - document.querySelector(".car").offsetWidth - 48;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1, // 1s smoothing = interpolation/easing on scroll
            invalidateOnRefresh: true, // recalc on resize
          },
        })
        .to(".car", { x: distance, ease: "none" }, 0)
        .to(".trail", { scaleX: 1, ease: "none" }, 0) // road trail follows car
        .to(".headline", { y: -40, opacity: 0.35, ease: "none" }, 0)
        .to(".stat-bar", { scaleX: 1, stagger: 0.2, ease: "none" }, 0.1);
    }, root);

    return () => ctx.revert(); // clean up on unmount
  }, []);

  return (
    <main ref={root} className="text-white">
      <section className="hero relative h-screen w-full overflow-hidden">
        {/* Headline */}
        <h1 className="headline absolute top-[14%] w-full text-center text-2xl font-light tracking-[0.5em] md:text-5xl">
          {HEADLINE.map((c, i) => (
            <span key={i} className="letter inline-block will-change-transform">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h1>

        {/* Road + car */}
        <div className="absolute left-0 top-1/2 h-24 w-full -translate-y-1/2 bg-zinc-900">
          <div className="trail absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-zinc-700/60 will-change-transform" />
          <img
            src={`${import.meta.env.BASE_URL}car.png`}
            alt="Car top view"
            className="car absolute left-6 top-1/2 h-20 -translate-y-1/2 will-change-transform md:h-28"
          />
        </div>

        {/* Stats */}
        <div className="absolute bottom-[8%] grid w-full grid-cols-2 gap-6 px-6 md:grid-cols-4 md:px-16">
          {STATS.map((s) => (
            <div key={s.label + s.value} className="stat">
              <div className="text-4xl font-semibold md:text-6xl">{s.value}</div>
              <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
              <div className="stat-bar mt-3 h-0.5 origin-left scale-x-0 bg-emerald-400 will-change-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* Extra scroll room after the pin */}
      <section className="flex h-screen items-center justify-center text-zinc-500">
        Next section
      </section>
    </main>
  );
}