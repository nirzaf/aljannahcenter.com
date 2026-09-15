"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Images } from "lucide-react";
import { galleryPhotos } from "../app/gallery-photos";

const batchSize = 12;

export function LocalGallery() {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const visiblePhotos = galleryPhotos.slice(0, visibleCount);
  const remainingPhotos = galleryPhotos.length - visiblePhotos.length;

  return (
    <section className="local-gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div className="section-top">
        <div>
          <p className="kicker">Photo gallery</p>
          <h2 id="gallery-title">Moments from the Centre</h2>
        </div>
        <div className="gallery-intro">
          <p>
            88 public photos from Al-Jannah Centre’s official Facebook gallery, now
            hosted here with permission from the Centre and guardians.
          </p>
          <a href="https://www.facebook.com/aljannahcentre/photos/" target="_blank" rel="noreferrer">
            Open official gallery <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <ul className="local-gallery" aria-label="Al-Jannah Centre photo gallery">
        {visiblePhotos.map((photo, index) => (
          <li key={photo.id}>
            <a
              className="gallery-card"
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              aria-label={"Open " + photo.alt}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={2048}
                height={2048}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="gallery-card-overlay" aria-hidden="true">
                <Images size={17} />
                <span>Open photo</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="gallery-controls">
        <p aria-live="polite">
          Showing {visiblePhotos.length} of {galleryPhotos.length} photos
        </p>
        {remainingPhotos > 0 && (
          <button
            className="gallery-show-more"
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + batchSize, galleryPhotos.length))}
          >
            Show {Math.min(batchSize, remainingPhotos)} more photos <ArrowRight size={17} />
          </button>
        )}
      </div>
    </section>
  );
}
