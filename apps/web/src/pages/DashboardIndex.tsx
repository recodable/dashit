import type { Component } from "solid-js";
import { ChevronRight, Plus } from "../icons";
import { createEffect, createResource, createMemo } from "solid-js";
import { Show, For } from "solid-js/web";
import { Link } from "solid-app-router";
import type { Dashboard } from "../types";
import { TransitionGroup } from "solid-transition-group";
import { useRouter } from "solid-app-router";
import { useAuth0 } from "@rturnq/solid-auth0";

const DashboardIndex: Component = () => {
  const { getToken } = useAuth0();

  const [dashboards, { mutate, refetch }] = createResource<Dashboard[]>(
    async () => {
      const token = await getToken();

      return fetch(`${import.meta.env.VITE_API_URL}/dashboards`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
    }
  );

  const [, { push }] = useRouter();

  const createNewDashboard = async () => {
    const token = await getToken();
    return fetch(`${import.meta.env.VITE_API_URL}/dashboards`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  return (
    <div class="p-16 flex flex-col items-center mx-auto" style="width: 768px;">
      <div class="flex justify-between items-baseline w-full">
        <h1>Your Dashboards</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const newDashboard = await createNewDashboard();
            mutate([newDashboard, ...dashboards()]);
            push(`/dashboards/${newDashboard.id}`);
          }}
        >
          <button type="submit" class="button">
            <Plus />
            <span>New Dashboard</span>
          </button>
        </form>
      </div>

      <ul class="flex flex-col justify-center gap-8 my-8 w-full">
        <TransitionGroup
          enterActiveClass="transition-all ease-in-out duration-400"
          enterClass="opacity-0"
          enterToClass="opacity-100"
          exitActiveClass="transition-all ease-in-out duration-400"
          exitClass="opacity-100"
          exitToClass="opacity-0"
        >
          <For each={dashboards()}>
            {(dashboard) => {
              return (
                <li class="relative card">
                  <Link
                    href={`/dashboards/${dashboard.id}`}
                    class="flex justify-between px-8 py-10"
                  >
                    <h2 class="truncate">{dashboard.name}</h2>

                    <ChevronRight class="flex-shrink-0 w-8 h-8" />
                  </Link>

                  <div class="absolute right-0 -mr-16 inset-y-0 flex items-center justify-center">
                    <div class="px-3">
                      <button
                        type="button"
                        class="text-red-500 opacity-50 hover:opacity-100 hover:bg-gray-800 rounded-lg p-2"
                        onClick={async () => {
                          const result = window.confirm(
                            `You are about to delete "${dashboard.name}", are you sure?`
                          );

                          if (result) {
                            const token = await getToken();

                            await fetch(
                              `${import.meta.env.VITE_API_URL}/dashboards/${
                                dashboard.id
                              }`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                              }
                            );

                            mutate((dashboards) => {
                              return dashboards.filter(
                                ({ id }) => dashboard.id !== id
                              );
                            });
                          }
                        }}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              );
            }}
          </For>
        </TransitionGroup>
      </ul>
    </div>
  );
};

export default DashboardIndex;
