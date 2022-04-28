import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { ApiService } from "@/services/api/ApiService";
import type { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import type { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import type { ITenantService } from "./ITenantService";
import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import type { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import type { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { tenantState, tenantStore } from "@/store/modules/tenantStore";
import { appStore } from "@/store/modules/appStore";
import { get } from "svelte/store";

export class TenantService extends ApiService implements ITenantService {
  constructor() {
    super("Tenant");
  }
  adminGetAll(): Promise<TenantDto[]> {
    return super.getAll("Admin/GetAll");
  }
  adminGetProducts(id: string): Promise<TenantProductDto[]> {
    return super.get("GetProducts", id);
  }
  getAll(): Promise<TenantDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll()
        .then((response: TenantDto[]) => {
          tenantStore.setMyTenants(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get(id: string): Promise<TenantDto> {
    return super.get("Get", id);
  }
  getFeatures(): Promise<TenantFeaturesDto> {
    return new Promise((resolve, reject) => {
      super
        .get("GetFeatures")
        .then((response: TenantFeaturesDto) => {
          appStore.setFeatures(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCurrentUsage(type: AppUsageType): Promise<AppUsageSummaryDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        super
          .get("GetCurrentUsage/" + type)
          .then((response) => {
            appStore.setUsage(response);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }, 2000);
    });
  }
  create(payload: TenantCreateRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload)
        .then((response: UserLoggedResponse) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  update(payload: TenantDto): Promise<TenantDto> {
    let tenantId = get(tenantState).current?.id ?? "";
    return new Promise((resolve, reject) => {
      super
        .put(tenantId, payload)
        .then((response: TenantDto) => {
          tenantStore.setSettings(payload);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateImage(payload: TenantUpdateImageRequest): Promise<TenantDto> {
    let tenantId = get(tenantState).current?.id ?? "";
    return super.put(tenantId, payload, "UpdateImage");
  }
  delete(): Promise<void> {
    let tenantId = get(tenantState).current?.id ?? "";
    return super.delete(tenantId);
  }
  adminDelete(id: string): Promise<void> {
    return super.delete(id, "Admin/Delete");
  }
}
