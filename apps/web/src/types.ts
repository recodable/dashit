import type { Component } from "solid-js";

export type Dashboard = {
  id: number;
  name: string;
};

export type BlockSetup = {
  name: string;
  description: string;
  Component: Component;
};

export type Block = {
  name: string;
  description: string;
  Component: Component;
  setup?: BlockSetup;
};
