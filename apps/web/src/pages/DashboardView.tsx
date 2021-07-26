import type { Component } from "solid-js";
import {
  createSignal,
  lazy,
  createResource,
  onMount,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { For, Dynamic, Show, ErrorBoundary, Suspense } from "solid-js/web";
import { Link } from "solid-app-router";
import { ExclamationCicle, Loading, Plus } from "../icons";
import type { Dashboard, DashboardWithBlocks, RegisteredBlock } from "../types";
import { useRouter } from "solid-app-router";
import type { Store, SetStoreFunction } from "solid-js/store";
import { createRenderEffect } from "solid-js";
import createHotkey from "../hotkey";
import { addNotification, dismissNotification } from "@guillotin/solid";
import {
  UpdatingNotification,
  SuccessfullyUpdatedNotification,
  UnauthorizedUpdatedNotification,
} from "../notifications";
import { registeredBlocks } from "../registry";
import { useAuth0 } from "@rturnq/solid-auth0";
import FadeTransition from "../FadeTransition";
import Dropdown from "../Dropdown";

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
  const [router, { replace }] = useRouter();
  const { isAuthenticated, user, getToken } = useAuth0();

  const [dashboard, { mutate }] = createResource<DashboardWithBlocks>(
    async () => {
      // const token = await getToken();
      return fetch(
        `${import.meta.env.VITE_API_URL}/dashboards/${router.params.id}`
        // { headers: { Authorization: `Bearer ${token}` } }
      ).then((response) => response.json());
    }
  );

  const isOwner = () =>
    isAuthenticated() && user().sub === dashboard().owner_id;

  createEffect(() => {
    if (dashboard?.error?.status === 404) {
      replace("/404");
    }
  });

  const deleteBlock = async (block) => {
    const prevDashboard = dashboard();

    mutate(() => {
      return {
        ...dashboard(),
        blocks: dashboard().blocks.filter(({ id }) => id !== block.id),
      };
    });

    fetch(`${import.meta.env.VITE_API_URL}/blocks/${block.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    }).catch((e) => {
      mutate(prevDashboard);
    });
  };

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
              editable={isOwner()}
            />

            <Show when={isOwner()}>
              <Link href={`/dashboards/${dashboard().id}/add`} class="button">
                <Plus class="w-5 h-5" />
                <span>Add Block</span>
              </Link>
            </Show>
          </div>

          <ul class="grid grid-cols-3 gap-4 py-6">
            <For each={dashboard().blocks}>
              {(block) => {
                const [hovered, setHovered] = createSignal(false);
                const [open, setOpen] = createSignal(false);
                const focused = () => hovered() || open();
                const [period, setPeriod] = createSignal(30);

                const registeredBlock: () => RegisteredBlock = () => {
                  return registeredBlocks.find(
                    ({ type }) => type === block.type
                  );
                };

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
                      <FadeTransition>
                        <Show when={registeredBlock().trendable && focused()}>
                          <div class="absolute top-0 right-0 px-3 py-2">
                            <select
                              name="period"
                              class="bg-gray-600 text-gray-400 cursor-pointer"
                              onFocusIn={() => setOpen(true)}
                              onFocusOut={() => setOpen(false)}
                              value={period()}
                              onChange={(e) => setPeriod(e.target.value)}
                            >
                              <option value={1}>Last 24h</option>
                              <option value={7}>Last 7 days</option>
                              <option value={30}>Last 30 days</option>
                              {/* <option value={365}>This year</option> */}
                              <option value={Infinity}>All time</option>
                            </select>
                          </div>
                        </Show>
                      </FadeTransition>

                      <FadeTransition>
                        <Show when={focused()}>
                          <div class="absolute bottom-0 right-0 px-5 py-3">
                            <Dropdown
                              items={[
                                {
                                  name: "Delete block",
                                  onClick: () => deleteBlock(block),
                                },
                              ]}
                              trigger={(props) => {
                                return (
                                  <button
                                    onClick={props.onClick}
                                    type="button"
                                    class="rounded-full hover:bg-gray-600 p-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                      />
                                    </svg>
                                  </button>
                                );
                              }}
                            />
                          </div>
                        </Show>
                      </FadeTransition>

                      <Suspense>
                        <Dynamic<{
                          settings: any;
                          period: number;
                        }>
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

const EditableTitle: Component<{
  dashboard: Dashboard;
  onUpdate: (data: Partial<Dashboard>) => void;
  editable?: boolean;
}> = (props) => {
  const [edit, setEdit] = createSignal(false);
  const [formData, setFormData] = createStore({ name: props.dashboard.name });
  const { getToken } = useAuth0();

  const update = async () => {
    const token = await getToken();
    const notification = addNotification(UpdatingNotification, {});

    let afterNotification;
    return fetch(
      `${import.meta.env.VITE_API_URL}/dashboards/${props.dashboard.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(async (updatedDashboard) => {
        props.onUpdate(updatedDashboard);

        afterNotification = SuccessfullyUpdatedNotification;
      })
      .catch((e) => {
        afterNotification = UnauthorizedUpdatedNotification;
      })
      .finally(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        dismissNotification(notification);

        if (afterNotification) {
          addNotification(afterNotification);
        }
      });
  };

  return (
    <>
      <Show when={!edit()}>
        <h1
          classList={{ "cursor-pointer": props.editable }}
          onClick={() => props.editable && setEdit(true)}
        >
          <span
            class="px-1 py-0.5"
            classList={{ "hover:bg-gray-700 rounded-lg": props.editable }}
          >
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

          // FIXME: this is not working
          createHotkey("enter", submit);
          createHotkey("escape", cancel);

          onMount(() => {
            input.focus();
            input.select();
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
