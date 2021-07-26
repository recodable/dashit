import { Transition } from "solid-transition-group";
import type { Component } from "solid-js";

const FadeTransition: Component = (props) => {
  return (
    <Transition
      enterActiveClass="transition ease-in-out duration-150"
      enterClass="opacity-0"
      enterToClass="opacity-100"
      exitActiveClass="transition ease-in-out duration-150"
      exitClass="opacity-100"
      exitToClass="opacity-0"
    >
      {props.children}
    </Transition>
  );
};

export default FadeTransition;
