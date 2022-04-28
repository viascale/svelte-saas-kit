<script lang="ts">
  import { tenantState } from "@/store/modules/tenantStore";
  import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.svelte";
  import type { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";
  import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
  import { pricingState } from "@/store/modules/pricingStore";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let confirmModal: ConfirmModal;
  let loadingButton: LoadingButton;

  let editing: boolean = false;

  function updateSubscription() {
    if (!selectedPrice || !selectedProduct) {
      errorModal?.show($t("shared.error"), $t("settings.subscription.errors.selectPlan"));
      return;
    }
    if (selectedPrice.trialDays === 0 && selectedPrice.price > 0 && !subscriptionCard) {
      errorModal?.show($t("settings.tenant.payment.notSet"));
      return;
    }
    if (selectingCurrentTenantProduct()) {
      errorModal?.show($t("settings.subscription.alreadySubscribed"));
      return;
    }

    confirmModal?.show(
      $t("shared.updateSubscriptionTo", { values: { p1: $t(selectedProduct.title) } }).toString(),
      $t("shared.confirm").toString(),
      $t("shared.back").toString(),
      priceDescription(selectedPrice)
    );
  }
  function yesUpdate() {
    if (!selectedPrice) {
      return;
    }
    loadingButton?.start();
    services.subscriptionManager
      .updateSubscription({
        subscriptionPriceId: selectedPrice.id,
      })
      .then(() => {
        services.subscriptionManager.getCurrentSubscription();
        services.tenants.getFeatures();
        successModal?.show($t("shared.updated"), $t("settings.subscription.updated"));
        tinyEventBus().emitter.emit("updated-plan");
        editing = false;
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        if (loadingButton) {
          loadingButton?.stop();
        }
      });
  }
  function openDropdown() {
    editing = !editing;
  }
  $: selectedProduct = $pricingState.selectedProduct as SubscriptionProductDto;
  $: selectedPrice = selectedProduct?.prices.find((f) => f.billingPeriod === $pricingState.billingPeriod);
  $: activeTenantProducts = $tenantState.subscription?.myProducts ?? [];

  $: selectingCurrentTenantProduct = () => {
    if (selectedPrice && activeTenantProducts.length > 0) {
      return selectedPrice.id === activeTenantProducts[0].id;
    }
    return false;
  };
  $: subscriptionCard = (): SubscriptionCardDto | undefined => {
    if ($tenantState.subscription && $tenantState.subscription.paymentMethods?.length > 0) {
      return $tenantState.subscription.paymentMethods[0].card;
    }
  };

  const priceDescription = (selectedPrice: SubscriptionPriceDto): string => {
    if (!selectedPrice) {
      return "";
    }
    const price = selectedPrice.price;
    const currency = selectedPrice.currency;
    const period = "/" + $t("pricing." + SubscriptionBillingPeriod[selectedPrice.billingPeriod] + "Short");
    // const feature = selectedProduct.value?.features[0].value;
    return `${price} ${currency}${period}.`;
  };
</script>

<div>
  <form method="POST">
    <div class="shadow sm:rounded-sm">
      <div class="px-4 py-5 bg-white sm:p-6 space-y-2">
        <div class="flex items-center space-x-2 justify-between">
          <h3 class="leading-5 font-medium text-gray-900">{$t("shared.upgrade")}</h3>
        </div>
        <div class="grid grid-cols-6 gap-2">
          <PlansRadioButtons plansLabel={false} showCurrent={true} className="-mt-6 col-span-6" />
        </div>
      </div>
      <div class="px-4 py-3 sm:px-6 flex items-center space-x-2 justify-end">
        <ButtonSecondary on:click={openDropdown}>
          <span>{!editing ? $t("shared.change") : $t("shared.cancel")}</span>
        </ButtonSecondary>
        {#if editing}
          <LoadingButton
            on:click={updateSubscription}
            disabled={selectingCurrentTenantProduct()}
            className={classNames(selectingCurrentTenantProduct() && " opacity-50 cursor-not-allowed")}
            bind:this={loadingButton}
          >
            {$t("shared.upgrade")}
          </LoadingButton>
        {/if}
      </div>
    </div>
  </form>

  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmModal} on:yes={yesUpdate} />
</div>
