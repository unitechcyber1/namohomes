import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../../service/api";
import { getBuilders } from "../../../service/builderService";

const BUILDERS_FETCH_LIMIT = 48;

const resolveLogoUrl = (builder) => {
  const raw = builder?.BuilderLogo ?? builder?.builderLogo ?? builder?.logo;
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const base = String(api.defaults.baseURL || "").replace(/\/$/, "");
  if (!base) return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
};

const PopularBuilders = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanPrev(scrollLeft > 4);
    setCanNext(max > 4 && scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getBuilders({ limit: BUILDERS_FETCH_LIMIT, page: 1 });
        if (!cancelled && data?.builders?.length) {
          setBuilders(data.builders);
        }
      } catch {
        if (!cancelled) setBuilders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || builders.length === 0) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [builders.length, updateScrollState]);

  const scrollByDirection = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.75, 280);
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 lg:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold font-heading leading-tight">
            <span className="text-slate-900">Top Builders in Gurgaon</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-surface p-8 min-h-[168px] min-w-[200px] sm:min-w-[220px] flex-1 animate-pulse"
              >
                <div className="h-12 bg-secondary-100 rounded mx-auto mb-4 max-w-[120px]" />
                <div className="h-4 bg-secondary-100 rounded mx-auto w-3/4" />
              </div>
            ))}
          </div>
        ) : builders.length === 0 ? null : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative"
          >
            {/* Prev */}
            <button
              type="button"
              aria-label="Previous builders"
              onClick={() => scrollByDirection("prev")}
              disabled={!canPrev}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1 sm:translate-x-0
                hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90
                bg-white text-primary shadow-md transition-all hover:bg-primary-50 hover:border-primary-200
                disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            {/* Next */}
            <button
              type="button"
              aria-label="Next builders"
              onClick={() => scrollByDirection("next")}
              disabled={!canNext}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1 sm:translate-x-0
                hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90
                bg-white text-primary shadow-md transition-all hover:bg-primary-50 hover:border-primary-200
                disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pl-0 pr-0 snap-x snap-mandatory
                [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                sm:pl-12 sm:pr-12"
            >
              {builders.map((builder, index) => (
                <div
                  key={builder._id ?? builder.id ?? `builder-${index}`}
                  className="snap-start shrink-0 w-[calc(50%-0.5rem)] min-w-[160px] max-w-[280px]
                    sm:w-[220px] sm:min-w-[220px] md:w-[240px] md:min-w-[240px] lg:w-[260px] lg:min-w-[260px]"
                >
                  <BuilderCard builder={builder} />
                </div>
              ))}
            </div>

            <p className="mt-2 text-center text-xs text-text-secondary sm:hidden">
              Swipe sideways to see more builders
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

function BuilderCard({ builder }) {
  const name = builder?.name ?? "Builder";
  const src = resolveLogoUrl(builder);
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="group flex h-full flex-col items-center justify-center rounded-2xl border border-slate-100/90
        bg-white px-4 py-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow duration-200
        hover:shadow-[0_8px_24px_rgba(29,58,120,0.08)] min-h-[180px]"
    >
      <div className="flex flex-1 items-center justify-center w-full mb-4 min-h-[72px]">
        {src && !imgError ? (
          <img
            src={src}
            alt=""
            className="max-h-16 w-auto max-w-[140px] object-contain"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary text-center px-2">
            {name.slice(0, 2)}
          </span>
        )}
      </div>
      <p className="text-center text-sm md:text-base font-medium text-text-primary leading-snug line-clamp-2">
        {name}
      </p>
    </article>
  );
}

export default PopularBuilders;
