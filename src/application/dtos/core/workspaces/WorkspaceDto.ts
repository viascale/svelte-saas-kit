import type { AppEntityDto } from "../AppEntityDto";
import type { WorkspaceUserDto } from "./WorkspaceUserDto";
import type { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";

export interface WorkspaceDto extends AppEntityDto {
  name: string;
  type: WorkspaceType;
  businessMainActivity: string;
  registrationNumber: string;
  registrationDate?: Date | null;
  default?: boolean;
  users: WorkspaceUserDto[];
}
