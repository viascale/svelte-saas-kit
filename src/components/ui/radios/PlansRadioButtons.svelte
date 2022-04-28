<script lang="ts">
  import { onMount } from "svelte";
  import Loading from "../loaders/Loading.svelte";
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import NumberUtils from "@/utils/shared/NumberUtils";
  import classNames from "@/utils/shared/ClassesUtils";
  import services from "@/services";
  import WarningBanner from "../banners/WarningBanner.svelte";

  export let className: string = "";
  export let plansLabel: boolean = true;
  export let showCurrent: boolean = false;

  import { _ as t } from "svelte-i18n";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";
  import { authState } from "@/store/modules/authStore";
  import { tenantState } from "@/store/modules/tenantStore";
  let loading: boolean = false;

  $: products =
    ($pricingState.products as SubscriptionProductDto[])
      ?.filter((f) => f.active && !f.contactUs)
      .sort((x, y) => {
        return x.tier > y.tier ? 1 : -1;
      }) ?? [];
  $: billingPeriod = $pricingState.billingPeriod;
  $: currency = $pricingState.currency;
  $: selectedProduct = $pricingState.selectedProduct;

  $: activeProducts = activeProducts = $tenantState.subscription?.myProducts ?? [];
  $: activeProduct = activeProducts?.length > 0 ? activeProducts[0] : null;

  $: authenticated = $authState.authenticated;

  onMount(() => {
    loading = true;
    services.subscriptionProducts
      .getProducts()
      .then(() => {
        loadCurrent();
        if (!authenticated) {
          selectProductIfNotSelected();
        }
      })
      .finally(() => {
        loading = false;
      });
  });
  function loadCurrent() {
    if (activeProduct) {
      pricingStore.setSelected({
        billingPeriod: activeProduct.subscriptionPrice.billingPeriod,
        product: activeProduct.subscriptionProduct,
      });
    }
  }
  function getPrice(product: SubscriptionProductDto): SubscriptionPriceDto | undefined {
    const prices = product.prices.find(
      (f) => (f.billingPeriod === billingPeriod || f.billingPeriod === SubscriptionBillingPeriod.ONCE) && f.currency === currency && f.active
    );
    return prices;
  }
  function getPriceAmount(product: SubscriptionProductDto): string {
    return NumberUtils.intFormat(getPrice(product)?.price ?? 0);
  }
  function changedProduct(title: string) {
    const product = products.find((f) => f.title === title);
    if (product) {
      pricingStore.setSelected({
        product,
        billingPeriod,
      });
    }
  }
  function selectMonthly() {
    pricingStore.setBillingPeriod(SubscriptionBillingPeriod.MONTHLY);
  }
  function selectYearly() {
    pricingStore.setBillingPeriod(SubscriptionBillingPeriod.YEARLY);
  }
  function toggleBillingPeriod() {
    if (billingPeriod === SubscriptionBillingPeriod.MONTHLY) {
      selectYearly();
    } else {
      selectMonthly();
    }
  }
  function selectProductIfNotSelected() {
    if (products.length > 0) {
      if (!products.find((f) => f.id === selectedProduct?.id)) {
        pricingStore.setSelected({
          billingPeriod: products[0].prices[0].billingPeriod,
          product: products[0],
        });
      }
    }
  }
  function getBillingPeriodName(billingPeriod: SubscriptionBillingPeriod) {
    return $t("pricing." + SubscriptionBillingPeriod[billingPeriod]);
  }
  function getYearlyDiscount(): string | undefined {
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
  $: isSelected = (product: SubscriptionProductDto) => {
    if (selectedProduct && product.title === selectedProduct.title) {
      return true;
    }
    return false;
  };
</script>

<div class={className}>
  {#if loading}
    <Loading />
  {:else}
    <span>
      <fieldset>
        <legend class="text-sm font-medium flex items-center justify-between w-full">
          <div>
            {#if plansLabel} <span>{$t("shared.plan")}</span>{/if}
          </div>
          <div class="flex items-center justify-center space-x-2">
            <button type="button" on:click|preventDefault={selectMonthly} class="text-gray-500 text-sm font-normal focus:outline-none">
              {getBillingPeriodName(3)}
            </button>
            <button
              type="button"
              class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              on:click|preventDefault={toggleBillingPeriod}
            >
              <div class="w-8 h-4 transition bg-theme-500 rounded-full shadow-md outline-none" />
              <div
                class={classNames(
                  "absolute inline-flex items-center justify-center w-2 h-2 transition-all duration-200 ease-in-out transform bg-white rounded-full shadow-sm top-1 left-1",
                  billingPeriod === SubscriptionBillingPeriod.YEARLY && "translate-x-4"
                )}
              />
            </button>
            <button
              type="button"
              on:click|preventDefault={selectYearly}
              class="flex items-center space-x-1 text-gray-500 text-sm font-normal focus:outline-none"
            >
              <div>{getBillingPeriodName(4)}</div>
              <div class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-teal-100 text-teal-800">{getYearlyDiscount()}</div>
            </button>
          </div>
        </legend>

        <div class="mt-2 relative bg-white rounded-md -space-y-px">
          {#if !loading && products.length === 0}
            <div>
              <WarningBanner redirect="/admin/pricing" title={$t("shared.error")} text={$t("admin.pricing.noPricesInDatabase")} />
            </div>
          {/if}
          <!--Checked: "bg-theme-50 border-theme-200 z-10", Not Checked: "border-gray-200" -->
          {#each products as product, index}
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
              class={classNames(
                "relative border p-4 flex flex-col cursor-pointer sm:pl-4 sm:pr-6 sm:grid sm:grid-cols-3 focus:outline-none",
                index === products.length - 1 && "rounded-b-md",
                isSelected(product) && "bg-theme-50 border-theme-200 z-10",
                !isSelected(product) && "border-gray-200"
              )}
            >
              <div class="flex items-center text-sm">
                <input
                  type="radio"
                  name="pricing-plan"
                  value={product.title}
                  checked={isSelected(product)}
                  class="h-4 w-4 text-theme-600 border-gray-300 focus:ring-theme-500"
                  aria-labelledby="pricing-plans-0-label"
                  aria-describedby="pricing-plans-0-description-0 pricing-plans-0-description-1"
                  on:change={(e) => changedProduct(e.currentTarget.value)}
                />
                <!--Checked: "text-theme-900", Not Checked: "text-gray-900" -->
                <span
                  id="pricing-plans-0-label"
                  class={classNames("ml-3 font-medium", isSelected(product) && "text-theme-900", !isSelected(product) && "text-gray-900")}
                >
                  {$t(product.title)}
                </span>
                {#if showCurrent && activeProduct && activeProduct.subscriptionProduct.title === product.title}
                  <span class="ml-2 font-extrabold truncate">({$t("shared.current")})</span>
                {/if}
              </div>
              <p id="pricing-plans-0-description-0" class="ml-6 pl-1 text-sm sm:ml-0 sm:pl-0 sm:text-center">
                <!--Checked: "text-theme-900", Not Checked: "text-gray-900" -->
                <span class="font-medium">
                  <span class={classNames("font-medium tracking-tight", isSelected(product) && "text-theme-900", !isSelected(product) && "text-gray-900")}>
                    {getPriceAmount(product)}
                  </span>
                  {#if billingPeriod === SubscriptionBillingPeriod.MONTHLY}
                    <span class="text-gray-500 font-normal">/ {$t("pricing.MONTHLYShort")}</span>
                  {:else}
                    <span class="text-gray-500">/ {$t("pricing.YEARLYShort")}</span>
                  {/if}
                </span>
              </p>
              <!--Checked: "text-theme-700", Not Checked: "text-gray-500" -->
              <p
                id="pricing-plans-0-description-1"
                class={classNames(
                  "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right",
                  isSelected(product) && "text-theme-700",
                  !isSelected(product) && "text-gray-500"
                )}
              >
                <span>{$t(product.features[0].key, { values: { p1: product.features[0].value } })}</span>
              </p>
            </label>
          {/each}
        </div>
      </fieldset>
    </span>
  {/if}
</div>
