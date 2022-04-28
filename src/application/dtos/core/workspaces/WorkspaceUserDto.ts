import type { Role } from "@/application/enums/shared/Role";
import type { UserDto } from "../../core/users/UserDto";
import type { AppEntityDto } from "../AppEntityDto";
import type { WorkspaceDto } from "./WorkspaceDto";

export interface WorkspaceUserDto extends AppEntityDto {
  workspaceId: string;
  workspace?: WorkspaceDto;
  userId: string;
  user?: UserDto;
  role: Role;
  default?: boolean;
}
