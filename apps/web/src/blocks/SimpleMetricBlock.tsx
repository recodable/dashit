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
          <Show when={isFinite(props.value)}>
            <span>{`${props.value}`.replace(/^-/, "")}</span>
            <span>{props.uow}</span>
          </Show>

          <Show when={!isFinite(props.value)}>
            <span>
              <svg
                aria-hidden="true"
                data-prefix="fas"
                data-icon="infinity"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                class="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  d="M471.1 96C405 96 353.3 137.3 320 174.6 286.7 137.3 235 96 168.9 96 75.8 96 0 167.8 0 256s75.8 160 168.9 160c66.1 0 117.8-41.3 151.1-78.6 33.3 37.3 85 78.6 151.1 78.6 93.1 0 168.9-71.8 168.9-160S564.2 96 471.1 96zM168.9 320c-40.2 0-72.9-28.7-72.9-64s32.7-64 72.9-64c38.2 0 73.4 36.1 94 64-20.4 27.6-55.9 64-94 64zm302.2 0c-38.2 0-73.4-36.1-94-64 20.4-27.6 55.9-64 94-64 40.2 0 72.9 28.7 72.9 64s-32.7 64-72.9 64z"
                  class=""
                ></path>
              </svg>
            </span>
          </Show>
        </span>
      </Show>
    </div>
  );
};
