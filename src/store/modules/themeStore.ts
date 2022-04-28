import { writable } from "svelte/store";
import { Theme } from "../../application/enums/shared/Theme";
import type { ThemeState } from "../types";

let theme = { value: Theme.LIGHT };
try {
  let local: any = localStorage.getItem("theme");
  if (Number(local) === 0 || Number(local) === 1) {
    local = {
      value: Number(local),
    };
  }
  theme = JSON.parse(local ?? "{}") ?? {
    value: Theme.LIGHT,
  };
} catch {}
const initialState: ThemeState = theme;

export const themeState = writable(initialState);

export const themeStore = {
  setTheme: (value: Theme) => {
    themeState.update((self) => {
      self.value = value;
      return self;
    });
  },
};

themeState.subscribe((val) => {
  localStorage.setItem("theme", JSON.stringify(val));
});
