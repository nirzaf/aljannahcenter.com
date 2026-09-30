import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { image: "creativity", alt: "Children sharing a craft activity at Al-Jannah Centre", caption: "Space to create and grow" },
  { image: "artists", alt: "Children drawing together with their teacher", caption: "Learning together, every day" },
  { image: "community", alt: "Children and visitors gathered at Al-Jannah Centre", caption: "A community that cares" },
  { image: "giving", alt: "A child receiving a gift at a Centre event", caption: "Sharing moments of joy" },
];

export default function HeroSlides() {
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
  }, [playing, hovered, focused, active]);
  const select = (index: number) => {
    setPlaying(false);
    setActive((index + slides.length) % slides.length);
  };
  return (
    <div className="hero-photo hero-slideshow" role="region" aria-roledescription="carousel" aria-label="Life at Al-Jannah Centre"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="hero-slide-images" aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, index) => (
          <div key={slide.image} className={`hero-slide ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}
            role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            <img src={`/hero/${slide.image}.webp`} alt={slide.alt} width="800" height="800" fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
            <p className="hero-slide-caption">{slide.caption}</p>
          </div>
        ))}
      </div>
      <div className="hero-slide-controls">
        <button type="button" aria-label="Previous slide" onClick={() => select(active - 1)}><ChevronLeft size={20} /></button>
        <div className="hero-slide-dots" aria-label="Choose a slide">
          {slides.map((slide, index) => <button type="button" key={slide.image} aria-label={`Show slide ${index + 1}: ${slide.caption}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}><span /></button>)}
        </div>
        <button type="button" aria-label="Next slide" onClick={() => select(active + 1)}><ChevronRight size={20} /></button>
        <button type="button" aria-label={playing ? "Pause slideshow" : "Play slideshow"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
      </div>
    </div>
  );
}
