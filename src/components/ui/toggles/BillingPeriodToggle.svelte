<script lang="ts">
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";
  import classNames from "@/utils/shared/ClassesUtils";
  import { createEventDispatcher } from "svelte";
  import { _ as t } from "svelte-i18n";
  const dispatch = createEventDispatcher();

  function changeInterval(billingPeriod: SubscriptionBillingPeriod) {
    pricingStore.setBillingPeriod(billingPeriod);
    dispatch("selected");
  }
  function billingPeriodName(billingPeriod: SubscriptionBillingPeriod): string {
    return $t("pricing." + SubscriptionBillingPeriod[billingPeriod].toString()).toString();
  }
  function isYearly(billingPeriod: SubscriptionBillingPeriod): boolean {
    return billingPeriod === SubscriptionBillingPeriod.YEARLY;
  }
  function yearlyDiscount(): string | undefined {
    const priceYearly = getPriceWithInterval(SubscriptionBillingPeriod.YEARLY);
    const priceMonthly = getPriceWithInterval(SubscriptionBillingPeriod.MONTHLY);
    if (priceYearly && priceMonthly) {
      const discount = 100 - (priceYearly.price * 100) / (priceMonthly.price * 12);
      if (discount !== 0) {
        return "-" + discount.toFixed(0) + "%";
      }
    }

    return undefined;
  }
  function getPriceWithInterval(billingPeriod: SubscriptionBillingPeriod): SubscriptionPriceDto | undefined {
    let price: SubscriptionPriceDto | undefined;
    if (products && products.length > 0) {
      products.forEach((product) => {
        const prices = product.prices.find((f) => f.billingPeriod === billingPeriod && f.currency === currency && f.price > 0);
        if (prices) {
          price = prices;
        }
      });
    }
    return price;
  }
  function billingPeriods() {
    const allBillingPeriods: SubscriptionBillingPeriod[] = [];
    function onlyUnique(value: any, index: any, self: any) {
      return self.indexOf(value) === index;
    }

    products.forEach((element) => {
      element.prices.forEach((price) => {
        if (currency === price.currency && price.billingPeriod !== SubscriptionBillingPeriod.ONCE) {
          allBillingPeriods.push(price.billingPeriod);
        }
      });
    });
    return allBillingPeriods.filter(onlyUnique);
  }
  $: billingPeriod = $pricingState.billingPeriod;
  $: currency = $pricingState.currency;
  $: products = $pricingState.products;
</script>

<div class="w-full flex justify-center mb-0">
  {#if billingPeriods().length > 0}
    <div class="flex justify-center">
      {#each billingPeriods() as period, idx}
        <button
          type="button"
          on:click={() => changeInterval(period)}
          class={classNames(
            "border border-slate-200 dark:border-gray-700 uppercase py-1 flex justify-center w-36 sm:w-32 items-center space-x-2",
            billingPeriod !== period
              ? "text-xs p-4 cursor-pointer bg-gray-50 dark:bg-gray-700"
              : "text-xs p-4 cursor-pointer bg-white dark:bg-gray-900 border shadow-md border-slate-300 dark:border-gray-600",
            idx === 0 ? "rounded-l-md border-r-none" : "rounded-r-md border-l-none"
          )}
        >
          <div>{billingPeriodName(period)}</div>
          {#if isYearly(period) && yearlyDiscount()}
            <div
              class="text-right bg-green-200 text-green-600 ml-1 flex content-center items-center justify-center rounded-sm p-1 text-xs px-2 cursor-pointer font-semibold"
            >
              {yearlyDiscount()}
            </div>
          {/if}
        </button>;
      {/each}
    </div>
  {/if}
</div>
