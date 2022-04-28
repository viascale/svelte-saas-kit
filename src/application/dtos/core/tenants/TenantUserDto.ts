import type { TenantUserJoined } from "@/application/enums/core/tenants/TenantUserJoined";
import type { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import type { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import type { MasterEntityDto } from "../MasterEntityDto";
import type { UserDto } from "../users/UserDto";
import type { TenantDto } from "./TenantDto";

export interface TenantUserDto extends MasterEntityDto {
  tenantId: string;
  tenant: TenantDto;
  userId: string;
  user: UserDto;
  role: TenantUserRole;
  joined: TenantUserJoined;
  status: TenantUserStatus;
  chatbotToken?: string;
  uuid: string;
  accepted: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
}
