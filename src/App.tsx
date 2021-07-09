import type { Component } from "solid-js";
import { createSignal, createComputed } from "solid-js";
import { For, Dynamic, Show } from "solid-js/web";
import {
  ModalOutlet,
  ModalBackground as BaseModalBackground,
} from "@guillotin/solid";
import {
  GithubStarBlock,
  GithubOpenIssueBlock,
  GithubOpenPullRequestBlock,
} from "./github";
import { NPMDownloadBlock } from "./npm";
import { createDebug } from "./utils";

const App: Component = () => {
  const [blocks, setBlocks] = createSignal([
    GithubStarBlock,
    GithubOpenIssueBlock,
    GithubOpenPullRequestBlock,
    NPMDownloadBlock,
    // GithubStarBlock,
  ]);

  return (
    <>
      <ModalOutlet
        Background={(props) => (
          <BaseModalBackground
            backgroundColor="rgba(75, 85, 99, 1);"
            opacity={0.6}
            {...props}
          />
        )}
      />

      <main class="bg-gray-900 min-h-screen min-w-screen p-8 text-white">
        <h1 class="text-4xl font-bold">Recodable Dashboard</h1>

        <ul class="grid grid-cols-3 gap-4 py-6">
          <For each={blocks()}>
            {(Block) => {
              const [hovered, setHovered] = createSignal(false);
              const [open, setOpen] = createSignal(false);
              const focused = () => hovered() || open();

              return (
                <li
                  class="relative h-24 p-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700 cursor-pointer shadow"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Show when={focused()}>
                    <div class="absolute top-0 right-0 px-3 py-2">
                      <select
                        name="period"
                        class="bg-gray-600 text-gray-400"
                        onFocusIn={() => setOpen(true)}
                        onFocusOut={() => setOpen(false)}
                      >
                        <option value="">All time</option>
                        <option value="today">Today</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                        <option value="year">This year</option>
                      </select>
                    </div>
                  </Show>

                  <Dynamic component={Block} />
                </li>
              );
            }}
          </For>
        </ul>

        <div class="py-10">
          <button
            type="button"
            class="bg-gray-800 w-full rounded-lg hover:bg-gray-700 py-4"
          >
            <span class="text-xl">+ Create new block</span>
          </button>
        </div>
      </main>
    </>
  );
};

export default App;

const ExampleModal = () => {
  return <div>My custom modal</div>;
};
