import type { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import type { WorkspaceDto } from "../workspaces/WorkspaceDto";
import type { MasterEntityDto } from "../MasterEntityDto";
import type { LinkDto } from "./LinkDto";

export interface LinkInvitationDto extends MasterEntityDto {
  createdByWorkspaceId: string;
  createdByWorkspace: WorkspaceDto;
  email: string;
  workspaceName: string;
  message: string;
  inviteeIsProvider: boolean;
  status: LinkStatus;
  createdLinkId: string | null;
  createdLink: LinkDto;
}
