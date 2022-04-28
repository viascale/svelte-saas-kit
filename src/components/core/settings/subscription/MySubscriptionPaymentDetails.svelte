<script lang="ts">
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import PayCard from "@/components/front/PayCard.svelte";
  import services from "@/services";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";

  export let className: string = "";

  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";

  let successModal: SuccessModal;
  let errorModal: ErrorModal;
  let loadingButton: LoadingButton;

  let editing: boolean = false;
  // let stripeKey = "";
  // let stripeOptions = {};
  // const [complete, setComplete] = useState(false);

  // stripeKey = import.meta.env.VITE_SVELTE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
  // stripeOptions = {
  //   showCardHolderName: true,
  //   hidePostalCode: false,
  //   iconStyle: "solid",
  //   elements: {
  //     locale: i18n.language,
  //   },
  // };

  // function updatePaymentDetails() {
  //   loadingButton?.start();
  //   // todo
  //   // createToken()
  //   //   .then((data) => {
  //   //     if (data.error) {
  //   //       errorModal?.show(data.error.message);
  //   //       if (loadingButton.value) {
  //   //         loadingButton.value?.stop();
  //   //       }
  //   //     } else {
  //   //       if (data.token.id && data.token.id !== "") {
  //   //         updateCardToken(data.token.id);
  //   //       }
  //   //     }
  //   //   })
  //   //   .catch((error) => {
  //   //     errorModal?.show($t("shared.error"), $t(error));
  //   //   })
  //   //   .finally(() => {
  //   //     if (loadingButton.value) {
  //   //       loadingButton.value?.stop();
  //   //     }
  //   //     editing.value = false;
  //   //   });
  // }
  function updateCardToken(event: any) {
    const error: any = event.detail.error;
    const data: any = event.detail.data;
    if (error) {
      errorModal?.show($t("shared.error"), error);
    } else {
      services.subscriptionManager
        .updateCardToken(data.token.id)
        .then(() => {
          services.subscriptionManager.getCurrentSubscription();
          successModal?.show($t("shared.updated"), $t("settings.tenant.payment.updated"));
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), error);
        })
        .finally(() => {
          if (loadingButton) {
            loadingButton?.stop();
          }
          editing = false;
        });
    }
  }
  const subscriptionCard =
    $tenantState.subscription?.paymentMethods && $tenantState.subscription?.paymentMethods.length > 0
      ? $tenantState?.subscription?.paymentMethods[0].card
      : undefined;

  $: subscriptionCardLast4 = () => {
    return subscriptionCard?.lastFourDigits;
  };
  $: subscriptionCardExpDesc = () => {
    return ("0" + subscriptionCard?.expiryMonth).slice(-2) + " / " + subscriptionCard?.expiryYear;
  };
</script>

<div class={className}>
  <div class="shadow overflow-hidden sm:rounded-sm">
    <div class="px-4 py-5 bg-white sm:p-6">
      <div class="grid grid-cols-6 gap-2">
        <div class="col-span-6 sm:col-span-6 w-full">
          <span id="listbox-label" class="flex justify-between leading-5 font-medium text-gray-900 mb-4">
            {$t("settings.tenant.payment.title")}
          </span>
          {#if subscriptionCard && !editing}
            <div class="text-gray-600 text-sm font-semibold">
              <span class="uppercase">{subscriptionCard.brand}</span>
              {$t("settings.tenant.payment.ending")} **** {subscriptionCardLast4()} -{" "}
              {subscriptionCardExpDesc()}
            </div>
          {:else}
            <div>
              {#if editing}
                <div id="card-element">
                  <PayCard
                    on:payed={updateCardToken}
                    on:error={(event) => {
                      errorModal?.show($t("shared.error"), $t(event.detail.error));
                    }}
                  >
                    <LoadingButton bind:this={loadingButton} className="w-full block" type="submit">
                      {$t("shared.confirm")}
                    </LoadingButton>
                  </PayCard>
                  <!-- 

                      TODO
                      <card
                        ref="card"
                        class="stripe-card w-full"
                        :class="complete ? 'border-1 border-green-100' : ''"
                      :stripe="stripeKey"
                      :options="stripeOptions"
                      on:change={() => complete = $event.complete}
                  /> -->
                </div>
              {:else}
                <div class="text-red-500 text-sm">{$t("settings.tenant.payment.notSet")}</div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <ButtonSecondary on:click={() => (editing = !editing)}>
        <span>{!editing ? $t("shared.edit") : $t("shared.cancel")}</span>
      </ButtonSecondary>

      <!-- {#if editing}
            <LoadingButton
              class="w-auto ml-3 py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-sm text-white bg-gray-800 shadow-sm hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
              clicked={updatePaymentDetails}
              bind:this={loadingButton}
            >
              {$t("shared.save")}
            </LoadingButton>
          {/if} -->
    </div>
  </div>

  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
</div>
