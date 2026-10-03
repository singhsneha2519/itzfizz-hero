import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ".split("");
const STATS = [
  { value: 58, label: "Increase in pick up point use" },
  { value: 23, label: "Decreased in customer phone calls" },
  { value: 27, label: "Increase in pick up point use" },
  { value: 40, label: "Decreased in customer phone calls" },
];

export default function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      //  Intro (time-based) 
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".letter", { y: 40, opacity: 0, duration: 0.9, stagger: 0.06 })
        .from(".car", { opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".stat", { y: 30, opacity: 0, duration: 0.8, stagger: 0.18 }, "-=0.4");

      // Initial states for scroll animations
      gsap.set(".stat-inner", { opacity: 0.25, y: 12 });
      gsap.set(".speed-line", { scaleX: 0.2, transformOrigin: "right center" });

      // Scroll (progress-based) 
      const distance = () =>
        window.innerWidth - document.querySelector(".car").offsetWidth - 48;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Car drives + red trail follows
      tl.to(".car", { x: distance, ease: "none", duration: 1 }, 0)
        .to(".trail", { scaleX: 1, ease: "none", duration: 1 }, 0)
        .to(".headline", { y: -30, ease: "none", duration: 1 }, 0);

      // Body tilt: small wobble while driving (rotate left, right, settle)
      tl.to(".car", { rotate: -1.5, duration: 0.2, ease: "sine.inOut" }, 0)
        .to(".car", { rotate: 1.5, duration: 0.4, ease: "sine.inOut" }, 0.2)
        .to(".car", { rotate: 0, duration: 0.4, ease: "sine.inOut" }, 0.6);

      // Speed lines stretch as the car picks up speed
      tl.to(
        ".speed-line",
        { scaleX: 1, duration: 0.15, ease: "power2.out", stagger: 0.03 },
        0
      );

      // Letters turn red when the car reaches them.
      // Car travels the full screen width, so a letter at x% of the
      // screen lights up at about x% of the scroll progress.
      gsap.utils.toArray(".letter").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const p = gsap.utils.clamp(0, 0.95, center / window.innerWidth);
        tl.to(el, { color: "#E10600", duration: 0.05, ease: "none" }, p);
      });

      // Stats: one at a time (0.08, 0.32, 0.56, 0.80), numbers count up
      const inners = gsap.utils.toArray(".stat-inner");
      const bars = gsap.utils.toArray(".stat-bar");
      const nums = gsap.utils.toArray(".stat-num");
      inners.forEach((el, i) => {
        const start = 0.08 + i * 0.24;
        const counter = { val: 0 };

        tl.to(el, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, start)
          .to(bars[i], { scaleX: 1, duration: 0.16, ease: "none" }, start)
          .to(
            counter,
            {
              val: STATS[i].value,
              duration: 0.16,
              ease: "none",
              onUpdate: () => {
                nums[i].textContent = Math.round(counter.val) + "%";
              },
            },
            start
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="text-white">
      <section className="hero relative h-svh w-full overflow-hidden">
        {/* Headline */}
        <h1 className="headline absolute top-[10%] w-full text-center font-display text-xl font-bold tracking-[0.3em] md:top-[12%] md:text-6xl md:tracking-[0.5em]">
          {HEADLINE.map((c, i) => (
            <span key={i} className="letter inline-block will-change-transform">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h1>

        {/* Road + car */}
        <div className="absolute left-0 top-[32%] h-32 w-full bg-asphalt md:top-[36%] md:h-56">
          {/* dashed center line */}
          <div
            className="absolute inset-x-0 top-1/2 h-0.5 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#fff 0 28px,transparent 28px 56px)",
            }}
          />
          {/* red trail along the bottom edge */}
          <div className="trail absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-rosso shadow-[0_0_18px_#e10600] will-change-transform" />

          {/* car + speed lines move together */}
          <div className="car absolute left-6 top-1/2 -translate-y-1/2 will-change-transform">
            <div className="absolute right-full top-0 flex h-full w-32 flex-col justify-around md:w-48">
              <div className="speed-line h-0.5 bg-gradient-to-l from-rosso to-transparent" />
              <div className="speed-line h-0.5 bg-gradient-to-l from-rosso to-transparent" />
              <div className="speed-line h-0.5 bg-gradient-to-l from-rosso to-transparent" />
            </div>
            <img
              src={`${import.meta.env.BASE_URL}car.png`}
              alt="Ferrari top view"
              className="relative h-24 md:h-44"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-[58%] grid w-full grid-cols-2 gap-x-4 gap-y-6 px-6 md:top-[70%] md:grid-cols-4 md:gap-x-6 md:px-16">
          {STATS.map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-inner">
                <div className="stat-num font-display text-4xl font-bold md:text-7xl">
                  0%
                </div>
                <p className="mt-2 text-xs text-zinc-400 md:text-sm">{s.label}</p>
                <div className="stat-bar mt-3 h-0.5 origin-left scale-x-0 bg-rosso will-change-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}