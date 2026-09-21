"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import type { ApiCampaign } from "@/types/campaigns";
import { useLanguage } from "@/components/i18n/LanguageProvider";

declare global {
  interface Window {
    Vimeo?: any;
  }
}

/** Cards visible at once; the strip slides one card at a time past this. */
const PAGE_SIZE = 4;

/**
 * Running order on the home page, by slug. The API returns campaigns in its
 * own order, so this pins the sequence the client asked for. Anything not
 * listed keeps its API position, after these.
 */
const DISPLAY_ORDER = [
  "beyond-the-journey",
  "counter-climate-change",
  "health-care-for-all",
  "amar-bhai-er-eid",
  "one-minute-investment",
];

const orderRank = (slug: string) => {
  const rank = DISPLAY_ORDER.indexOf(slug);
  return rank === -1 ? DISPLAY_ORDER.length : rank;
};

/**
 * Projects held to their cover image even when the campaign record still
 * carries a video. Clearing `videoUrl`/`vimeoVideoId` on the campaign in the
 * admin panel is the durable fix — this keeps the card on its still image
 * until then, and also hides the play/sound controls for it.
 */
const IMAGE_ONLY_SLUGS = new Set(["health-care-for-all"]);

interface ProjectCarouselProps {
  /** Overrides the API fetch; used where the caller already has the list. */
  projects?: ApiCampaign[];
}

const ProjectCarousel = ({ projects: projectsProp }: ProjectCarouselProps) => {
  const { data, isLoading } = useGetCampaignsQuery(
    { status: "ACTIVE" },
    { skip: Boolean(projectsProp) }
  );
  const { pick, t } = useLanguage();
  // Memoised so the video effects below, which take `projects` as a dep, do
  // not re-run on every render against a fresh array.
  const projects = useMemo(() => {
    const list = projectsProp ?? data ?? [];
    return [...list].sort((a, b) => orderRank(a.slug) - orderRank(b.slug));
  }, [projectsProp, data]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowStart, setWindowStart] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const vimeoHostRefs = useRef<Array<HTMLDivElement | null>>([]);
  const vimeoPlayers = useRef<Array<any | null>>([]);
  const vimeoApiReady = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Vimeo?.Player) {
      vimeoApiReady.current = true;
      return;
    }

    const existing = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = () => {
      vimeoApiReady.current = true;
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (!projects[index]?.videoUrl) return;

      const isActive = index === activeIndex;
      video.muted = !isActive || !soundOn;

      if (!isActive) {
        video.pause();
        return;
      }

      if (paused) {
        video.pause();
        return;
      }

      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Ignore autoplay failures (browser policy).
        });
      }
      });
  }, [activeIndex, paused, soundOn]);


  useEffect(() => {
    const project = projects[activeIndex];
    if (!project?.vimeoVideoId) return;
    if (!vimeoApiReady.current || !window.Vimeo?.Player) return;

    const host = vimeoHostRefs.current[activeIndex];
    if (!host) return;

    // Destroy any existing player at this slot so expanded view starts from beginning.
    const existingPlayer = vimeoPlayers.current[activeIndex];
    if (existingPlayer?.destroy) {
      try {
        existingPlayer.destroy();
      } catch {
        // ignore
      }
      vimeoPlayers.current[activeIndex] = null;
    }

    host.innerHTML = "";

    const player = new window.Vimeo.Player(host, {
      id: project.vimeoVideoId,
      autopause: false,
      autoplay: true,
      muted: true,
      loop: true,
      // NOT `background: true`: that is Vimeo's cover mode, which fills the
      // card by cropping — it cut the portrait Eid reel down to a centre band.
      // A normal player with its chrome turned off letterboxes instead, so the
      // whole frame shows whatever the video's aspect ratio is.
      controls: false,
      title: false,
      byline: false,
      portrait: false,
    });

    vimeoPlayers.current[activeIndex] = player;

    // Start from beginning on expand.
    player
      .setCurrentTime(0)
      .catch(() => {
        // ignore
      })
      .finally(() => {
        player.play().catch(() => {
          // ignore
        });
      });
  }, [activeIndex, projects]);

  useEffect(() => {
    const project = projects[activeIndex];
    if (!project?.vimeoVideoId) return;
    const player = vimeoPlayers.current[activeIndex];
    if (!player) return;

    const nextVolume = soundOn ? 1 : 0;

    if (paused) {
      player.pause().catch(() => {
        // ignore
      });
    } else {
      player.play().catch(() => {
        // ignore
      });
    }

    player.setVolume(nextVolume).catch(() => {
      // ignore
    });
  }, [activeIndex, paused, projects, soundOn]);

  // The strip is a sliding window: stepping right drops the leftmost card and
  // brings the next one in, rather than jumping a whole page.
  const maxStart = Math.max(0, projects.length - PAGE_SIZE);
  // Clamped rather than reset in an effect, so a shrinking list can never
  // strand the view past the end.
  const safeStart = Math.min(windowStart, maxStart);
  const visibleProjects = projects.slice(safeStart, safeStart + PAGE_SIZE);
  const canSlide = projects.length > PAGE_SIZE;

  const slide = (delta: number) => {
    const next = Math.max(0, Math.min(safeStart + delta, maxStart));
    setWindowStart(next);
    // Keep the expanded card if it is still in frame; otherwise expand the
    // nearest one, so the strip never lands with everything collapsed.
    setActiveIndex((prev) => Math.min(Math.max(prev, next), next + PAGE_SIZE - 1));
    setPaused(false);
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-2 overflow-hidden rounded-md lg:h-[520px] lg:flex-row lg:gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "animate-pulse rounded-md bg-muted lg:min-h-0 lg:basis-0",
                i === 0 ? "h-[300px] sm:h-[420px] lg:h-auto lg:flex-[3]" : "h-[96px] sm:h-[104px] lg:h-auto lg:flex-1"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="relative w-full">
      <motion.div
        className="flex flex-col gap-2 overflow-hidden rounded-md lg:h-[520px] lg:flex-row lg:gap-1"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        {visibleProjects.map((project, offset) => {
          // Refs and video effects are keyed by position in the full list, so
          // paging must not renumber them.
          const index = safeStart + offset;
          const isActive = index === activeIndex;
          const detailHref = `/projects/${project.slug}`;
          const imageOnly = IMAGE_ONLY_SLUGS.has(project.slug);
          const hasHtmlVideo = !imageOnly && Boolean(project.videoUrl);
          const hasVimeoVideo = !imageOnly && Boolean(project.vimeoVideoId);
          const poster = project.coverImage?.url;
          const title = pick(project.title, project.titleBn);
          const summary = pick(project.summary, project.summaryBn);

          return (
            <article
              key={project.id}
              className={cn(
                "group relative overflow-hidden rounded-md border border-white/20 transition-[height,flex] duration-500 ease-out lg:min-h-0 lg:basis-0",
                isActive
                  ? "h-[300px] sm:h-[420px] lg:h-auto lg:flex-[3]"
                  : "h-[96px] sm:h-[104px] lg:h-auto lg:flex-1"
              )}
            >
              {hasVimeoVideo ? (
                isActive ? (
                  <div
                    ref={(node) => {
                      vimeoHostRefs.current[index] = node;
                    }}
                    className="absolute inset-0 h-full w-full overflow-hidden bg-black [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full"
                  />
                ) : (
                  poster && (
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={poster}
                      alt={project.coverImage?.alt ?? title}
                    />
                  )
                )
              ) : hasHtmlVideo ? (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full bg-black object-contain"
                  src={project.videoUrl ?? undefined}
                  poster={poster}
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  muted
                />
              ) : (
                poster && (
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={poster}
                    alt={project.coverImage?.alt ?? title}
                  />
                )
              )}

              {/* Collapsed cards keep a tint for title contrast; expanded shows original media colors. */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#012b49]/90 via-[#012b49]/65 to-black/35 transition-opacity duration-500",
                  isActive ? "opacity-0" : "opacity-100"
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.15),transparent_45%)] transition-opacity duration-500",
                  isActive ? "opacity-0" : "opacity-100"
                )}
              />
              {/* Soft bottom scrim only under text when expanded — keeps type readable without tinting the whole frame */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              <div className="relative z-20 flex h-full flex-col justify-end p-4 sm:p-5 lg:p-8">
                <div className="max-w-3xl">
                  <div className={cn("flex items-end justify-between gap-3", !isActive && "items-center")}>
                    <h3
                      className={cn(
                        "font-heading font-semibold text-white transition-all duration-300 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]",
                        isActive
                          ? "text-lg sm:text-2xl lg:text-2xl"
                          // Two lines max: a long title used to push the expand
                          // button out of a collapsed card on narrow screens.
                          : "line-clamp-2 text-base sm:text-xl lg:text-xl"
                      )}
                    >
                      {title}
                    </h3>
                    {!isActive && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveIndex(index);
                          setPaused(false);
                        }}
                        className="relative z-30 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/80 text-cyan-300 transition-colors hover:bg-cyan-500/20"
                        aria-label={`${t("home.expand")} ${title}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p
                    className={cn(
                      "mt-2 max-w-3xl overflow-hidden text-white/90 transition-all duration-300 sm:mt-3",
                      isActive
                        ? "max-h-20 opacity-100 text-[0.8125rem] sm:max-h-28 sm:text-base"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {summary}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={detailHref}
                        className="inline-flex items-center gap-1.5 border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:text-cyan-300"
                      >
                        {t("home.learnMoreEllipsis")}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {(hasHtmlVideo || hasVimeoVideo) && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPaused((prev) => !prev);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white transition-colors hover:bg-black/55"
                          aria-label={paused ? t("home.playVideo") : t("home.pauseVideo")}
                        >
                          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSoundOn((prev) => !prev);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white transition-colors hover:bg-black/55"
                          aria-label={soundOn ? t("home.muteVideo") : t("home.unmuteVideo")}
                        >
                          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </motion.div>

      {canSlide && (
        <div
          className={cn(
            // Below the strip on narrow screens, where the cards stack; from lg
            // it floats over the middle-right of the last visible card.
            // z-40 clears the cards' own z-20 content overlay — without it the
            // card sits on top of these buttons and eats the click.
            "relative z-40 mt-5 flex items-center justify-center gap-3",
            "lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:justify-end lg:pr-4 xl:pr-6"
          )}
        >
          <button
            type="button"
            onClick={() => slide(-1)}
            disabled={safeStart === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30 lg:pointer-events-auto lg:border-white/40 lg:bg-black/40 lg:text-white lg:hover:bg-black/65"
            aria-label={t("home.previousProject")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            disabled={safeStart === maxStart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30 lg:pointer-events-auto lg:border-white/40 lg:bg-black/40 lg:text-white lg:hover:bg-black/65"
            aria-label={t("home.nextProject")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCarousel;
