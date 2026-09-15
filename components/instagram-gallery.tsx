"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Images } from "lucide-react";
import { instagramPhotos } from "../app/instagram-photos";

const batchSize = 8;

export function InstagramGallery() {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const visiblePhotos = instagramPhotos.slice(0, visibleCount);
  const remainingPhotos = instagramPhotos.length - visiblePhotos.length;

  return (
    <section className="instagram-gallery-section" aria-labelledby="instagram-gallery-title">
      <div className="section-top">
        <div>
          <p className="kicker">Instagram gallery</p>
          <h2 id="instagram-gallery-title">More from the Centre</h2>
        </div>
        <div className="gallery-intro">
          <p>
            Publicly accessible images from Al-Jannah Centre’s official Instagram posts,
            hosted here with permission from the Centre and guardians.
          </p>
          <a href="https://www.instagram.com/aljannahcentre/" target="_blank" rel="noreferrer">
            Visit @aljannahcentre <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <ul className="local-gallery" aria-label="Al-Jannah Centre Instagram gallery">
        {visiblePhotos.map((photo, index) => (
          <li key={photo.id}>
            <a
              className="gallery-card"
              href={photo.postUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={"Open Instagram post for " + photo.alt}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={1440}
                height={1440}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="gallery-card-overlay" aria-hidden="true">
                <Images size={17} />
                <span>View post</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="gallery-controls">
        <p aria-live="polite">
          Showing {visiblePhotos.length} of {instagramPhotos.length} public Instagram images
        </p>
        {remainingPhotos > 0 && (
          <button
            className="gallery-show-more"
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + batchSize, instagramPhotos.length))}
          >
            Show {Math.min(batchSize, remainingPhotos)} more images <ArrowRight size={17} />
          </button>
        )}
      </div>
    </section>
  );
}
