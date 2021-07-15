import type { Component } from "solid-js";
import { createSignal, lazy, createResource, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { For, Dynamic, Show, ErrorBoundary, Suspense } from "solid-js/web";
import { Transition } from "solid-transition-group";
import { Link } from "solid-app-router";
import { ExclamationCicle, Loading, Plus } from "../icons";
import type { Dashboard, DashboardWithBlocks } from "../types";
import { useRouter } from "solid-app-router";
import type { Store, SetStoreFunction } from "solid-js/store";
import { createRenderEffect } from "solid-js";
import createHotkey from "../hotkey";
import { addNotification, dismissNotification } from "@guillotin/solid";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [any, (v: any) => any];
    }
  }
}

export type Model<T> = [Store<Partial<T>>, SetStoreFunction<Partial<T>>];

export function model<T>(el, value: () => Model<T>) {
  const [formData, setFormData] = value();
  createRenderEffect(() => (el.value = formData[el.name]));
  el.addEventListener("input", (e) =>
    setFormData({ [e.target.name]: e.target.value })
  );
}

const DashboardView: Component = () => {
  // const test = "github/StarBlock";
  // const [blocks, setBlocks] = createSignal([
  //   lazy(() => import(`../${test}.tsx`)),
  //   // lazy(() => import("../github/OpenIssueBlock")),
  //   // lazy(() => import("../github/OpenPullRequestBlock")),
  // ]);

  const [router] = useRouter();

  const [dashboard, { mutate }] = createResource<DashboardWithBlocks>(() => {
    return fetch(
      `${import.meta.env.VITE_API_URL}/dashboards/${router.params.id}`
    ).then((response) => response.json());
  });

  return (
    <>
      <Show when={dashboard.loading}>
        <div class="p-16 w-screen h-screen flex justify-center items-center">
          <Loading class="w-10 h-10" />
        </div>
      </Show>

      <Show when={!dashboard.loading}>
        <div class="p-16">
          <div class="flex items-baseline justify-between w-full px-2">
            <EditableTitle
              dashboard={dashboard()}
              onUpdate={({ name }) => mutate({ ...dashboard(), name })}
            />

            <Link href={`/${dashboard().id}/add`} class="button">
              <Plus class="w-5 h-5" />
              <span>Add Block</span>
            </Link>
          </div>

          <ul class="grid grid-cols-3 gap-4 py-6">
            <For each={dashboard().blocks}>
              {(block) => {
                const [hovered, setHovered] = createSignal(false);
                const [open, setOpen] = createSignal(false);
                const focused = () => hovered() || open();
                const [period, setPeriod] = createSignal(1);

                return (
                  <li
                    class="small-card"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <ErrorBoundary
                      fallback={(error, reset) => {
                        console.log(error);
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
                              <option value={1}>Today</option>
                              <option value={7}>This week</option>
                              <option value={31}>This month</option>
                              <option value={365}>This year</option>
                              <option value={Infinity}>All time</option>
                            </select>
                          </div>
                        </Show>
                      </Transition>

                      <Suspense>
                        <Dynamic<{ settings: any; period: number }>
                          component={lazy(() => import(`../${block.type}.tsx`))}
                          settings={block.settings}
                          period={period()}
                        />
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

const UpdatingNotification = () => {
  return (
    <div
      class="px-4 py-2 shadow-xl bg-gray-500 rounded-lg flex gap-2 items-center"
      style="width: 300px;"
    >
      <Loading class="w-4 h-4" />
      <span class="text-white">Updating...</span>
    </div>
  );
};

const SuccessfullyUpdatedNotification = () => {
  return (
    <div
      class="px-4 py-2 shadow-xl bg-green-500 rounded-lg flex gap-2 items-center"
      style="width: 300px;"
    >
      {/* <Loading class="w-4 h-4" /> */}
      <span class="text-white">Done</span>
    </div>
  );
};

const EditableTitle: Component<{
  dashboard: Dashboard;
  onUpdate: (data: Partial<Dashboard>) => void;
}> = (props) => {
  const [edit, setEdit] = createSignal(false);
  const [formData, setFormData] = createStore({ name: props.dashboard.name });

  const update = async () => {
    const notification = addNotification(UpdatingNotification, {});

    const updatedDashboard = await fetch(
      `${import.meta.env.VITE_API_URL}/dashboards/${props.dashboard.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
      }
    ).then((response) => response.json());

    props.onUpdate(updatedDashboard);

    await new Promise((resolve) => setTimeout(resolve, 500));
    dismissNotification(notification);
    addNotification(SuccessfullyUpdatedNotification);
  };

  return (
    <>
      <Show when={!edit()}>
        <h1 class="capitalize cursor-pointer" onClick={() => setEdit(true)}>
          <span class="hover:bg-gray-700 rounded-lg px-1 py-0.5">
            {props.dashboard.name}
          </span>
        </h1>
      </Show>

      <Show when={edit()}>
        {() => {
          let input;

          const submit = async () => {
            if (formData.name !== props.dashboard.name) {
              await update();
            }
            setEdit(false);
          };

          const cancel = () => {
            setFormData({ name: props.dashboard.name });
            setEdit(false);
          };

          createHotkey("enter", submit);
          createHotkey("escape", cancel);

          onMount(() => {
            input.focus();
          });

          return (
            <input
              ref={input}
              name="name"
              type="text"
              onFocusOut={submit}
              use:model={[formData, setFormData]}
              class="bg-gray-700 text-4xl font-extrabold px-1 py-0.5 rounded-lg"
            />
          );
        }}
      </Show>
    </>
  );
};
