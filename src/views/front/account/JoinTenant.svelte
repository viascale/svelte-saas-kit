<script lang="ts">
  import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
  import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
  import Logo from "@/components/front/Logo.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import services from "@/services";
  import { accountState } from "@/store/modules/accountStore";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { authStore } from "@/store/modules/authStore";
  import { Link, navigate } from "svelte-routing";
  import UserUtils from "@/utils/store/UserUtils";

  export let tenantId: string = "";

  const emailQueryParam = new URLSearchParams(window.location.search).get("e");

  let loadingButton: LoadingButton;
  let errorModal: ErrorModal;

  let loading: boolean = false;
  let tenant: TenantDto = {} as TenantDto;
  let requested: boolean = false;
  let accepted: boolean = false;

  let email: string = "";
  let password: string = "";
  let passwordConfirm: string = "";

  onMount(() => {
    email = currentEmail;

    if (!email) {
      email = emailQueryParam ?? "";
    }

    if (tenantId) {
      loading = true;
      services.tenantUserInvitations
        .getInviteURL(tenantId)
        .then((response: TenantDto) => {
          tenant = response;
        })
        .catch((error) => {
          if (error.status === 404) {
            errorModal?.show($t("shared.invalidInvitation"));
          }
        })
        .finally(() => {
          loading = false;
        });
    }
  });

  $: currentEmail = $accountState.user?.email;
  $: emailDisabled = currentEmail !== "";

  function accept() {
    if (!emailDisabled && password !== passwordConfirm) {
      errorModal?.show($t("account.login.errors.passwordMissmatch"));
      return;
    }
    loadingButton?.start();

    const user: UserVerifyRequest = {
      email,
      password,
      passwordConfirm,
    } as UserVerifyRequest;

    services.tenantUserInvitations
      .requestAccess(tenantId?.toString() ?? "", user)
      .then(() => {
        requested = true;
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
  function signOut() {
    authStore.logout();
    const pathname = location.pathname;
    UserUtils.loggedOut();
    navigate(pathname);
    email = "";
  }
</script>

<svelte:head>
  <title>{$t("account.join.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        {#if tenant && (tenant.logo || tenant.logoDarkmode)}
          <div>
            <Link to="/">
              <img alt="Logo" src={tenant.logo} class="mx-auto h-12 w-auto" />
            </Link>
          </div>
        {:else}
          <Logo className="mx-auto h-12 w-auto" />
        {/if}
      </div>

      {#if requested}
        <div>
          <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
              <h2 class="mt-6 text-center text-3xl leading-9 font-bold">{$t("account.invitation.successTitle")}</h2>
              <div class="my-4 leading-tight">
                <p class="mt-2 text-center text-sm leading-5 max-w">{$t("account.invitation.successText")}</p>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div>
          {#if loading}
            <div><!-- { $t("shared.loading") } --></div>
          {:else if !tenant}
            <div class="text-red-500 text-center">{$t("shared.invalidInvitation")}</div>
          {:else}
            <div />
          {/if}

          {#if tenant && tenant.name}
            <div>
              {#if emailDisabled && email}
                <div>
                  <p class="mt-2 text-center text-sm leading-5">
                    <button
                      on:click={signOut}
                      class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                      {$t("account.invitation.anotherEmail")}
                    </button>
                  </p>
                </div>
              {/if}
              <div class="mt-6 text-center text-lg leading-9 font-bold">
                {#if accepted}
                  <div>
                    {$t("account.invitation.acceptedUser", { values: { p1: tenant.name } })}{" "}
                    <p class="font-normal text-base">{$t("account.forgot.enterPassword")}</p>
                  </div>
                {:else}
                  <div>
                    <h2 class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
                      {$t("account.invitation.requestAccess")}
                      {tenant.name}
                    </h2>
                    <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                      {$t("account.register.alreadyRegistered")}{" "}
                      <span class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                        <Link to="/login">{$t("account.register.clickHereToLogin")}</Link>
                      </span>
                    </p>
                  </div>
                {/if}
              </div>

              <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="py-8 px-4 sm:rounded-sm sm:px-10">
                  <form on:submit|preventDefault={accept} class="sm:w-96">
                    <div>
                      <label for="email" class="block text-sm font-medium leading-5">
                        {$t("account.shared.email")}
                      </label>
                      <div class="mt-1 rounded-sm shadow-sm">
                        <input
                          disabled={emailDisabled}
                          bind:value={email}
                          id="email"
                          type="email"
                          required
                          class={classNames(
                            "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                            emailDisabled && "cursor-not-allowed bg-gray-100"
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <div class="mt-6">
                        <label for="password" class="block text-sm font-medium leading-5">
                          {$t("account.shared.password")}
                        </label>
                        <div class="mt-1 rounded-sm shadow-sm">
                          <input
                            bind:value={password}
                            id="password"
                            type="password"
                            required
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                          />
                        </div>
                      </div>
                      {#if !emailDisabled}
                        <div class="mt-6">
                          <label for="confirmPassword" class="block text-sm font-medium leading-5">
                            {$t("account.register.confirmPassword")}
                          </label>
                          <div class="mt-1 rounded-sm shadow-sm">
                            <input
                              bind:value={passwordConfirm}
                              id="confirmPassword"
                              type="password"
                              required
                              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                          </div>
                        </div>
                      {/if}
                    </div>

                    <div class="mt-6">
                      <span class="block w-full rounded-sm shadow-sm">
                        <LoadingButton bind:this={loadingButton} className="w-full block" type="submit">
                          {#if accepted} <span>{$t("shared.enter")}</span> {:else} <span>{$t("shared.request")}</span>{/if}
                        </LoadingButton>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <ErrorModal bind:this={errorModal} />
  </div>
</div>
