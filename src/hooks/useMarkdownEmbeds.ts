import { useEffect } from 'react';
import type { RefObject } from 'react';

const CAROUSEL_INTERVAL_MS = 4000;
const SWIPE_THRESHOLD_PX = 40;

function setActiveSlide(slides: HTMLImageElement[], dots: HTMLElement[], index: number) {
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
}

function enhanceCarousels(root: HTMLElement) {
  root.querySelectorAll<HTMLDivElement>('.md-carousel').forEach((carousel) => {
    if (carousel.dataset.enhanced) return;
    carousel.dataset.enhanced = 'true';

    const slides = Array.from(carousel.querySelectorAll('img'));
    if (slides.length === 0) return;

    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === 0));
    if (slides.length < 2) return;

    const dotsRow = document.createElement('div');
    dotsRow.className = 'md-carousel__dots';
    dotsRow.append(
      ...slides.map((_, i) => {
        const dot = document.createElement('span');
        dot.className = `md-carousel__dot${i === 0 ? ' is-active' : ''}`;
        return dot;
      }),
    );

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'md-carousel__nav md-carousel__nav--prev';
    prevButton.setAttribute('aria-label', 'Previous photo');
    prevButton.textContent = '←';

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'md-carousel__nav md-carousel__nav--next';
    nextButton.setAttribute('aria-label', 'Next photo');
    nextButton.textContent = '→';

    carousel.append(dotsRow, prevButton, nextButton);

    const dots = Array.from(dotsRow.children) as HTMLElement[];
    let index = 0;
    let timer: number | null = null;
    let inView = false;

    function goTo(nextIndex: number) {
      index = (nextIndex + slides.length) % slides.length;
      setActiveSlide(slides, dots, index);
    }

    function stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (!inView) return;
      timer = window.setInterval(() => goTo(index + 1), CAROUSEL_INTERVAL_MS);
    }

    function manualGoTo(nextIndex: number) {
      goTo(nextIndex);
      start();
    }

    prevButton.addEventListener('click', () => manualGoTo(index - 1));
    nextButton.addEventListener('click', () => manualGoTo(index + 1));

    let dragStartX: number | null = null;

    carousel.addEventListener('pointerdown', (event) => {
      dragStartX = event.clientX;
    });
    carousel.addEventListener('pointerup', (event) => {
      if (dragStartX === null) return;
      const delta = event.clientX - dragStartX;
      dragStartX = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
      manualGoTo(delta < 0 ? index + 1 : index - 1);
    });
    carousel.addEventListener('pointerleave', () => {
      dragStartX = null;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.5 },
    );
    observer.observe(carousel);
  });
}

interface Lightbox {
  show(image: HTMLImageElement, gallery: HTMLElement): void;
}

let sharedLightbox: Lightbox | null = null;

const FLIGHT_MS = 380;

/** The rect a photo should grow to: centered, scaled to fit the viewport while keeping its natural aspect ratio. */
function targetRect(naturalWidth: number, naturalHeight: number) {
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.85;
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  return {
    top: (window.innerHeight - height) / 2,
    left: (window.innerWidth - width) / 2,
    width,
    height,
  };
}

function placeStage(stage: HTMLElement, rect: { top: number; left: number; width: number; height: number }) {
  stage.style.top = `${rect.top}px`;
  stage.style.left = `${rect.left}px`;
  stage.style.width = `${rect.width}px`;
  stage.style.height = `${rect.height}px`;
}

function createLightbox(): Lightbox {
  const overlay = document.createElement('div');
  overlay.className = 'md-lightbox';

  const stage = document.createElement('img');
  stage.className = 'md-lightbox__photo';

  overlay.append(stage);
  document.body.append(overlay);

  let currentImage: HTMLImageElement | null = null;
  let activeGallery: HTMLElement | null = null;
  let closing = false;

  function flyTo(naturalWidth: number, naturalHeight: number) {
    stage.style.transition = `top ${FLIGHT_MS}ms ease, left ${FLIGHT_MS}ms ease, width ${FLIGHT_MS}ms ease, height ${FLIGHT_MS}ms ease`;
    placeStage(stage, targetRect(naturalWidth, naturalHeight));
  }

  function close() {
    if (closing || !currentImage) return;
    closing = true;
    overlay.classList.remove('is-open');
    activeGallery?.classList.remove('md-gallery--dimmed');

    const origin = currentImage.getBoundingClientRect();
    stage.style.transition = `top ${FLIGHT_MS}ms ease, left ${FLIGHT_MS}ms ease, width ${FLIGHT_MS}ms ease, height ${FLIGHT_MS}ms ease, opacity ${FLIGHT_MS}ms ease`;
    placeStage(stage, origin);
    stage.style.opacity = '0';

    window.setTimeout(() => {
      stage.removeAttribute('style');
      currentImage = null;
      activeGallery = null;
      closing = false;
    }, FLIGHT_MS);
  }

  function show(image: HTMLImageElement, gallery: HTMLElement) {
    closing = false;
    currentImage = image;
    activeGallery = gallery;

    const origin = image.getBoundingClientRect();
    stage.src = image.src;
    stage.style.transition = 'none';
    stage.style.opacity = '1';
    placeStage(stage, origin);

    gallery.classList.add('md-gallery--dimmed');
    overlay.classList.add('is-open');

    // Force layout so the browser registers the origin rect before flying to the target rect.
    void stage.offsetWidth;
    flyTo(image.naturalWidth, image.naturalHeight);
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', (event) => {
    if (overlay.classList.contains('is-open') && event.key === 'Escape') close();
  });

  return { show };
}

function getLightbox(): Lightbox {
  sharedLightbox ??= createLightbox();
  return sharedLightbox;
}

function enhanceGalleries(root: HTMLElement) {
  root.querySelectorAll<HTMLDivElement>('.md-gallery').forEach((gallery) => {
    if (gallery.dataset.enhanced) return;
    gallery.dataset.enhanced = 'true';

    if (gallery.dataset.columns) {
      gallery.style.setProperty('--md-gallery-columns', gallery.dataset.columns);
    }

    gallery.querySelectorAll('img').forEach((image) => {
      image.addEventListener('click', () => getLightbox().show(image, gallery));
    });
  });
}

/**
 * Wires up the interactive behavior for markdown content embeds rendered via
 * dangerouslySetInnerHTML: `.md-carousel` auto-advances while in view and can
 * also be swiped or stepped with its prev/next buttons; `.md-gallery` photos
 * open a click-to-zoom preview that closes on an outside click or Escape.
 * `.md-full-bleed` needs no JS — it's pure CSS.
 */
export function useMarkdownEmbeds(ref: RefObject<HTMLElement | null>, ...deps: unknown[]) {
  useEffect(() => {
    if (!ref.current) return;
    enhanceCarousels(ref.current);
    enhanceGalleries(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
