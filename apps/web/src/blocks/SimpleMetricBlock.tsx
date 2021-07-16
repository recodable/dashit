import type { Component } from "solid-js";
import { Switch, Match, For, Show } from "solid-js/web";
import { Loading, UpTrend, DownTrend } from "../icons";

const SimpleMetricBlock: Component<{
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
                <Trend value={props.trend.value()} uow={props.trend.uow} />
              </Show>

              <span class="font-mono">{props.uow}</span>
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default SimpleMetricBlock;

const Trend: Component<{ value: number; uow: string }> = (props) => {
  return (
    <div class="flex items-baseline gap-1">
      <Switch
        fallback={() => (
          <span class="text-xl text-yellow-500 leading-none">=</span>
        )}
      >
        <Match when={props.value > 0}>
          <UpTrend class="h-3 w-3 text-green-500" />
        </Match>

        <Match when={props.value < 0}>
          <DownTrend class="h-3 w-3 text-red-500" />
        </Match>
      </Switch>

      <Show when={props.value !== 0}>
        <span
          class=" text-sm font-mono"
          classList={{
            "text-green-500": props.value > 0,
            "text-red-500": props.value < 0,
          }}
        >
          <span>{`${props.value}`.replace(/^-/, "")}</span>
          <span>{props.uow}</span>
        </span>
      </Show>
    </div>
  );
};
