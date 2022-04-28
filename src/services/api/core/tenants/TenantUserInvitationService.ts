import { ApiService } from "@/services/api/ApiService";
import type { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import type { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { AuthenticationService } from "@/services/api/core/users/AuthenticationService";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import type { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import type { ITenantUserInvitationService } from "./ITenantUserInvitationService";
import { tenantState } from "@/store/modules/tenantStore";
import { get } from "svelte/store";

export class TenantUserInvitationService extends ApiService implements ITenantUserInvitationService {
  constructor() {
    super("TenantUserInvitation");
  }

  getInvitation(tenantUserId: string): Promise<TenantInvitationResponse> {
    return super.get("GetInvitation", tenantUserId);
  }
  getInviteURL(linkUuid: string): Promise<TenantDto> {
    return super.get("GetInviteURL", linkUuid);
  }
  getInvitationSettings(tenantId = ""): Promise<TenantJoinSettingsDto> {
    if (!tenantId) {
      tenantId = get(tenantState).current?.id ?? "";
    }
    return super.get("GetInvitationSettings", tenantId);
  }
  inviteUser(invitation: UserInviteRequest): Promise<TenantUserDto> {
    return super.post(invitation, `InviteUser`);
  }
  requestAccess(linkUuid: string, payload: UserVerifyRequest): Promise<TenantUserDto> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, `RequestAccess/${linkUuid}`)
        .then((response: TenantUserDto) => {
          if (response.status === TenantUserStatus.ACTIVE) {
            const auth = new AuthenticationService();
            auth.login({
              email: payload.email,
              password: payload.password,
              loginType: payload.userLoginType,
            });
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  acceptUser(payload: TenantUserDto): Promise<void> {
    return super.post(payload, `AcceptUser/${payload.id}`);
  }
  acceptInvitation(tenantUserId: string, payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, `AcceptInvitation/${tenantUserId}`)
        .then((response: UserLoggedResponse) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateInvitationSettings(payload: TenantUpdateJoinSettingsRequest): Promise<TenantJoinSettingsDto> {
    return super.post(payload, `UpdateInvitationSettings`);
  }
}
