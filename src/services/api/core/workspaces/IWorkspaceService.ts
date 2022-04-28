import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { CreateWorkspaceRequest } from "@/application/contracts/core/workspaces/CreateWorkspaceRequest";
import type { UpdateWorkspaceRequest } from "@/application/contracts/core/workspaces/UpdateWorkspaceRequest";

export interface IWorkspaceService {
  getAllWorkspaces(saveInStore: boolean): Promise<WorkspaceDto[]>;
  get(id: string): Promise<WorkspaceDto>;
  create(data: CreateWorkspaceRequest): Promise<WorkspaceDto>;
  update(id: string, data: UpdateWorkspaceRequest): Promise<WorkspaceDto>;
  delete(id: string): Promise<any>;
}
