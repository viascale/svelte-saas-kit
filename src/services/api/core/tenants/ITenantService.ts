import type { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import type { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import type { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import type { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import type { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";

export interface ITenantService {
  adminGetAll(): Promise<TenantDto[]>;
  adminGetProducts(id: string): Promise<TenantProductDto[]>;
  getAll(): Promise<TenantDto[]>;
  get(id: string): Promise<TenantDto>;
  getFeatures(): Promise<TenantFeaturesDto>;
  getCurrentUsage(type: AppUsageType): Promise<AppUsageSummaryDto>;
  create(payload: TenantCreateRequest): Promise<UserLoggedResponse>;
  update(payload: TenantDto): Promise<TenantDto>;
  updateImage(payload: TenantUpdateImageRequest): Promise<TenantDto>;
  adminDelete(id: string): Promise<void>;
}
