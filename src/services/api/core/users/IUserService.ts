import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import type { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import type { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import type { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import type { UserDto } from "@/application/dtos/core/users/UserDto";

export interface IUserService {
  adminGetAll(): Promise<UserDto[]>;
  updateAvatar(avatar: UserUpdateAvatarRequest): Promise<UserDto>;
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any>;
  update(id: string, payload: UserUpdateRequest): Promise<UserDto>;
  updatePassword(payload: UserUpdatePasswordRequest): Promise<any>;
  adminUpdatePassword(userId: string, password: string): Promise<any>;
  updateDefaultTenant(tenantId?: string): Promise<UserLoggedResponse>;
  deleteMe(): Promise<void>;
  adminDelete(id: string): Promise<void>;
}
