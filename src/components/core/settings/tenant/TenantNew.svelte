<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "@/components/ui/modals/Modal.svelte";
  import PayCard from "@/components/front/PayCard.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import services from "@/services";
  import type { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
  import CurrencyToggle from "@/components/ui/toggles/CurrencyToggle.svelte";
  import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.svelte";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import UserUtils from "@/utils/store/UserUtils";
  import { _ as t } from "svelte-i18n";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";
  import { authStore } from "@/store/modules/authStore";

  let errorModal: ErrorModal;
  let cardModal: Modal;
  let confirmModal: ConfirmModal;
  let loadingButton: LoadingButton;

  export let close: () => void;
  let name: string = "";
  // const stripeOptions = {} as any;
  // let stripeKey = "";

  // stripeKey = import.meta.env.VITE_SVELTE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
  // stripeOptions.value = {
  //   showCardHolderName: true,
  //   hidePostalCode: false,
  //   iconStyle: "solid",
  //   elements: {
  //     locale: i18n.global.locale,
  //   },
  // };

  $: selectedProduct = $pricingState.selectedProduct;
  $: selectedPrice = selectedProduct
    ? selectedProduct.prices.find((f) => f.billingPeriod === $pricingState.billingPeriod) ?? selectedProduct.prices[0]
    : undefined;

  onMount(() => {
    services.subscriptionProducts.getProducts().then((response) => {
      if (!selectedProduct) {
        pricingStore.setSelected({
          product: response[0],
          billingPeriod: SubscriptionBillingPeriod.MONTHLY,
        });
      }
    });
  });
  function createTenant() {
    if (!selectedPrice || name === "") {
      errorModal?.show($t("shared.missingFields"));
    } else {
      confirmModal?.show($t("settings.tenant.createConfirm"));
    }
  }
  function tryRegister() {
    if (selectedPrice?.trialDays === 0 && selectedPrice?.price > 0) {
      cardModal?.show();
    } else {
      register();
    }
  }
  function payError(error: any) {
    loadingButton?.stop();
    errorModal?.show($t("shared.error"), $t(error));
  }
  function payed(data: any) {
    loadingButton?.stop();
    if (data.error) {
      errorModal?.show("Error", data.error.message);
    } else {
      register(data.token.id);
    }
  }
  function register(stripeCardToken = "") {
    const tenantCreateRequest: TenantCreateRequest = {
      name,
      selectedSubscription: {
        subscriptionPriceId: selectedPrice?.id ?? "",
        subscriptionCardToken: stripeCardToken,
        subscriptionCoupon: "",
      },
    };
    services.tenants
      .create(tenantCreateRequest)
      .then((response) => {
        authStore.login(response);
        UserUtils.logged(response);
        window.location.reload();
        close();
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  $: billingPeriod();
  const billingPeriod = (): string => {
    if (selectedPrice) {
      if (selectedPrice?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
        return $t("pricing.once").toString();
      } else {
        return "/ " + $t("pricing." + SubscriptionBillingPeriod[selectedPrice.billingPeriod] + "Short");
      }
    }
    return "";
  };
  $: priceDescription();
  const priceDescription = () => {
    return "$" + selectedPrice?.price + " " + billingPeriod;
  };

  $: getButtonText();
  const getButtonText = (): string => {
    if (selectedPrice) {
      return (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? $t("pricing.pay") : $t("pricing.subscribe")) + " " + priceDescription;
    }
    return "";
  };
</script>

<div>
  <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <section class="absolute inset-y-0 pl-16 max-w-full right-0 flex">
        <div class="w-screen max-w-md">
          <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
            <div class="flex-1 h-0 overflow-y-auto bg-white text-gray-600">
              <header class="space-y-1 py-6 px-4 bg-gray-100 sm:px-6 shadow-inner border-b border-gray-200">
                <div class="flex items-center justify-between space-x-3">
                  <h2 class="text-lg leading-7 font-medium text-gray-800">{$t("settings.tenant.create")}</h2>
                  <div class="h-7 flex items-center">
                    <button on:click={close} aria-label="Close panel" class="text-gray-500 hover:text-gray-800 transition ease-in-out duration-150">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p class="text-sm leading-5 text-gray-500">{$t("settings.tenant.createDescription")}</p>
                </div>
              </header>
              <div class="flex-1 flex flex-col justify-between">
                <div class="px-4 divide-y divide-gray-200 sm:px-6">
                  <div class="space-y-3 pt-6 pb-5">
                    <div>
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="block text-sm font-medium">{$t("account.register.organization")}</label>

                      <div class="mt-1 rounded-md shadow-sm -space-y-px">
                        <div>
                          <label for="tax-id" class="sr-only">
                            {$t("models.workspace.name")}
                          </label>
                          <input
                            bind:value={name}
                            type="text"
                            name="name"
                            id="name"
                            placeholder={$t("models.workspace.name")}
                            required
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-t-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <CurrencyToggle className="w-full flex justify-center" />
                    </div>
                    <div class="space-y-1">
                      <PlansRadioButtons />
                    </div>
                  </div>

                  <div class="space-y-4 pt-4 pb-6 text-right text-gray-700">
                    <div class="text-sm leading-5 right-0">
                      <span class="inline-flex rounded-sm shadow-sm">
                        <ButtonSecondary on:click={close}>{$t("shared.cancel")}</ButtonSecondary>
                      </span>
                      <span class="inline-flex rounded-sm shadow-sm ml-2">
                        <ButtonPrimary on:click={createTenant}>{$t("shared.create")}</ButtonPrimary>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <Modal bind:this={cardModal}>
    <div>
      <PayCard
        on:submit={() => {
          loadingButton?.start();
        }}
        on:payed={payed}
        on:error={payError}
      >
        <LoadingButton bind:this={loadingButton} className="w-full block" type="submit">
          {getButtonText}
        </LoadingButton>
      </PayCard>
    </div>
  </Modal>
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmModal} on:yes={tryRegister} />
</div>
