import { ApiService } from "@/services/api/ApiService";
import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import type { ISubscriptionProductService } from "./ISubscriptionProductService";
import { pricingState, pricingStore } from "@/store/modules/pricingStore";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

export class SubscriptionProductService extends ApiService implements ISubscriptionProductService {
  constructor() {
    super("SubscriptionProduct");
  }
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll()
        .then((response: SubscriptionProductDto[]) => {
          const currencies: string[] = [];
          response.forEach((product) => {
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
          pricingStore.setProducts(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  createProduct(product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    product.title = $t(product.title).toString();
    product.description = $t(product.description).toString();
    return super.post(product, `CreateProduct`);
  }
}
