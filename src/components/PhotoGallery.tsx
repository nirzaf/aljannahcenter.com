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

export type GalleryLabels = {
  section: string;
  albums: string;
  albumCentre: string;
  albumInstagram: string;
  sourceFacebook: string;
  sourceInstagram: string;
  /** Template with {shown} and {total}. */
  showing: string;
  /** Template with {n}. */
  showMore: string;
  viewLarger: string;
  viewer: string;
  viewPost: string;
  close: string;
  previous: string;
  next: string;
};

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);

export function PhotoGallery({ labels }: { labels: GalleryLabels }) {
  const albumLabels: Record<string, { label: string; source: string }> = {
    centre: { label: labels.albumCentre, source: labels.sourceFacebook },
    instagram: { label: labels.albumInstagram, source: labels.sourceInstagram },
  };
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
    <section className="gallery-section" id="gallery" aria-label={labels.section}>
      <div className="container">
        <div className="gallery-toolbar">
          <div className="gallery-tabs" role="tablist" aria-label={labels.albums}>
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
                {albumLabels[item.key].label} <span>{item.photos.length}</span>
              </button>
            ))}
          </div>
          <a className="text-link" href={album.source.href} target="_blank" rel="noreferrer">
            {albumLabels[album.key].source} <ArrowUpRight size={16} aria-hidden="true" />
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
                aria-label={labels.viewLarger + ": " + photo.alt}
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
            {fill(labels.showing, { shown: visiblePhotos.length, total: album.photos.length })}
          </p>
          {remaining > 0 && (
            <button
              className="button button-outline"
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + batchSize, album.photos.length))}
            >
              {fill(labels.showMore, { n: Math.min(batchSize, remaining) })}
            </button>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={labels.viewer}
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
                    {labels.viewPost} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                <button type="button" className="lightbox-close" onClick={() => setOpenIndex(null)}>
                  <X size={22} aria-hidden="true" />
                  <span className="sr-only">{labels.close}</span>
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
              <span className="sr-only">{labels.previous}</span>
            </button>
            <button type="button" className="lightbox-nav lightbox-next" onClick={() => step(1)}>
              <ChevronRight size={26} aria-hidden="true" />
              <span className="sr-only">{labels.next}</span>
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
