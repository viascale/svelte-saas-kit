import { ApiService } from "@/services/api/ApiService";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import type { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import type { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import type { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import type { IUserService } from "./IUserService";
import { authStore } from "@/store/modules/authStore";
import { accountState, accountStore } from "@/store/modules/accountStore";
import { get } from "svelte/store";

export class UserService extends ApiService implements IUserService {
  constructor() {
    super("User");
  }
  adminGetAll(): Promise<UserDto[]> {
    return super.getAll("Admin/GetAll");
  }
  get(id: string): Promise<UserDto> {
    return super.get("Get", id);
  }
  updateAvatar(avatar: UserUpdateAvatarRequest): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      super
        .post(avatar, "UpdateAvatar")
        .then((response: UserDto) => {
          accountStore.setLogged(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any> {
    return super.post(payload, `UpdateLocale`);
  }
  update(id: string, payload: UserUpdateRequest): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      super
        .put(id, payload)
        .then((response: UserDto) => {
          accountStore.setLogged(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updatePassword(payload: UserUpdatePasswordRequest): Promise<any> {
    return super.post(payload, "UpdatePassword");
  }
  adminUpdatePassword(userId: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super
        .post(null, `Admin/UpdatePassword/${userId}/${password}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateDefaultTenant(tenantId?: string): Promise<UserLoggedResponse> {
    let userId = get(accountState).user.id;

    return new Promise((resolve, reject) => {
      super
        .post(null, `UpdateDefaultTenant/${userId}/${tenantId}`)
        .then((response: UserLoggedResponse) => {
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  deleteMe(): Promise<void> {
    return new Promise((resolve, reject) => {
      super
        .delete("", "DeleteMe")
        .then((response) => {
          authStore.logout();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  adminDelete(id: string): Promise<void> {
    return super.delete(id, "Admin/Delete");
  }
}
