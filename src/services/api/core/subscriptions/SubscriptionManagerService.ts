import { ApiService } from "@/services/api/ApiService";
import type { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import type { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import type { SelectedSubscriptionRequest } from "@/application/contracts/core/subscriptions/SelectedSubscriptionRequest";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import type { ISubscriptionManagerService } from "./ISubscriptionManagerService";
import { tenantStore } from "@/store/modules/tenantStore";
import { pricingStore } from "@/store/modules/pricingStore";

export class SubscriptionManagerService extends ApiService implements ISubscriptionManagerService {
  constructor() {
    super("SubscriptionManager");
  }
  getCurrentSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .get("GetCurrentSubscription")
        .then((subscription: SubscriptionGetCurrentResponse) => {
          tenantStore.setSubscription(subscription);
          if (subscription.myProducts?.length > 0) {
            pricingStore.setProduct(subscription.myProducts[0].subscriptionProduct);
            pricingStore.setBillingPeriod(subscription.myProducts[0].subscriptionPrice.billingPeriod);
          }
          resolve(subscription);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getCoupon(couponId: string, currency: string): Promise<SubscriptionCouponDto> {
    return super.get(`GetCoupon/${couponId}/${currency}`);
  }
  updateSubscription(subscription: SelectedSubscriptionRequest): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(subscription, `UpdateSubscription`)
        .then((response) => {
          tenantStore.setSubscription(response);
          if (response.myProducts?.length > 0) {
            pricingStore.setProduct(response.myProducts[0].subscriptionProduct);
            pricingStore.setBillingPeriod(response.myProducts[0].subscriptionPrice.billingPeriod);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  cancelSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, "CancelSubscription")
        .then((response) => {
          tenantStore.setSubscription(response);
          if (response.myProducts?.length > 0) {
            pricingStore.setProduct(response.myProducts[0].subscriptionProduct);
            pricingStore.setBillingPeriod(response.myProducts[0].subscriptionPrice.billingPeriod);
          }
          pricingStore.setSelected({
            product: null,
            billingPeriod: SubscriptionBillingPeriod.MONTHLY,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateCardToken(cardToken: string): Promise<SubscriptionGetCurrentResponse> {
    return super.post(cardToken, `UpdateCardToken/${cardToken}`);
  }
  createCustomerPortalSession(): Promise<SubscriptionGetCurrentResponse> {
    return super.post(null, `CreateCustomerPortalSession`);
  }
}
