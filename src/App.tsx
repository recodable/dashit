import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { For, Dynamic, Show, ErrorBoundary } from "solid-js/web";
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
                  <ErrorBoundary
                    fallback={(error, reset) => {
                      return (
                        <div
                          onClick={reset}
                          class="w-full h-full flex justify-center items-center gap-2 text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                          <p class="">Couldn't load the data, click to retry</p>
                        </div>
                      );
                    }}
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
                  </ErrorBoundary>
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
