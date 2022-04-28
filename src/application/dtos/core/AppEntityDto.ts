import type { EntityDto } from "../EntityDto";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { UserDto } from "@/application/dtos/core/users/UserDto";

export interface AppEntityDto extends EntityDto {
  createdByUserId?: string;
  createdByUser?: UserDto;
  modifiedByUserId?: string;
  modifiedByUser?: UserDto;
  tenantId?: string | undefined;
  tenant?: TenantDto | undefined;
}
