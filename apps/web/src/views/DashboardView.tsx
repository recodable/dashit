import type { Component } from "solid-js";
import { createSignal, lazy, createResource } from "solid-js";
import { For, Dynamic, Show, ErrorBoundary, Suspense } from "solid-js/web";
import { NPMDownloadBlock } from "../npm";
import { Transition } from "solid-transition-group";
import { Link } from "solid-app-router";
import { ExclamationCicle, Loading, Plus } from "../icons";
import type { Dashboard } from "../types";
import { useRouter } from "solid-app-router";

const DashboardView: Component = () => {
  const [blocks, setBlocks] = createSignal([
    lazy(() => import("../github/StarBlock")),
    lazy(() => import("../github/OpenIssueBlock")),
    lazy(() => import("../github/OpenPullRequestBlock")),
    NPMDownloadBlock,
  ]);

  const [router] = useRouter();

  const [dashboard] = createResource<Dashboard>(() => {
    return fetch(
      `${import.meta.env.VITE_API_URL}/dashboards/${router.params.id}`
    ).then((response) => response.json());
  });

  console.log(dashboard());

  return (
    <>
      <Show when={dashboard.loading}>
        <div class="p-16 w-screen h-screen flex justify-center items-center">
          <Loading class="w-10 h-10" />
        </div>
      </Show>

      <Show when={!dashboard.loading}>
        <div class="p-16">
          <div class="flex justify-between w-full px-2">
            <h1 class="capitalize">{dashboard().name}</h1>

            <Link href="/add" class="button">
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
                            <p class="">
                              Couldn't load the data, click to retry
                            </p>
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
      </Show>
    </>
  );
};

export default DashboardView;
