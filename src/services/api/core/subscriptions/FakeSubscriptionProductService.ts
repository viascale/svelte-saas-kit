/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import plans from "@/application/pricing/plans";
import { pricingState, pricingStore } from "@/store/modules/pricingStore";
import type { ISubscriptionProductService } from "./ISubscriptionProductService";
import { get } from "svelte/store";

export class FakeSubscriptionProductService implements ISubscriptionProductService {
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, _reject) => {
      pricingStore.setProducts(plans);
      setTimeout(() => {
        const currencies: string[] = [];
        plans.forEach((product) => {
          product.prices.forEach((price) => {
            if (!currencies.includes(price.currency)) {
              currencies.push(price.currency);
            }
          });
        });
        let currency = get(pricingState).currency;
        if (currencies.length > 0 && !currencies.includes(currency)) {
          pricingStore.setCurrency(currencies[0]);
        }
        pricingStore.setProducts(plans);

        resolve(plans);
      }, 500);
    });
  }
  createProduct(_product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
