import type { AppEntityDto } from "./AppEntityDto";
import type { WorkspaceDto } from "./workspaces/WorkspaceDto";

export interface AppWorkspaceEntityDto extends AppEntityDto {
  workspaceId?: string;
  workspace?: WorkspaceDto;
}
