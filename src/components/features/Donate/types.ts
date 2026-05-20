export type Frequency = "monthly" | "onetime";

export interface ImpactEntry {
  icon: string;
  text: string;
}

export interface ProjectCard {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface UtilizationItem {
  icon: string;
  label: string;
  content: string;
}

export interface TransformCard {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  number: string;
  label: string;
}
