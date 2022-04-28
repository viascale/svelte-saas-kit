import { ApiService } from "../../ApiService";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { IWorkspaceService } from "./IWorkspaceService";
import type { CreateWorkspaceRequest } from "@/application/contracts/core/workspaces/CreateWorkspaceRequest";
import type { UpdateWorkspaceRequest } from "@/application/contracts/core/workspaces/UpdateWorkspaceRequest";
import { tenantStore } from "@/store/modules/tenantStore";

export class WorkspaceService extends ApiService implements IWorkspaceService {
  constructor() {
    super("Workspace");
  }
  getAllWorkspaces(saveInStore = false): Promise<WorkspaceDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll("GetAll")
        .then((response: WorkspaceDto[]) => {
          resolve(JSON.parse(JSON.stringify(response)));
          if (saveInStore) {
            tenantStore.setWorkspaces(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get(id: string): Promise<WorkspaceDto> {
    return super.get("Get", id);
  }
  create(data: CreateWorkspaceRequest): Promise<WorkspaceDto> {
    return super.post(data);
  }
  update(id: string, data: UpdateWorkspaceRequest): Promise<WorkspaceDto> {
    return super.put(id, data);
  }
  delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super
        .delete(id)
        .then(() => {
          resolve(this.getAllWorkspaces(true));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
