import type { AppWorkspaceEntityDto } from "../../core/AppWorkspaceEntityDto";
import type { EmployeeDto } from "../employees/EmployeeDto";

export interface ContractEmployeeDto extends AppWorkspaceEntityDto {
  employeeId: string;
  employee: EmployeeDto;
}
