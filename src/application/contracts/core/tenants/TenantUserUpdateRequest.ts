import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";

export interface TenantUserUpdateRequest {
  role: TenantUserRole;
  phone: string;
  workspaces: WorkspaceDto[];
}
