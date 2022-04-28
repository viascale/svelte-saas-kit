<script lang="ts">
  import services from "@/services";
  import classNames from "@/utils/shared/ClassesUtils";
  import NumberUtils from "@/utils/shared/NumberUtils";

  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import plans from "@/application/pricing/plans";
  import { Link, navigate } from "svelte-routing";

  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";

  let loading = false;

  onMount(() => {
    reload();
  });

  function reload() {
    loading = true;
    services.subscriptionProducts.getProducts().finally(() => {
      loading = false;
    });
  }
  function billingPeriodOnce(product: SubscriptionProductDto): boolean | undefined {
    return getPrice(product)?.billingPeriod === SubscriptionBillingPeriod.ONCE;
  }
  function productUrl(product: SubscriptionProductDto) {
    if (product.contactUs) {
      return "/contact";
    }
    return "/register";
  }
  function selectProduct(product: SubscriptionProductDto) {
    pricingStore.setSelected({
      product,
      billingPeriod: billingPeriod,
    });
    navigate(productUrl(product));
  }
  function getPrice(product: SubscriptionProductDto): SubscriptionPriceDto | undefined {
    const prices = product.prices.find(
      (f) => (f.billingPeriod === billingPeriod || f.billingPeriod === SubscriptionBillingPeriod.ONCE) && f.currency === currency && f.active
    );
    return prices;
  }
  function getPriceAmount(product: SubscriptionProductDto): number {
    return getPrice(product)?.price ?? 0;
  }
  function getPriceTrialDays(product: SubscriptionProductDto): number {
    return getPrice(product)?.trialDays ?? 0;
  }
  function toggleBillingPeriod() {
    if (billingPeriod == SubscriptionBillingPeriod.MONTHLY) {
      pricingStore.setBillingPeriod(SubscriptionBillingPeriod.YEARLY);
    } else {
      pricingStore.setBillingPeriod(SubscriptionBillingPeriod.MONTHLY);
    }
  }
  function intFormat(value: number) {
    return NumberUtils.intFormat(value);
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
    products().forEach((product) => {
      const prices = product.prices.find((f) => f.billingPeriod === billingPeriod && f.currency === currency && f.price > 0);
      if (prices) {
        price = prices;
      }
    });
    return price;
  }
  $: currency = $pricingState.currency;
  $: billingPeriod = $pricingState.billingPeriod;
  $: products = (): SubscriptionProductDto[] => {
    const items =
      ($pricingState.products as SubscriptionProductDto[])
        ?.filter((f) => getPrice(f) !== undefined && f.active)
        .sort((x, y) => {
          return x.tier > y.tier ? 1 : -1;
        }) ?? [];
    return items.length > 0 ? items : plans;
  };
  $: customPlan = products().find((f) => f.contactUs);
  $: testProducts = !products() || products().filter((f) => f.id === undefined || f.id === "").length > 0;
</script>

<div>
  <div class="container mx-auto antialiased">
    <main class="lg:mx-4">
      <div class="flex items-center justify-center mt-10 space-x-4">
        <span class="text-base font-medium">{$t("pricing.MONTHLY")}</span>
        <button class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500" on:click={toggleBillingPeriod}>
          <div class="w-16 h-8 transition bg-theme-500 rounded-full shadow-md outline-none" />
          <div
            class={classNames(
              "absolute inline-flex bg-white items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform rounded-full shadow-sm top-1 left-1",
              billingPeriod === 3 && "translate-x-0",
              billingPeriod === 4 && "translate-x-8"
            )}
          />
        </button>
        <span class="text-base font-medium">
          {$t("pricing.YEARLY")}{" "}
          {#if getYearlyDiscount()}
            <span class="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-teal-100 text-teal-800">
              {getYearlyDiscount()}
            </span>
          {/if}
        </span>
      </div>

      {#if loading}
        <Loading />
      {:else}
        <div class="space-y-6">
          {#if testProducts}
            <WarningBanner redirect="/admin/pricing" title={$t("shared.warning")} text={$t("admin.pricing.thesePricesAreFromFiles")} />
          {/if}

          <div class={classNames("mt-16 grid gap-6 lg:gap-3", products().length === 2 && "lg:grid-cols-2", products().length > 2 && "lg:grid-cols-3")}>
            {#each products().filter((f) => !f.contactUs) as plan}
              <div>
                <section
                  class={classNames(
                    "relative flex flex-col w-full p-12 rounded-lg shadow-xl",
                    !plan.badge && "border border-theme-100 dark:border-theme-800",
                    plan.badge && "border-2 border-theme-400 dark:border-theme-600"
                  )}
                >
                  {#if plan.badge}
                    <div
                      class="absolute top-0 py-1.5 px-4 bg-theme-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2"
                    >
                      {$t(plan.badge)}
                    </div>
                  {/if}
                  <div class="flex-1 space-y-6">
                    <!-- Price -->
                    <div class="flex-shrink-0">
                      <span class="text-4xl font-medium tracking-tight">{intFormat(getPriceAmount(plan))}</span>

                      {#if billingPeriod === 3}
                        <span class="text-gray-500">/ {$t("pricing.MONTHLYShort")}</span>
                      {:else}
                        <span class="text-gray-500">/ {$t("pricing.YEARLYShort")}</span>
                      {/if}
                    </div>

                    <!-- Badge -->
                    <div class="flex-shrink-0 pb-6 space-y-2 border-b">
                      <h2 class="text-2xl font-normal">{$t(plan.title)}</h2>
                      <p class="text-sm text-gray-500">{$t(plan.description)}</p>
                    </div>

                    <!-- Features -->
                    <ul class="flex-1 space-y-4">
                      {#each plan.features as feature}
                        <li>
                          <div class="flex items-center">
                            {#if feature.included}
                              <svg class="w-5 h-5 text-theme-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            {:else}
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300" viewBox="0 0 20 20" stroke="#FFFFF" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            {/if}
                            <span class="ml-3 text-base font-medium truncate">
                              <span>{$t(feature.key, { values: { p1: feature.value } })}</span>
                            </span>
                          </div>
                        </li>
                      {/each}
                    </ul>

                    <!-- Button -->
                    <div class="flex-shrink-0 pt-4">
                      <button
                        type="button"
                        on:click={() => selectProduct(plan)}
                        class={classNames(
                          "inline-flex items-center justify-center w-full px-4 py-2 transition-colors border dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                          plan.badge ? "bg-theme-500 text-white hover:bg-theme-700" : "hover:bg-theme-500 hover:text-white"
                        )}
                      >
                        {#if getPriceAmount(plan) === 0}
                          <span>{$t("pricing.signUpFree")}</span>
                        {:else if billingPeriodOnce(plan)}
                          <span>{$t("pricing.payOnce")}</span>
                        {:else if getPriceTrialDays(plan) > 0}
                          <!-- <span>{$t("pricing.startTrial", getPriceTrialDays(plan))}</span> -->
                          TODO:
                        {:else}
                          <span>{$t("pricing.subscribe")}</span>
                        {/if}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            {/each}
          </div>

          {#if customPlan}
            <div class="relative">
              <div>
                <div class="mx-auto rounded-lg shadow-xl border border-transparent overflow-hidden lg:flex">
                  <div class="flex-1 bg-slate-800 dark:bg-theme-800 px-6 py-8 lg:p-12">
                    <h3 class="text-2xl font-extrabold text-white sm:text-3xl">{$t(customPlan.title)}</h3>
                    <p class="mt-6 text-base text-white">{$t(customPlan.description)}</p>
                    <div class="mt-8">
                      <div class="flex items-center">
                        <h4 class="flex-shrink-0 pr-4 text-sm tracking-wider font-semibold uppercase text-white">{$t("pricing.whatsIncluded")}</h4>
                        <div class="flex-1 border-t dark:border-gray-300 border-gray-700" />
                      </div>
                      <ul role="list" class="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                        {#each customPlan.features as feature}
                          <li class="flex items-start lg:col-span-1">
                            <div class="flex-shrink-0">
                              <!-- Heroicon name: solid/check-circle -->
                              <svg class="h-5 w-5 text-theme-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path
                                  fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                            <p class="ml-3 text-sm text-gray-50">
                              <span>{$t(feature.key, { values: { p1: feature.value } })}</span>
                            </p>
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                  <div class="py-8 px-6 text-center lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                    <div class="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900 dark:text-white">
                      <span>{$t("pricing.contactUs")}</span>
                    </div>
                    <p class="mt-4 text-sm">
                      <span class="font-medium text-gray-500">{$t("pricing.customPlanDescription")}</span>
                    </p>
                    <div class="mt-6">
                      <div class="rounded-md shadow max-w-md mx-auto">
                        <Link
                          to="/contact"
                          class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900"
                        >
                          {$t("pricing.contact")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </main>
  </div>
</div>
