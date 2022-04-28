import type { MasterEntityDto } from "../MasterEntityDto";
import type { SubscriptionProductDto } from "./SubscriptionProductDto";

export interface SubscriptionFeatureDto extends MasterEntityDto {
  order: number;
  subscriptionProductId?: string;
  subscriptionProduct?: SubscriptionProductDto;
  key: string;
  value: string;
  included: boolean;
}
