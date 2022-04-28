import type { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
import type { AppWorkspaceEntityDto } from "../../core/AppWorkspaceEntityDto";
import type { ContractDto } from "./ContractDto";

export interface ContractActivityDto extends AppWorkspaceEntityDto {
  contractId: string;
  contract: ContractDto;
  type: ContractActivityType;
}
