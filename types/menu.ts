import { type LucideIcon } from "lucide-react";

export interface SubMenuItem {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  icon?: LucideIcon;
  submenu?: SubMenuItem[];
}

export interface Menu {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: SubMenuItem[];
}
