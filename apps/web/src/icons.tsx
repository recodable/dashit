import type { Component } from "solid-js";
import { mergeProps } from "solid-js";

type Stylable = { class?: string };

function overrideClass(className: string) {
  return {
    classList: {
      "w-5": !className.match(/\bw-[a-zA-Z0-9]+\b/),
      "h-5": !className.match(/\bh-[a-zA-Z0-9]+\b/),
      [className]: true,
    },
  };
}

export const Loading: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(
        [props.class, "animate-spin text-white"].filter((v) => v).join(" ")
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const Search: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};

export const ChevronLeft: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export const ChevronRight: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
};

export const Plus: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};

export const PlusCircle: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export const Minus: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
        d="M20 12H4"
      />
    </svg>
  );
};

export const ArrowLeft: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
};

export const ExclamationCicle: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const UpTrend: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
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
  );
};

export const DownTrend: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    </svg>
  );
};

export const Infinite: Component<Stylable> = (props) => {
  props = mergeProps({ class: "" }, props);

  return (
    <svg
      {...overrideClass(props.class)}
      aria-hidden="true"
      data-prefix="fas"
      data-icon="infinity"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
    >
      <path
        fill="currentColor"
        d="M471.1 96C405 96 353.3 137.3 320 174.6 286.7 137.3 235 96 168.9 96 75.8 96 0 167.8 0 256s75.8 160 168.9 160c66.1 0 117.8-41.3 151.1-78.6 33.3 37.3 85 78.6 151.1 78.6 93.1 0 168.9-71.8 168.9-160S564.2 96 471.1 96zM168.9 320c-40.2 0-72.9-28.7-72.9-64s32.7-64 72.9-64c38.2 0 73.4 36.1 94 64-20.4 27.6-55.9 64-94 64zm302.2 0c-38.2 0-73.4-36.1-94-64 20.4-27.6 55.9-64 94-64 40.2 0 72.9 28.7 72.9 64s-32.7 64-72.9 64z"
      ></path>
    </svg>
  );
};

export const VerticalDots = (props) => {
  return (
    <svg
      {...overrideClass(props.class)}
      xmlns="http://www.w3.org/2000/svg"
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
  );
};
