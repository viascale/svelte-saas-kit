import type { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";
import type { ContractActivityDto } from "./ContractActivityDto";
import type { ContractMemberDto } from "./ContractMemberDto";
import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
import type { AppWorkspaceEntityDto } from "../../core/AppWorkspaceEntityDto";
import type { ContractEmployeeDto } from "./ContractEmployeeDto";

export interface ContractDto extends AppWorkspaceEntityDto {
  name: string;
  description: string;
  linkId: string;
  link: LinkDto;
  hasFile: boolean;
  signedDate?: Date;
  status: ContractStatus;
  members: ContractMemberDto[];
  employees: ContractEmployeeDto[];
  activity: ContractActivityDto[];
}
