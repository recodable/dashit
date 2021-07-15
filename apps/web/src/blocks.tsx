import type { Component } from "solid-js";
import { Switch, Match, For } from "solid-js/web";
import { Loading } from "./icons";

export const SimpleMetricBlock: Component<{
  loading: boolean;
  title: string;
  value: () => number;
  uow: string;
  refetch: () => void;
  badges?: string[];
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
          <div class="flex gap-2 items-center mb-3">
            <h4 class="text-lg font-thin text-gray-400">{props.title}</h4>

            <ul>
              <For each={props.badges || []}>
                {(badge) => (
                  <li class="px-1 py-0.5 text-xs font-mono bg-blue-800 text-blue-400 rounded">
                    {badge}
                  </li>
                )}
              </For>
            </ul>
          </div>

          <div class="flex gap-2 items-baseline">
            <span>
              <span class="text-4xl">{Math.round(props.value())}</span>
              {/* <span class="text-2xl ml-0.5">k</span> */}
            </span>

            <span class="font-mono">{props.uow}</span>
          </div>
        </div>
      </Match>
    </Switch>
  );
};
