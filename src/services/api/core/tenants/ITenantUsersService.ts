import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { TenantUserUpdateRequest } from "@/application/contracts/core/tenants/TenantUserUpdateRequest";

export interface ITenantUsersService {
  getAll(): Promise<TenantUserDto[]>;
  get(tenantUserId: string): Promise<TenantUserDto>;
  update(tenantUserId: string, payload: TenantUserUpdateRequest): Promise<TenantUserDto>;
  delete(tenantUserId: string): Promise<any>;
}
