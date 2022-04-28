function useKeypress(callback: any, keyCode: any) {
  const escFunction = (event: any) => {
    if (event.keyCode === keyCode) {
      callback();
    }
  };
  document.addEventListener("keydown", escFunction, false);
}

export function useEscapeKeypress(callback: any) {
  useKeypress(callback, 27);
}

export function useEnterKeypress(callback: any) {
  useKeypress(callback, 13);
}

export function clickOutside(node: any) {
  const handleClick = (event: any) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
