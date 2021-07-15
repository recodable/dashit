import type { Component } from "solid-js";

export type Dashboard = {
  id: number;
  name: string;
};

export interface DashboardWithBlocks extends Dashboard {
  blocks: { settings: object; type: string }[];
}

export type BlockSetup = {
  name: string;
  description: string;
  Component: Component;
};

export type Block = {
  name: string;
  description: string;
  Component: Component;
  type: string;
  setup?: BlockSetup;
};
