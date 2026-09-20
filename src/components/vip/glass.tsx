'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   PALMA VIP — the interactive glass

   The three pieces that genuinely need the browser: the panel that tracks a
   pointer, the same panel as a link, and the figure that counts up when it is
   first seen. Everything else on a desk is a CSS-only surface and lives in
   `surface.tsx`, which stays a server module.

   Every prop here is serialisable on purpose. Nothing in this file takes a
   component — an icon crossing this boundary would break the desks that
   render on the server.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Writes the pointer position into the element as `--mx`/`--my`, which
 * `.vip-spot` reads to place its specular highlight.
 *
 * Deliberately *not* React state: a re-render per mousemove would cost a whole
 * commit to move a gradient. Writing the custom property straight onto the
 * node keeps the highlight on the compositor.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return { ref, onPointerMove };
}

type GlassProps = {
  children: React.ReactNode;
  className?: string;
  /** `strong` for the panel carrying the page's answer, `quiet` for furniture. */
  tone?: 'default' | 'strong' | 'quiet';
  /** A champagne rim. The institution's ceremonial mark — one per page, at most. */
  ceremonial?: boolean;
  /** Pointer-tracked specular highlight. */
  spotlight?: boolean;
  /** A band of light that crosses the panel on hover. */
  sheen?: boolean;
  /** Reveal as it scrolls into view. */
  reveal?: boolean | 'soft';
  /** Stagger index for the above-the-fold entrance. */
  index?: number;
  style?: React.CSSProperties;
};

export function Glass({
  children,
  className,
  tone = 'default',
  ceremonial,
  spotlight,
  sheen,
  reveal,
  index,
  style,
}: GlassProps) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={spotlight ? onPointerMove : undefined}
      style={index === undefined ? style : { ...style, ['--i' as string]: index }}
      className={cn(
        'vip-glass',
        tone === 'strong' && 'vip-glass-strong',
        tone === 'quiet' && 'vip-glass-quiet',
        ceremonial && 'vip-rim-gold',
        spotlight && 'vip-spot',
        sheen && 'vip-sheen',
        reveal === 'soft' ? 'vip-reveal-soft' : reveal ? 'vip-reveal' : null,
        index !== undefined && 'vip-enter',
        className,
      )}
    >
      {sheen ? <span className="vip-sheen-band" aria-hidden /> : null}
      {children}
    </div>
  );
}

/** The same surface, as a link. Lifts and sheens on hover. */
export function GlassLink({
  href,
  children,
  className,
  tone = 'default',
  ceremonial,
  index,
  reveal,
}: GlassProps & { href: string }) {
  const { ref, onPointerMove } = useSpotlight<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onPointerMove}
      style={
        index === undefined ? undefined : ({ ['--i' as string]: index } as React.CSSProperties)
      }
      className={cn(
        'vip-glass vip-spot vip-sheen vip-lift group block',
        tone === 'strong' && 'vip-glass-strong',
        tone === 'quiet' && 'vip-glass-quiet',
        ceremonial && 'vip-rim-gold',
        reveal === 'soft' ? 'vip-reveal-soft' : reveal ? 'vip-reveal' : null,
        index !== undefined && 'vip-enter',
        'focus-visible:outline-champagne focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
    >
      <span className="vip-sheen-band" aria-hidden />
      {children}
    </Link>
  );
}

/**
 * A figure that counts up the first time it is seen.
 *
 * Tied to an IntersectionObserver rather than to mount, so a stat below the
 * fold still animates when it is scrolled to — and one the reader never
 * reaches never burns a frame. The final value is what renders on the server
 * and for anyone with reduced motion, so the number is correct even if the
 * script never runs.
 */
export function Figure({
  value,
  className,
  gold,
  duration = 1100,
}: {
  value: number | string;
  className?: string;
  gold?: boolean;
  duration?: number;
}) {
  const numeric = typeof value === 'number' ? value : null;
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | string>(value);

  useEffect(() => {
    if (numeric === null || numeric === 0) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let done = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((entry) => entry.isIntersecting)) return;
        done = true;
        observer.disconnect();

        const started = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / duration);
          // The house curve, so a counting figure and the panel it sits on
          // settle together.
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(Math.round(numeric * eased));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        setShown(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [numeric, duration]);

  return (
    <span ref={ref} className={cn('vip-figure', gold && 'vip-figure-gold', className)}>
      {typeof shown === 'number' ? new Intl.NumberFormat('en-GB').format(shown) : shown}
    </span>
  );
}
