import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import { ApiService } from "../../ApiService";
import type { IContractService } from "./IContractService";
import type { CreateContractRequest } from "@/application/contracts/app/contracts/CreateContractRequest";
import type { SendContractRequest } from "@/application/contracts/app/contracts/SendContractRequest";
import type { UpdateContractRequest } from "@/application/contracts/app/contracts/UpdateContractRequest";
import type { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";

export class ContractService extends ApiService implements IContractService {
  constructor() {
    super("Contract");
  }
  getAllByStatusFilter(filter: ContractStatusFilter): Promise<ContractDto[]> {
    return super.getAll("GetAllByStatusFilter/" + filter);
  }
  getAllByLink(linkId: string): Promise<ContractDto[]> {
    return super.getAll("GetAllByLink/" + linkId);
  }
  getContract(id: string): Promise<ContractDto> {
    return super.get(`Get/${id}`);
  }
  create(data: CreateContractRequest): Promise<ContractDto> {
    return super.post(data, "Create");
  }
  downloadFile(id: string): Promise<any> {
    return super.post(undefined, `Download/${id}`);
  }
  send(id: string, request: SendContractRequest): Promise<any> {
    return super.post(request, `Send/${id}`);
  }
  update(id: string, data: UpdateContractRequest): Promise<ContractDto> {
    return super.put(id, data, "Update");
  }
  delete(id: string): Promise<any> {
    return super.delete(id);
  }
}
