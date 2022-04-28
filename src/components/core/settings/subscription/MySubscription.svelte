<script lang="ts">
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import services from "@/services";
  import MySubscriptionPaymentDetails from "./MySubscriptionPaymentDetails.svelte";
  import MySubscriptionPlan from "./MySubscriptionPlan.svelte";
  import MySubscriptionProducts from "./MySubscriptionProducts.svelte";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { tenantState } from "@/store/modules/tenantStore";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let confirmModal: ConfirmModal;

  onMount(() => {
    services.subscriptionProducts.getProducts();
    services.tenants.getCurrentUsage(AppUsageType.ALL);
  });

  function cancel() {
    confirmModal?.show($t("settings.subscription.confirmCancel"));
  }
  async function confirmCancel() {
    return services.subscriptionManager
      .cancelSubscription()
      .then(() => {
        successModal?.show($t("shared.updated"), $t("settings.subscription.canceled"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  $: products = $tenantState.subscription?.myProducts ?? [];
  $: subscription = (): SubscriptionPriceDto | undefined => {
    const mySubscriptions = products?.filter((f) => f.subscriptionPrice.billingPeriod !== SubscriptionBillingPeriod.ONCE);
    if (mySubscriptions && mySubscriptions.length > 0) {
      return mySubscriptions[0].subscriptionPrice;
    } else {
      return undefined;
    }
  };
</script>

<svelte:head>
  <title>{$t("app.navbar.subscription")} | Svelte SaasFrontend</title>
</svelte:head>
<div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="md:grid lg:grid-cols-3 md:gap-2">
    <div class="md:col-span-1">
      <div class="sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.subscription.title")}</h3>

        <div class="mt-1 text-xs leading-5 text-gray-600">
          {#if subscription()}
            <span>
              <p class="text-xs text-gray-900 font-bold" />
              <p>
                <button on:click={cancel} class="text-gray-500 font-medium hover:underline hover:text-gray-600">
                  {$t("settings.subscription.clickCancel")}
                </button>
              </p>
            </span>
          {:else}
            <span>{$t("settings.subscription.description")}</span>
          {/if}
        </div>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      {#if !subscription && (!products || products.length === 0) && false}
        <div>
          <div class="rounded-sm bg-yellow-50 p-4 mb-4 border border-yellow-200 shadow-sm">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm leading-5 font-medium text-yellow-800">{$t("settings.subscription.notSubscribed")}</h3>
                <div class="mt-2 text-sm leading-5 text-yellow-700">
                  <p>{$t("settings.subscription.notSubscribedDescription")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
      <MySubscriptionProducts withCurrentPlan={true} className="mb-4 bg-white shadow px-4 py-5 sm:p-6 space-y-2 sm:rounded-sm" />
      <MySubscriptionPlan />
      <MySubscriptionPaymentDetails className="mt-3" />
    </div>
  </div>

  <ConfirmModal bind:this={confirmModal} on:yes={confirmCancel} />
  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
</div>
