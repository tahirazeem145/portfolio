'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  refs);
}

/**
 * Returns baseValue during SSR and first render, then updates to the correct
 * breakpoint value client-side — guarantees no hydration mismatch.
 */
function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };
    handleResize(); // correct immediately after mount
    let id: ReturnType<typeof setTimeout>;
    const debounced = () => { clearTimeout(id); id = setTimeout(handleResize, 100); };
    window.addEventListener('resize', debounced);
    return () => { window.removeEventListener('resize', debounced); clearTimeout(id); };
  }, [baseValue, mobileValue]);

  return value;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Render function receiving `hoveredIndex`; returns the array of wheel items. */
  children: (hoveredIndex: number | null) => ReactNode[];
  /** Scroll px to complete one full rotation. Default 2500. */
  scrollDuration?: number;
  /** Percentage of circle visible above fold (0-100). Default 45. */
  visiblePercentage?: number;
  /** Circle radius on desktop (≥768px). */
  baseRadius?: number;
  /** Circle radius on mobile (<768px). */
  mobileRadius?: number;
  /** GSAP ScrollTrigger start string. Default "center center". */
  startTrigger?: string;
  /** Fired when an item is clicked / keyboard-selected. */
  onItemSelect?: (index: number) => void;
  /** Rotation direction. */
  direction?: 'ltr' | 'rtl';
  /** Disables interactions and applies grayscale. */
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const pinRef  = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const firstLiRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize]       = useState<{ w: number; h: number } | null>(null);
    // isMounted gates the whole wheel so it never renders on the server.
    const [isMounted, setIsMounted]       = useState(false);
    const [visible, setVisible]           = useState(false);

    const currentRadius   = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter  = currentRadius * 2;
    const maskPercent     = useResponsiveValue(30, 10); // Fade only bottom 10% on mobile, 30% on desktop
    const currentScrub    = useResponsiveValue(1, 0.2); // Snappier, direct scroll response on mobile (0.2s delay vs 1s on desktop)

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const [scrollActiveIndex, setScrollActiveIndex] = useState<number>(0);
    const activeIndex = hoveredIndex !== null ? hoveredIndex : scrollActiveIndex;

    // Evaluate children array (calls the render-prop with current activeIndex)
    const childrenNodes = useMemo(
      () => React.Children.toArray(children(activeIndex)),
      [children, activeIndex]
    );
    const childrenCount = childrenNodes.length;

    // Register GSAP plugin once on mount
    useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);
      setIsMounted(true);
    }, []);

    // Observe first child size for layout maths
    useEffect(() => {
      if (!isMounted || !firstLiRef.current) return;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChildSize({ w: entry.contentRect.width, h: entry.contentRect.height });
          ScrollTrigger.refresh();
        }
      });
      observer.observe(firstLiRef.current);
      return () => observer.disconnect();
    }, [isMounted, childrenCount]);

    // Fade in after mount to avoid flash
    useEffect(() => {
      if (isMounted) {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
      }
    }, [isMounted]);

    // GSAP scroll animations — run inside rAF so DOM nodes are painted before targeting
    useGSAP(
      () => {
        if (!isMounted || !pinRef.current || !listRef.current || childrenCount === 0) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        const ctx = gsap.context(() => {
          // Stagger-in entrance (slight delay ensures children are painted)
          gsap.fromTo(
            Array.from(listRef.current!.children),
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'back.out(1.2)',
              stagger: 0.06,
              delay: 0.1,
              scrollTrigger: {
                trigger: pinRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Scroll-driven animation timeline that pins the gallery
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              start: startTrigger,
              end: `+=${scrollDuration}`,
              scrub: currentScrub,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const count = childrenCount;
                if (count === 0) return;
                // self.progress goes from 0 to 1 as the wheel spins 360 degrees.
                // The card that is closest to the top of the wheel (270 degrees) is:
                let active = Math.round(count * (0.75 - self.progress)) % count;
                if (active < 0) active += count;
                setScrollActiveIndex(active);
              },
            },
          });

          // Rotate the wheel ring (ul) 360 degrees
          tl.to(listRef.current, {
            rotation: 360,
            ease: 'none',
          }, 0); // start at time 0

          // Counter-rotate the cards (li children) -360 degrees to keep them upright
          tl.to(Array.from(listRef.current!.children), {
            rotation: -360,
            ease: 'none',
          }, 0); // start at time 0
        }, pinRef);

        return () => ctx.revert();
      },
      {
        scope: pinRef,
        dependencies: [isMounted, scrollDuration, currentRadius, startTrigger, childrenCount, currentScrub],
      }
    );

    if (childrenCount === 0) return null;

    // Height calculation
    const scaleFactor       = 1.25;
    const calculatedBuffer  = childSize ? childSize.h * scaleFactor - childSize.h + 60 : 150;
    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    return (
      <div
        ref={mergedRef}
        className={`w-full relative flex items-center justify-center overflow-hidden ${className}`}
        suppressHydrationWarning
        {...rest}
      >
        {/* Placeholder shown server-side; replaced by the wheel after hydration */}
        {!isMounted ? (
          <div style={{ height: `${circleDiameter * visibleDecimal + 200}px` }} />
        ) : (
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: `${visibleAreaHeight}px`,
              maskImage: `linear-gradient(to top, transparent 0%, black ${maskPercent}%, black 100%)`,
              WebkitMaskImage: `linear-gradient(to top, transparent 0%, black ${maskPercent}%, black 100%)`,
            }}
          >
            <ul
              ref={listRef}
              className={[
                'absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none',
                'transition-opacity duration-700 ease-out',
                disabled    ? 'opacity-50 pointer-events-none grayscale' : '',
                visible     ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              dir={direction}
              style={{
                width:  circleDiameter,
                height: circleDiameter,
                bottom: -(circleDiameter * hiddenDecimal),
              }}
            >
              {childrenNodes.map((child, index) => {
                const angle         = (index / childrenCount) * 2 * Math.PI;
                let   x             = currentRadius * Math.cos(angle);
                const y             = currentRadius * Math.sin(angle);
                if (direction === 'rtl') x = -x;

                // Place item on the circle — NO rotation on the <li> itself
                // so cards always face upright. The wheel ring (ul) rotates;
                // each card just translates to its position.
                const isActive      = activeIndex === index;
                const isHovered     = hoveredIndex === index;
                const isAnyHovered  = hoveredIndex !== null;

                return (
                  <li
                    key={index}
                    ref={index === 0 ? firstLiRef : null}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      zIndex:    isActive ? 100 : 10,
                      // translate3d positions the card on the circle;
                      // no rotate here — cards stay upright.
                      transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`,
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      onClick={() => !disabled && onItemSelect?.(index)}
                      onKeyDown={(e) => {
                        if (disabled) return;
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemSelect?.(index); }
                      }}
                      onMouseEnter={() => !disabled && setHoveredIndex(index)}
                      onMouseLeave={() => !disabled && setHoveredIndex(null)}
                      onFocus={()    => !disabled && setHoveredIndex(index)}
                      onBlur={()     => !disabled && setHoveredIndex(null)}
                      style={{
                        // Scale and lift on hover via inline style (avoids Tailwind
                        // class conflicts with the transform chain).
                        transform: isHovered
                          ? 'scale(1.18) translateY(-12px)'
                          : 'scale(1) translateY(0)',
                        filter: isAnyHovered && !isHovered
                          ? 'blur(2px) grayscale(1)'
                          : 'none',
                        opacity:   isAnyHovered && !isHovered ? 0.4 : 1,
                      }}
                      className={[
                        'block cursor-pointer outline-none text-left rounded-xl',
                        'transition-all duration-500 ease-out will-change-transform',
                        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      ].join(' ')}
                    >
                      {child}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';
