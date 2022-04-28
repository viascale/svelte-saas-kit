import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { writable } from "svelte/store";
import type { AuthState } from "../types";

// export const state: AuthState = {
//   authenticated: false,
//   token: "",
// };
const initialState: AuthState = JSON.parse(localStorage.getItem("auth") ?? "{}") ?? {
  authenticated: false,
  token: "",
};

export const authState = writable(initialState);

export const authStore = {
  setAuthenticated: (value: boolean) =>
    authState.update((self) => {
      self.authenticated = value;
      return self;
    }),
  login: (payload: UserLoggedResponse) =>
    authState.update((self) => {
      self.authenticated = true;
      self.token = payload.token;

      try {
        // Google Analytics

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.analytics) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.analytics.identify(payload.user.username, {
            email: payload.user.email,
            firstName: payload.user.firstName,
            lastName: payload.user.lastName,
            tenant: payload.user.currentTenant,
          });
        }
        // if (mixpanel) {
        //   try {
        //     mixpanel.identify(payload.user.id);
        //     if (mixpanel.people) {
        //       mixpanel.people.set({
        //         USER_ID: payload.user.id,
        //         $email: payload.user.email,
        //         "First name": payload.user.firstName,
        //         "Last name": payload.user.lastName,
        //       });
        //     }
        //     mixpanel.track("Login");
        //   } catch (ex) {
        //     // ignore
        //   }
        // }
        // if (LogRocket) {
        //   LogRocket.identify(payload.user.email, {
        //     username: payload.user.username,
        //     firstName: payload.user.firstName,
        //     lastName: payload.user.lastName,
        //     email: payload.user.email,
        //     subscriptionCustomerId:
        //       payload.user.currentTenant?.subscriptionCustomerId ?? "",
        //     subscriptionPlanId:
        //       payload.user.currentTenant?.subscriptionPlanId ?? "",
        //   });
        // }
      } catch (ex) {
        // ignore
      }
      return self;
    }),
  logout: () => {
    authState.update((self) => {
      self.authenticated = false;
      self.token = "";
      return self;
    });
  },
};

authState.subscribe((val) => {
  localStorage.setItem("auth", JSON.stringify(val));
});
