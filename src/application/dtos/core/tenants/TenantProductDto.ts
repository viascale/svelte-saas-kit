import type { MasterEntityDto } from "../MasterEntityDto";
import type { SubscriptionPriceDto } from "../subscriptions/SubscriptionPriceDto";
import type { SubscriptionProductDto } from "../subscriptions/SubscriptionProductDto";
import type { TenantDto } from "./TenantDto";

export interface TenantProductDto extends MasterEntityDto {
  tenantId: string;
  tenant: TenantDto;
  subscriptionPriceId: string;
  subscriptionPrice: SubscriptionPriceDto;
  active: boolean;
  subscriptionServiceId: string;
  cancelledAt?: Date;
  subscriptionProduct: SubscriptionProductDto;
  trialEnds?: Date;
  startDate: Date;
  endDate?: Date;
  maxWorkspaces: number;
  maxUsers: number;
  maxLinks: number;
  maxStorage: number;
  monthlyContracts: number;
}
