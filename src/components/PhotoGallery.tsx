"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { galleryPhotos } from "../data/gallery-photos";
import { instagramPhotos } from "../data/instagram-photos";

type Photo = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  postUrl?: string;
};

const thumbFor = (src: string) => src.replace(/\/([^/]+)\.jpg$/, "/thumbs/$1.webp");

const albums = [
  {
    key: "centre",
    label: "Centre photos",
    photos: galleryPhotos.map((photo) => ({ ...photo, thumb: thumbFor(photo.src) })) as Photo[],
    source: { label: "Official Facebook gallery", href: "https://www.facebook.com/aljannahcentre/photos/" },
  },
  {
    key: "instagram",
    label: "Instagram",
    photos: instagramPhotos.map((photo) => ({ ...photo, thumb: thumbFor(photo.src) })) as Photo[],
    source: { label: "Visit @aljannahcentre", href: "https://www.instagram.com/aljannahcentre/" },
  },
];

const batchSize = 12;

export function PhotoGallery() {
  const [albumIndex, setAlbumIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);

  const album = albums[albumIndex];
  const visiblePhotos = album.photos.slice(0, visibleCount);
  const remaining = album.photos.length - visiblePhotos.length;
  const current = openIndex === null ? null : album.photos[openIndex];

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) =>
        index === null ? index : (index + delta + album.photos.length) % album.photos.length,
      ),
    [album.photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  function selectAlbum(index: number) {
    setAlbumIndex(index);
    setVisibleCount(batchSize);
  }

  return (
    <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="kicker">Photo gallery</p>
            <h2 id="gallery-title">Moments from the Centre</h2>
          </div>
          <p>
            Classroom creativity, celebrations and community days, shared from the Centre’s
            official channels with permission from the Centre and guardians.
          </p>
        </div>

        <div className="gallery-toolbar">
          <div className="gallery-tabs" role="tablist" aria-label="Gallery albums">
            {albums.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={"gallery-tab-" + item.key}
                aria-selected={index === albumIndex}
                aria-controls="gallery-panel"
                onClick={() => selectAlbum(index)}
              >
                {item.label} <span>{item.photos.length}</span>
              </button>
            ))}
          </div>
          <a className="text-link" href={album.source.href} target="_blank" rel="noreferrer">
            {album.source.label} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <ul
          className="gallery-grid"
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={"gallery-tab-" + album.key}
        >
          {visiblePhotos.map((photo, index) => (
            <li key={album.key + photo.id}>
              <button
                type="button"
                className="gallery-tile"
                onClick={() => setOpenIndex(index)}
                aria-label={"View larger: " + photo.alt}
              >
                <img
                  src={photo.thumb}
                  alt=""
                  width={480}
                  height={480}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                />
                <span className="gallery-tile-icon" aria-hidden="true"><Images size={16} /></span>
              </button>
            </li>
          ))}
        </ul>

        <div className="gallery-footer">
          <p aria-live="polite">
            Showing {visiblePhotos.length} of {album.photos.length}
          </p>
          {remaining > 0 && (
            <button
              className="button button-outline"
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + batchSize, album.photos.length))}
            >
              Show {Math.min(batchSize, remaining)} more
            </button>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Photo viewer"
        onClose={() => setOpenIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenIndex(null);
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {current && (
          <>
            <div className="lightbox-bar">
              <p>
                {openIndex! + 1} / {album.photos.length}
              </p>
              <div>
                {current.postUrl && (
                  <a href={current.postUrl} target="_blank" rel="noreferrer">
                    View post <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                <button type="button" className="lightbox-close" onClick={() => setOpenIndex(null)}>
                  <X size={22} aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
            <figure className="lightbox-figure">
              {/* The cached thumbnail shows instantly while the full photo downloads. */}
              {loadedSrc !== current.src && (
                <img className="lightbox-placeholder" src={current.thumb} alt="" aria-hidden="true" />
              )}
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                decoding="async"
                onLoad={() => setLoadedSrc(current.src)}
                hidden={loadedSrc !== current.src}
              />
              <link rel="preload" as="image" href={album.photos[(openIndex! + 1) % album.photos.length].src} />
            </figure>
            <button type="button" className="lightbox-nav lightbox-prev" onClick={() => step(-1)}>
              <ChevronLeft size={26} aria-hidden="true" />
              <span className="sr-only">Previous photo</span>
            </button>
            <button type="button" className="lightbox-nav lightbox-next" onClick={() => step(1)}>
              <ChevronRight size={26} aria-hidden="true" />
              <span className="sr-only">Next photo</span>
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
