import { ApiService } from "@/services/api/ApiService";
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { TenantUserUpdateRequest } from "@/application/contracts/core/tenants/TenantUserUpdateRequest";
import type { ITenantUsersService } from "./ITenantUsersService";
import { tenantStore } from "@/store/modules/tenantStore";

export class TenantUsersService extends ApiService implements ITenantUsersService {
  constructor() {
    super("TenantUsers");
  }
  getAll(): Promise<TenantUserDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll("GetAll")
        .then((response: TenantUserDto[]) => {
          tenantStore.setMembers(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get(tenantUserId: string): Promise<TenantUserDto> {
    return super.get("Get", `${tenantUserId}`);
  }
  update(tenantUserId: string, payload: TenantUserUpdateRequest): Promise<TenantUserDto> {
    return super.put(`${tenantUserId}`, payload);
  }
  delete(tenantUserId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super
        .delete(tenantUserId)
        .then((response) => {
          this.getAll();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
