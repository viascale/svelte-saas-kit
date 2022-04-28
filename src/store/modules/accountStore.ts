import type { UserDto } from "@/application/dtos/core/users/UserDto";
import { writable } from "svelte/store";
import type { AccountState } from "../types";

export const state: AccountState = {
  user: null,
};
const initialState: AccountState = JSON.parse(localStorage.getItem("account") ?? "{}") ?? {
  user: null,
};

export const accountState = writable(initialState);

export const accountStore = {
  resetAccountState: () =>
    accountState.update((self) => {
      self.user = null;
      return self;
    }),
  setLogged: (payload: UserDto) =>
    accountState.update((self) => {
      self.user = payload;
      return self;
    }),
  setAvatar: (payload: string) =>
    accountState.update((self) => {
      if (self.user) {
        self.user.avatar = payload;
      }
      return self;
    }),
};

accountState.subscribe((val) => {
  localStorage.setItem("account", JSON.stringify(val));
});
