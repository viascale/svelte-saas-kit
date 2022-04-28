import type { SubscriptionProductDto } from "./SubscriptionProductDto";
import type { MasterEntityDto } from "../MasterEntityDto";
import type { SubscriptionPlanDto } from "./SubscriptionPlanDto";
import type { SubscriptionPriceType } from "@/application/enums/core/subscriptions/SubscriptionPriceType";
import type { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";

export interface SubscriptionPriceDto extends MasterEntityDto {
  serviceId: string;
  type: SubscriptionPriceType;
  billingPeriod: SubscriptionBillingPeriod;
  price: number;
  currency: string;
  trialDays: number;
  active: boolean;
  priceBefore?: number;
  subscriptionProductId?: string;
  subscriptionProduct?: SubscriptionProductDto;
  subscriptionPlan?: SubscriptionPlanDto;
}
