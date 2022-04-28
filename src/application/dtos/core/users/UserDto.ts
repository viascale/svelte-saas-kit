import type { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import type { UserType } from "@/application/enums/core/users/UserType";
import type { WorkspaceUserDto } from "../../core/workspaces/WorkspaceUserDto";
import type { MasterEntityDto } from "../MasterEntityDto";
import type { TenantDto } from "../tenants/TenantDto";
import type { TenantUserDto } from "../tenants/TenantUserDto";

export interface UserDto extends MasterEntityDto {
  email: string;
  type: UserType;
  firstName: string;
  lastName: string;
  phone: string;
  loginType: UserLoginType;
  avatar: string;
  token: string;
  defaultTenantId: number | null;
  defaultTenant: TenantDto;
  tenants: TenantUserDto[];
  currentTenant: TenantDto;
  timezone: string;
  locale: string;
  workspaces?: WorkspaceUserDto[];
}
