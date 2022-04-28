import type { MasterEntityDto } from "../MasterEntityDto";
import type { UserDto } from "../users/UserDto";
import type { ContractDto } from "../../app/contracts/ContractDto";
import type { WorkspaceDto } from "../workspaces/WorkspaceDto";
import type { LinkStatus } from "@/application/enums/core/links/LinkStatus";

export interface LinkDto extends MasterEntityDto {
  createdByUserId: string;
  createdByUser: UserDto;
  createdByWorkspaceId: string;
  createdByWorkspace: WorkspaceDto;
  providerWorkspaceId: string;
  providerWorkspace: WorkspaceDto;
  clientWorkspaceId: string;
  clientWorkspace: WorkspaceDto;
  status: LinkStatus;
  contracts?: ContractDto[];
}
