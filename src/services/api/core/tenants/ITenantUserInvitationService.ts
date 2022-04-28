import type { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import type { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import type { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";

export interface ITenantUserInvitationService {
  getInvitation(tenantUserId: string): Promise<TenantInvitationResponse>;
  getInviteURL(linkUuid: string): Promise<TenantDto>;
  getInvitationSettings(tenantId?: string): Promise<TenantJoinSettingsDto>;
  inviteUser(invitation: UserInviteRequest): Promise<TenantUserDto>;
  requestAccess(linkUuid: string, payload: UserVerifyRequest): Promise<TenantUserDto>;
  acceptUser(payload: TenantUserDto): Promise<void>;
  acceptInvitation(tenantUserId: string, payload: UserVerifyRequest): Promise<UserLoggedResponse>;
  updateInvitationSettings(payload: TenantUpdateJoinSettingsRequest): Promise<TenantJoinSettingsDto>;
}
