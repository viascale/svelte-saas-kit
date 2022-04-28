import type { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import type { AppWorkspaceEntityDto } from "../../core/AppWorkspaceEntityDto";
import type { ContractDto } from "./ContractDto";

export interface ContractMemberDto extends AppWorkspaceEntityDto {
  contractId: string;
  contract: ContractDto;
  role: ContractMemberRole;
  userId: string;
  user: UserDto;
  signDate?: Date;
}
