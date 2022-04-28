<script lang="ts">
  import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
  import type { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
  import type { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
  import type { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
  import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
  import Logo from "@/components/front/Logo.svelte";
  import PayCard from "@/components/front/PayCard.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import Modal from "@/components/ui/modals/Modal.svelte";
  import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.svelte";
  import services from "@/services";
  import { pricingState, pricingStore } from "@/store/modules/pricingStore";
  import classNames from "@/utils/shared/ClassesUtils";
  import NumberUtils from "@/utils/shared/NumberUtils";
  import UserUtils from "@/utils/store/UserUtils";
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";
  import { Link } from "svelte-routing";

  const emailQueryParam = new URLSearchParams(window.location.search).get("e") ?? "";
  const selectPlanQueryParam = new URLSearchParams(window.location.search).get("p") ?? "";
  const invitationQueryParam = new URLSearchParams(window.location.search).get("i") ?? "";
  const couponQueryParam = new URLSearchParams(window.location.search).get("coupon") ?? "";

  let inputFirstName: HTMLInputElement;
  let buttonAcceptInvitation: HTMLButtonElement;
  let loadingButton: LoadingButton;
  let modalInvitation: Modal;
  let errorModal: ErrorModal;

  let cardModal: Modal;
  let confirmModalRegister: ConfirmModal;

  let loading: boolean = false;
  let registered: boolean = false;
  let couponCode: string = "";
  let coupon: any = null;
  let linkInvitation: LinkInvitationDto | null = null;
  let joinedByLinkInvitation: string = "";

  let emailEnabled: boolean = true;
  let workspaceNameEnabled: boolean = true;

  let acceptTermsAndConditions: boolean = false;

  let firstName: string = "";
  let lastName: string = "";
  let email: string = "";
  let password: string = "";
  let confirmPassword: string = "";
  let workspaceName: string = "";

  if (emailQueryParam) {
    email = emailQueryParam;
  }

  $: selectedProduct = $pricingState.selectedProduct;
  $: selectedPrice =
    selectedProduct?.prices.find((f) => f.billingPeriod === $pricingState.billingPeriod && f.currency === $pricingState.currency) ??
    selectedProduct?.prices.filter((f) => f.currency === $pricingState.currency)[0];

  onMount(() => {
    loading = true;
    services.subscriptionProducts
      .getProducts()
      .then(() => {
        if (selectPlanQueryParam) {
          const product = products.find((f) => f.tier === Number(selectPlanQueryParam));
          if (product) {
            pricingStore.setSelected({
              product,
              billingPeriod: selectedPrice?.billingPeriod ?? SubscriptionBillingPeriod.MONTHLY,
            });
          }
        }

        if (couponQueryParam) {
          // hasCoupon=(true);
          couponCode = couponQueryParam.toString();
          searchCoupon(false);
        }
        if (invitationQueryParam) {
          services.links.getInvitation(invitationQueryParam.toString()).then((response) => {
            linkInvitation = response;
            loadLinkInvitation(response);
          });
        }
      })
      .finally(() => {
        loading = false;
      });
    if (invitationQueryParam) {
      if (inputFirstName) {
        inputFirstName.focus();
        inputFirstName.select();
      }
    }
  });

  $: billingPeriod();
  const billingPeriod = (): string => {
    if (!selectedPrice) {
      return "";
    }
    if (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return $t("pricing.once").toString();
    } else {
      return "/ " + $t("pricing." + SubscriptionBillingPeriod[selectedPrice.billingPeriod] + "Short");
    }
  };

  function loadLinkInvitation(linkInvitation: LinkInvitationDto) {
    if (linkInvitation) {
      if (linkInvitation.status === LinkStatus.PENDING) {
        modalInvitation?.show();
        // nextTick(() => {
        buttonAcceptInvitation?.focus();
        // });
      }
    }
  }
  function rejectInvitation() {
    modalInvitation?.close();
    services.links.rejectInvitation(linkInvitation?.id);
    linkInvitation = null;
  }
  function acceptInvitation() {
    modalInvitation?.close();
    joinedByLinkInvitation = linkInvitation?.id;
    emailEnabled = false;
    workspaceNameEnabled = false;
    email = linkInvitation?.email ?? "";
    workspaceName = linkInvitation?.workspaceName ?? "";
    // nextTick(() => {
    if (inputFirstName) {
      inputFirstName?.focus();
      inputFirstName?.select();
    }
    // });
  }
  function searchCoupon(showError: boolean) {
    if (!selectedPrice) {
      return "";
    }
    if (!couponCode) {
      return;
    }
    services.subscriptionManager
      .getCoupon(couponCode, selectedPrice.currency)
      .then((response: SubscriptionCouponDto) => {
        coupon = response;
        // if (coupon && coupon.name) {
        //   couponDescription=(coupon.name.toString());
        // }
      })
      .catch((error) => {
        // couponDescription=(t("account.register.invalidCoupon").toString());
        if (showError) {
          errorModal?.show($t("shared.error"), $t(error));
        }
      });
  }
  function tryRegister() {
    if (password !== confirmPassword) {
      errorModal?.show($t("shared.error"), $t("api.errors.passwordMismatch"));
      return;
    }
    if (!selectedPrice) {
      errorModal?.show($t("shared.error"), $t("account.register.errors.priceNotSelected"));
      return;
    }
    if (!acceptTermsAndConditions) {
      errorModal?.show($t("shared.error"), $t("account.register.errors.acceptTermsAndConditions"));
      return;
    }
    console.log("try1");
    if (selectedPrice.trialDays === 0 && selectedPrice.price > 0) {
      console.log("try2");
      cardModal?.show();
    } else {
      console.log("try3");
      confirmModalRegister?.show(
        $t("account.register.prompts.register.title"),
        $t("shared.confirm"),
        $t("shared.back"),
        $t("account.register.prompts.register.description", { values: { p1: $t(selectedProduct?.title ?? "") } })
      );
    }
  }
  function confirmedRegister() {
    register();
  }
  function payError(event: any) {
    const error: string = event.detail.error;
    cardModal?.close();
    errorModal?.show($t("shared.error"), $t(error));
  }
  function payed(event: any) {
    const error: any = event.detail.error;
    const data: any = event.detail.data;
    cardModal?.close();
    if (error) {
      errorModal?.show($t("shared.error"), data.error.message);
    } else if (data?.token) {
      register(data.token.id);
    }
  }
  function register(cardToken = "") {
    if (!selectedPrice) {
      errorModal?.show($t("shared.error"), $t("account.register.errors.priceNotSelected"));
      return;
    } else if (selectedPrice && !selectedPrice.id) {
      errorModal?.show($t("shared.error"), $t("account.register.errors.priceNotInDatabase"));
      return;
    }
    const user: UserRegisterRequest = {
      email,
      selectedSubscription: {
        subscriptionPriceId: selectedPrice.id ?? "",
        subscriptionCardToken: cardToken,
        subscriptionCoupon: couponCode,
      },
      password,
      confirmPassword,
      firstName,
      lastName,
      loginType: UserLoginType.PASSWORD,
      workspaceName,
      joinedByLinkInvitation,
    } as UserRegisterRequest;
    user.selectedSubscription = {
      subscriptionPriceId: selectedPrice.id ?? "",
      subscriptionCardToken: cardToken,
      subscriptionCoupon: couponCode,
    };
    loadingButton?.start();
    services.authentication
      .register(user)
      .then((response: UserLoggedResponse) => {
        registered = true;
        UserUtils.logged(response);
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), error);
      })
      .finally(() => {
        if (loadingButton) {
          loadingButton?.stop();
        }
      });
  }
  function toggleAcceptTerms() {
    acceptTermsAndConditions = !acceptTermsAndConditions;
  }
  function intFormat(value: number) {
    return NumberUtils.intFormat(value);
  }
  $: products = $pricingState.products;
  $: discountedPrice = (): number => {
    if (!selectedPrice) {
      return 0;
    }
    let price = selectedPrice.price;
    if (coupon) {
      if (coupon.amountOff && selectedPrice.currency === coupon.currency) {
        price = price - coupon.amountOff / 100;
      } else if (coupon.percentOff) {
        price = Number((price * ((100 - coupon.percentOff) / 100)).toFixed(2));
      }
    }
    return price;
  };

  $: priceDescription();
  const priceDescription = (): string => {
    if (!selectedPrice) {
      return "";
    }
    return "$" + intFormat(discountedPrice()) + " " + selectedPrice.currency + " " + billingPeriod();
  };
  $: getButtonText();
  const getButtonText = (): string => {
    if (!selectedPrice) {
      return "";
    }
    return (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? $t("pricing.pay") : $t("pricing.subscribe")) + " " + priceDescription();
  };
</script>

<svelte:head>
  <title>{$t("account.register.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo className="mx-auto h-12 w-auto" />
      {#if !registered}
        <div>
          <h2 class="mt-6 text-center text-lg leading-9 font-bold text-gray-800 dark:text-slate-200">{$t("account.register.title")}</h2>
          <p class="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">
            {$t("account.register.alreadyRegistered")}{" "}
            <span class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
              <Link to="/login">{$t("account.register.clickHereToLogin")}</Link>
            </span>
          </p>

          <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="py-0 px-0 sm:rounded-sm sm:px-10">
              <form on:submit|preventDefault={tryRegister} class="space-y-6">
                <!-- Workspace -->
                <div>
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="block text-sm font-medium">{$t("account.register.organization")}</label>

                  <div class="mt-1 rounded-md shadow-sm -space-y-px">
                    <div>
                      <label for="company" class="sr-only">
                        {$t("models.workspace.object")}
                      </label>
                      <input
                        bind:value={workspaceName}
                        type="text"
                        name="company"
                        id="company"
                        placeholder={$t("models.workspace.name")}
                        required
                        onInput={(e) => (workspaceName = e.currentTarget.value)}
                        disabled={!workspaceNameEnabled}
                        class={classNames(
                          "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                          !workspaceNameEnabled && "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>
                </div>
                <!-- Workspace: End  -->

                <!-- Personal Info -->
                <div>
                  <legend class="block text-sm font-medium">{$t("account.register.personalInfo")}</legend>
                  <div class="mt-1 rounded-sm shadow-sm -space-y-px">
                    <div class="flex">
                      <div class="w-1/2">
                        <label for="first-name" class="sr-only">
                          {$t("models.user.firstName")}
                        </label>
                        <input
                          bind:value={firstName}
                          bind:this={inputFirstName}
                          type="text"
                          name="first-name"
                          id="first-name"
                          required
                          class="appearance-none rounded-none rounded-tl-md relative block w-full px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                          placeholder={$t("account.register.firstName")}
                        />
                      </div>
                      <div class="w-1/2">
                        <label for="last-name" class="sr-only">
                          {$t("models.user.lastName")}
                        </label>
                        <input
                          bind:value={lastName}
                          type="text"
                          name="last-name"
                          id="last-name"
                          required
                          class="appearance-none rounded-none rounded-tr-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                          placeholder={$t("account.register.lastName")}
                        />
                      </div>
                    </div>
                    <div>
                      <label for="email" class="sr-only">
                        {$t("models.user.email")}
                      </label>
                      <input
                        bind:value={email}
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        required
                        placeholder={$t("account.shared.email")}
                        disabled={!emailEnabled}
                        class={classNames(
                          "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                          !emailEnabled && "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                        )}
                      />
                    </div>
                    <input
                      bind:value={password}
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder={$t("account.register.password")}
                      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                    <input
                      bind:value={confirmPassword}
                      id="confirmPassword"
                      type="password"
                      autoComplete="off"
                      required
                      placeholder={$t("account.register.confirmPassword")}
                      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <!-- Personal Info: End -->

                <PlansRadioButtons />

                <div class="mt-2 flex items-center space-x-3">
                  <button
                    aria-label="accept-terms-and-conditions"
                    type="button"
                    on:click={toggleAcceptTerms}
                    role="switch"
                    aria-checked="false"
                    class={classNames(
                      "relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500",
                      acceptTermsAndConditions && "bg-theme-600 dark:bg-theme-400",
                      !acceptTermsAndConditions && "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span class="sr-only">{$t("app.workspaces.types.PUBLIC")}</span>
                    <span
                      class={classNames(
                        "translate-x-0 pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200",
                        acceptTermsAndConditions && "translate-x-4",
                        !acceptTermsAndConditions && "translate-x-0"
                      )}
                    >
                      <!-- Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" -->
                      <span
                        aria-hidden="true"
                        class={classNames(
                          "opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
                          acceptTermsAndConditions && "hidden opacity-0 ease-out duration-100",
                          !acceptTermsAndConditions && "opacity-100 ease-in duration-200"
                        )}
                      >
                        <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                          <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" -->
                      <span
                        aria-hidden="true"
                        class={classNames(
                          "opacity-0 ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
                          acceptTermsAndConditions && "opacity-100 ease-in duration-200",
                          !acceptTermsAndConditions && "hidden opacity-0 ease-out duration-100"
                        )}
                      >
                        <svg class="h-3 w-3 text-theme-600 dark:text-theme-400" fill="currentColor" viewBox="0 0 12 12">
                          <path
                            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                  <span class="flex-grow flex flex-col">
                    <span class="text-sm font-normal dark:bg-gray-900 text-gray-800 dark:text-slate-200" id="accept-terms-and-conditions">
                      {$t("account.register.acceptTerms")}
                    </span>
                  </span>
                </div>

                {#if !loading}
                  <div class="mt-3">
                    <span class="block w-full rounded-sm shadow-sm">
                      <LoadingButton bind:this={loadingButton} className="w-full block" type="submit">
                        {#if selectedPrice && selectedPrice.price === 0}
                          <span>{$t("pricing.signUpFree")}</span>
                        {:else if selectedPrice && selectedPrice.trialDays > 0}
                          <span>{$t("account.register.startTrial", { values: { p1: selectedPrice.trialDays } })}</span>
                        {:else if !getButtonText()}
                          <span>{$t("settings.subscription.plans.select")}</span>
                        {:else}
                          <span>{getButtonText()}</span>
                        {/if}
                      </LoadingButton>
                    </span>
                  </div>
                {/if}

                <p class="mt-3 py-2 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700">
                  {$t("account.register.bySigningUp")}{" "}
                  <a target="_blank" href="/terms-and-conditions" class="text-theme-500 underline">
                    {$t("account.register.termsAndConditions")}
                  </a>{" "}
                  {$t("account.register.andOur")}{" "}
                  <a target="_blank" href="/privacy-policy" class="text-theme-500 underline">
                    {$t("account.register.privacyPolicy")}
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      {:else}
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white dark:bg-slate-800 max-w-sm w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
            <h2 class="mt-6 text-center text-3xl leading-9 font-bold text-gray-800 dark:text-slate-200">
              {$t("account.register.successTitle")}
            </h2>
            <div class="my-4 leading-tight">
              <p class="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">{$t("account.register.successText")}</p>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <Modal bind:this={modalInvitation}>
      {#if linkInvitation && linkInvitation.createdByUser && linkInvitation.createdByWorkspace}
        <div class="space-y-6 text-gray-900">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-theme-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-theme-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium" id="modal-title">
              {$t("app.links.invitation.toBe")}{" "}
              {#if linkInvitation.inviteeIsProvider}
                <span class="font-bold text-theme-600">{$t("models.provider.object")}</span>
              {:else}
                <span class="font-bold text-theme-600">{$t("models.client.object")}</span>
              {/if}
            </h3>
            <div class="mt-4 text-left">
              <p class="font-normal text-base">
                {linkInvitation.createdByUser.firstName} (<span class="italic text-gray-600">{linkInvitation.createdByUser.email})</span>{" "}
                {$t("app.links.invitation.hasInvitedYou")} <span class="font-bold">{linkInvitation.createdByWorkspace.name}</span>{" "}
                {$t("app.links.invitation.andYourCompany")} <span class="font-bold">{linkInvitation.workspaceName}</span>{" "}
                {#if linkInvitation.inviteeIsProvider}
                  <span>{$t("app.links.invitation.reasonAsProvider")}.</span>
                {:else}
                  return <span>{$t("app.links.invitation.reasonAsClient")}.</span>
                {/if}
              </p>
            </div>
            {#if linkInvitation.message}
              <div class="mt-4 text-left bg-gray-50 border border-gray-300 py-2 px-2">
                <p class="font-normal text-base text-gray-600">
                  <span class="font-medium">
                    {$t("app.links.invitation.message")}
                    {linkInvitation.createdByUser.firstName}
                  </span>
                  : {linkInvitation.message}
                </p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          bind:this={buttonAcceptInvitation}
          on:click={acceptInvitation}
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-600 text-base font-medium text-white hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:col-start-2 sm:text-sm"
        >
          {$t("shared.accept")}
        </button>
        <button
          on:click={rejectInvitation}
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:mt-0 sm:col-start-1 sm:text-sm"
        >
          {$t("shared.reject")}
        </button>
      </div>
    </Modal>
    <Modal bind:this={cardModal}>
      <div>
        <PayCard on:payed={payed} on:error={payError}>
          <LoadingButton className="w-full block" type="submit">
            {getButtonText()}
          </LoadingButton>
        </PayCard>
      </div>
    </Modal>
    <ConfirmModal bind:this={confirmModalRegister} on:yes={confirmedRegister} />
    <ErrorModal bind:this={errorModal} />
  </div>
</div>
