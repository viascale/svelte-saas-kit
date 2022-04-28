import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import type { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";

export interface IAuthenticationService {
  login(payload: UserLoginRequest): Promise<UserLoggedResponse>;
  impersonate(userId: string): Promise<UserLoggedResponse>;
  register(payload: UserRegisterRequest): Promise<UserLoggedResponse>;
  verify(payload: UserVerifyRequest): Promise<UserLoggedResponse>;
  reset(email: string): Promise<any>;
}
