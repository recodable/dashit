import type { Component } from "solid-js";
import { ChevronRight, Plus } from "../icons";
import { createResource } from "solid-js";
import { For } from "solid-js/web";
import { Link } from "solid-app-router";
import type { Dashboard } from "../types";
import { TransitionGroup } from "solid-transition-group";

const Index: Component = () => {
  const [dashboards, { mutate }] = createResource<Dashboard[]>(() => {
    return fetch(`${import.meta.env.VITE_API_URL}/dashboards`).then(
      (response) => response.json()
    );
  });

  const createNewDashboard = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/dashboards`, {
      method: "POST",
      body: JSON.stringify({}),
    }).then((response) => response.json());
  };

  return (
    <div class="p-16 flex flex-col items-center mx-auto" style="width: 768px;">
      <div class="flex justify-between items-baseline w-full">
        <h1>Your Dashboards</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const newDashboad = await createNewDashboard();
            mutate([newDashboad, ...dashboards()]);
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
        >
          <For each={dashboards()}>
            {(dashboard) => {
              return (
                <li class="card">
                  <Link
                    href={`/${dashboard.id}`}
                    class="flex justify-between px-8 py-10"
                  >
                    <h2>{dashboard.name}</h2>

                    <ChevronRight class="w-8 h-8" />
                  </Link>
                </li>
              );
            }}
          </For>
        </TransitionGroup>
      </ul>
    </div>
  );
};

export default Index;
