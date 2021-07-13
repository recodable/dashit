import hotkeys from "hotkeys-js";
import { onCleanup } from "solid-js";

const createHotkey = (key: string, handler) => {
  hotkeys(key, (e) => {
    e.preventDefault();
    handler();
  });

  onCleanup(() => {
    hotkeys.unbind(key);
  });
};

export default createHotkey;
