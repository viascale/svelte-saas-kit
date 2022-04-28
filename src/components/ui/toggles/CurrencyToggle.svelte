<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let className: string = "";

  function changeCurrency(currency: string) {
    pricingStore.setCurrency(currency);
    dispatch("selected");
  }

  $: products = $pricingState.products;
  $: selectedCurrency = $pricingState.currency;

  const currencies = () => {
    const allCurrencies: string[] = [];
    function onlyUnique(value: any, index: any, self: any) {
      return self.indexOf(value) === index;
    }

    products.forEach((element) => {
      element.prices.forEach((price) => {
        allCurrencies.push(price.currency.toLowerCase());
      });
    });
    return allCurrencies.filter(onlyUnique);
  };
  $: currencies();
</script>

<div class={className}>
  {#if currencies() && currencies().length > 1}
    <div class="w-full flex justify-center mb-0">
      <div class="flex justify-center items-center rounded-md">
        {#each currencies() as currency, idx}
          <button
            type="button"
            on:click={(e) => changeCurrency(e.currentTarget.value)}
            class={classNames(
              "border border-slate-200 dark:border-gray-700 uppercase flex justify-center w-36 sm:w-32",
              selectedCurrency !== currency
                ? "text-xs p-2 cursor-pointer bg-gray-50 dark:bg-gray-700 "
                : "text-xs p-2 cursor-pointer bg-white dark:bg-gray-900 border shadow-md border-slate-300 dark:border-gray-600",
              idx === 0 ? "rounded-l-md border-r-none" : "rounded-r-md border-l-none"
            )}
          >
            {currency}
          </button>;
        {/each}
      </div>
    </div>
  {/if}
</div>
