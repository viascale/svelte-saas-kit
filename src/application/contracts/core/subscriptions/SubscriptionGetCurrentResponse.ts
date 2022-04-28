import type { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import type { SubscriptionCustomerDto } from "@/application/dtos/core/subscriptions/SubscriptionCustomerDto";
import type { SubscriptionInvoiceDto } from "@/application/dtos/core/subscriptions/SubscriptionInvoiceDto";
import type { SubscriptionPaymentMethodDto } from "@/application/dtos/core/subscriptions/SubscriptionPaymentMethodDto";
import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";

export interface SubscriptionGetCurrentResponse {
  activeProduct: TenantProductDto[];
  myProducts: TenantProductDto[];
  customer: SubscriptionCustomerDto;
  invoices: SubscriptionInvoiceDto[];
  cards: SubscriptionCardDto[];
  paymentMethods: SubscriptionPaymentMethodDto[];
}
