import type { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";

export interface CreateEmployeesRequest {
  employees: EmployeeDto[];
}
