import type { Component } from "solid-js";
import { Switch, Match, For, Show } from "solid-js/web";
import { Loading } from "./icons";

export const SimpleMetricBlock: Component<{
  loading: boolean;
  title: string;
  value: () => number;
  uow: string;
  refetch: () => void;
  badges?: string[];
  trend?: {
    value: () => number;
    uow: string;
  };
}> = (props) => {
  return (
    <Switch>
      <Match when={props.loading}>
        <div class="flex justify-center items-center w-full h-full">
          <Loading class="w-8 h-8" />
        </div>
      </Match>

      <Match when={!props.loading}>
        <div onClick={props.refetch}>
          <div class="flex gap-4 items-baseline mb-3">
            <h3 class="text-2xl font-thin text-gray-400">{props.title}</h3>

            <ul class="flex gap-1">
              <For each={props.badges || []}>
                {(badge) => (
                  <li class="px-1 text-xs font-mono bg-blue-800 text-blue-400 rounded">
                    {badge}
                  </li>
                )}
              </For>
            </ul>
          </div>

          <div
            class="flex gap-2"
            classList={{
              "items-center": !!props.trend,
              "items-baseline": !props.trend,
            }}
          >
            <span>
              <span class="text-4xl">{Math.round(props.value())}</span>
              {/* <span class="text-2xl ml-0.5">k</span> */}
            </span>

            <div>
              <Show when={props.trend}>
                <div class="flex items-baseline gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>

                  <span class="text-green-500 text-sm font-mono">
                    <span>{props.trend.value()}</span>
                    <span>{props.trend.uow}</span>
                  </span>
                </div>
              </Show>

              <span class="font-mono">{props.uow}</span>
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
};
