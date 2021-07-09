import { createEffect } from "solid-js";

export const createDebug = (value) => {
  createEffect(() => console.log(value));
};
