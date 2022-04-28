import { ApiService } from "@/services/api/ApiService";
import type { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import type { IAuthenticationService } from "./IAuthenticationService";
import { authStore } from "@/store/modules/authStore";

export class AuthenticationService extends ApiService implements IAuthenticationService {
  constructor() {
    super("Authentication");
  }
  login(payload: UserLoginRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Login")
        .then((response: UserLoggedResponse) => {
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  impersonate(userId: string): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, `Admin/Impersonate/${userId}`)
        .then((response: UserLoggedResponse) => {
          authStore.logout();
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  register(payload: UserRegisterRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Register")
        .then((response: UserLoggedResponse) => {
          if (response && response.user) {
            authStore.login(response);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  verify(payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Verify")
        .then((response: UserLoggedResponse) => {
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  reset(email: string): Promise<any> {
    return super.post(null, "Reset/" + email);
  }
}
