import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Slide = { image: string; alt: string; caption: string };
type Labels = {
  region: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
  choose: string;
  /** Template with {n} and {caption}. */
  show: string;
  /** Template with {n} and {total}. */
  position: string;
};

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);

export default function HeroSlides({ slides, labels }: { slides: Slide[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!preference.matches);
    const update = () => setPlaying(!preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || hovered || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, active, slides.length]);
  const select = (index: number) => {
    setPlaying(false);
    setActive((index + slides.length) % slides.length);
  };
  return (
    <div className="hero-photo hero-carousel" role="region" aria-roledescription="carousel" aria-label={labels.region}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="hero-frames" aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, index) => (
          <figure key={slide.image} className={`hero-frame ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}
            role="group" aria-roledescription="slide" aria-label={fill(labels.position, { n: index + 1, total: slides.length })}>
            <img src={`/hero/${slide.image}.webp`} alt={slide.alt} width="800" height="800" fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="hero-progress" aria-label={labels.choose}>
        {slides.map((slide, index) => <button type="button" key={slide.image} aria-label={fill(labels.show, { n: index + 1, caption: slide.caption })} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}><span /></button>)}
      </div>
      <div className="hero-controls">
        <button type="button" aria-label={labels.previous} onClick={() => select(active - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <button type="button" aria-label={playing ? labels.pause : labels.play} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button>
        <button type="button" aria-label={labels.next} onClick={() => select(active + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
