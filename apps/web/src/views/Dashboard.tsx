import type { Component } from "solid-js";
import { createSignal, lazy } from "solid-js";
import { For, Dynamic, Show, ErrorBoundary, Suspense } from "solid-js/web";
import { NPMDownloadBlock } from "../npm";
import { Transition } from "solid-transition-group";
import { Link } from "solid-app-router";
import { ExclamationCicle, Plus } from "../icons";

const Dashboard: Component = () => {
  const [blocks, setBlocks] = createSignal([
    lazy(() => import("../github/StarBlock")),
    lazy(() => import("../github/OpenIssueBlock")),
    lazy(() => import("../github/OpenPullRequestBlock")),
    NPMDownloadBlock,
  ]);

  return (
    <div class="p-16">
      <div class="flex justify-between w-full px-2">
        <h1 class="text-4xl font-extrabold">Recodable Dashboard</h1>

        <Link
          href="/add"
          class="flex items-center gap-3 bg-gray-600 rounded-lg hover:bg-gray-700 px-8 py-4 hover:text-gray-200 text-xl"
        >
          <Plus class="w-5 h-5" />
          <span>Add Block</span>
        </Link>
      </div>

      <ul class="grid grid-cols-3 gap-4 py-6">
        <For each={blocks()}>
          {(Block) => {
            const [hovered, setHovered] = createSignal(false);
            const [open, setOpen] = createSignal(false);
            const focused = () => hovered() || open();

            return (
              <li
                class="small-card"
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
                        <ExclamationCicle class="h-6 w-6" />
                        <p class="">Couldn't load the data, click to retry</p>
                      </div>
                    );
                  }}
                >
                  <Transition
                    enterActiveClass="transition ease-in-out duration-150"
                    enterClass="opacity-0"
                    enterToClass="opacity-100"
                    exitActiveClass="transition ease-in-out duration-150"
                    exitClass="opacity-100"
                    exitToClass="opacity-0"
                  >
                    <Show when={focused()}>
                      <div class="absolute top-0 right-0 px-3 py-2">
                        <select
                          name="period"
                          class="bg-gray-600 text-gray-400 cursor-pointer"
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
                  </Transition>

                  <Suspense>
                    <Dynamic component={Block} />
                  </Suspense>
                </ErrorBoundary>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};

export default Dashboard;
