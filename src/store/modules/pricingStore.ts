import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionPriceType } from "@/application/enums/core/subscriptions/SubscriptionPriceType";
import { writable } from "svelte/store";
import type { PricingState } from "../types";

const initialState: PricingState = JSON.parse(localStorage.getItem("pricing") ?? "{}") ?? {
  products: [],
  selectedProduct: null,
  billingPeriod: SubscriptionBillingPeriod.MONTHLY,
  currency: import.meta.env.VITE_SVELTE_APP_CURRENCY?.toString() ?? "usd",
};

export const pricingState = writable(initialState);

export const pricingStore = {
  resetPricingState: () => {
    pricingState.update((self) => {
      self.products = [];
      self.selectedProduct = null;
      self.billingPeriod = SubscriptionBillingPeriod.MONTHLY;
      self.currency = import.meta.env.VITE_SVELTE_APP_CURRENCY?.toString() ?? "usd";
      return self;
    });
  },
  setProducts: (payload: SubscriptionProductDto[]) =>
    pricingState.update((self) => {
      self.products = payload.slice().sort((x, y) => {
        return x.tier > y.tier ? 1 : -1;
      });
      if (payload.length > 0) {
        payload.forEach((product) => {
          product.prices.forEach((price) => {
            if (price.type === SubscriptionPriceType.RECURRING) {
              if (!self.currency) {
                self.currency = price.currency;
              }
            }
          });
        });
      }
      return self;
    }),
  setSelected: (payload: { billingPeriod: SubscriptionBillingPeriod; product: SubscriptionProductDto | null }) =>
    pricingState.update((self) => {
      self.billingPeriod = payload.billingPeriod;
      self.selectedProduct = payload.product;
      return self;
    }),
  setProduct: (payload: SubscriptionProductDto) =>
    pricingState.update((self) => {
      self.selectedProduct = payload;
      return self;
    }),
  setBillingPeriod: (payload: SubscriptionBillingPeriod) =>
    pricingState.update((self) => {
      self.billingPeriod = payload;
      return self;
    }),
  setCurrency: (payload: string) =>
    pricingState.update((self) => {
      self.currency = payload;
      return self;
    }),
};

pricingState.subscribe((val) => {
  localStorage.setItem("pricing", JSON.stringify(val));
});
