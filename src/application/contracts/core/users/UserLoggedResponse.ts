import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { UserDto } from "@/application/dtos/core/users/UserDto";

export interface UserLoggedResponse {
  user: UserDto;
  token: string;
  defaultWorkspace: WorkspaceDto;
}
