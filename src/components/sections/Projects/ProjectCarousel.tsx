"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Pause, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import type { ApiCampaign } from "@/types/campaigns";

declare global {
  interface Window {
    Vimeo?: any;
  }
}

interface ProjectCarouselProps {
  /** Overrides the API fetch; used where the caller already has the list. */
  projects?: ApiCampaign[];
}

const ProjectCarousel = ({ projects: projectsProp }: ProjectCarouselProps) => {
  const { data, isLoading } = useGetCampaignsQuery(
    { status: "ACTIVE" },
    { skip: Boolean(projectsProp) }
  );
  const projects = projectsProp ?? data ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
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
      background: true,
      responsive: true,
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

  if (isLoading && projects.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-1 overflow-hidden rounded-md lg:h-[520px] lg:flex-row">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "animate-pulse rounded-md bg-muted lg:min-h-0 lg:basis-0",
                i === 0 ? "h-[340px] sm:h-[420px] lg:h-auto lg:flex-[3]" : "h-[82px] sm:h-[104px] lg:h-auto lg:flex-1"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-col gap-1 overflow-hidden rounded-md lg:h-[520px] lg:flex-row"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          const detailHref = `/projects/${project.slug}`;
          const hasHtmlVideo = Boolean(project.videoUrl);
          const hasVimeoVideo = Boolean(project.vimeoVideoId);
          const poster = project.coverImage?.url;

          return (
            <article
              key={project.id}
              className={cn(
                "group relative overflow-hidden rounded-md border border-white/20 transition-[height,flex] duration-500 ease-out lg:min-h-0 lg:basis-0",
                isActive
                  ? "h-[340px] sm:h-[420px] lg:h-auto lg:flex-[3]"
                  : "h-[82px] sm:h-[104px] lg:h-auto lg:flex-1"
              )}
            >
              {hasVimeoVideo ? (
                isActive ? (
                  <div
                    ref={(node) => {
                      vimeoHostRefs.current[index] = node;
                    }}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  poster && (
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={poster}
                      alt={project.coverImage?.alt ?? project.title}
                    />
                  )
                )
              ) : hasHtmlVideo ? (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
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
                    alt={project.coverImage?.alt ?? project.title}
                  />
                )
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#012b49]/90 via-[#012b49]/65 to-black/35" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.15),transparent_45%)]" />

              <div className="relative z-20 flex h-full flex-col justify-end p-4 sm:p-5 lg:p-8">
                <div className="max-w-3xl">
                  <div className={cn("flex items-end justify-between gap-3", !isActive && "items-center")}>
                    <h3
                      className={cn(
                        "font-heading font-semibold text-white transition-all duration-300",
                        isActive ? "text-xl sm:text-2xl lg:text-2xl" : "text-lg sm:text-xl lg:text-xl"
                      )}
                    >
                      {project.title}
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
                        aria-label={`Expand ${project.title}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p
                    className={cn(
                      "mt-3 max-w-3xl text-white/90 transition-all duration-300",
                      isActive ? "max-h-28 opacity-100 text-sm sm:text-base" : "max-h-0 opacity-0"
                    )}
                  >
                    {project.summary}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={detailHref}
                        className="inline-flex items-center gap-1.5 border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:text-cyan-300"
                      >
                        Learn More...
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
                          aria-label={paused ? "Play video" : "Pause video"}
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
                          aria-label={soundOn ? "Mute active video" : "Unmute active video"}
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
    </div>
  );
};

export default ProjectCarousel;
