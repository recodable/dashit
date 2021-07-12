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
      {...overrideClass([props.class, "animate-spin text-white"].join(" "))}
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
