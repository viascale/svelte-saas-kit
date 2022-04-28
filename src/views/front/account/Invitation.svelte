<script lang="ts">
  import type { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
  import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
  import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
  import Logo from "@/components/front/Logo.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import services from "@/services";

  import UserUtils from "@/utils/store/UserUtils";

  import { Link } from "svelte-routing";

  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { authStore } from "@/store/modules/authStore";

  const emailQueryParam = new URLSearchParams(window.location.search).get("e");
  const invitationQueryParam = new URLSearchParams(window.location.search).get("i");

  let loadingButton: LoadingButton;
  let errorModal: ErrorModal;

  let loading: boolean = false;
  let email = "";
  let token = "";
  let password = "";
  let passwordConfirm = "";
  let requirePassword = true;
  let invitation: TenantUserDto | null = null;
  let tenant: TenantDto = {} as TenantDto;

  onMount(() => {
    token = invitationQueryParam?.toString() ?? "";
    email = emailQueryParam?.toString() ?? "";

    if (invitationQueryParam) {
      loading = true;
      services.tenantUserInvitations
        .getInvitation(invitationQueryParam)
        .then((response: TenantInvitationResponse) => {
          invitation = response.invitation;
          tenant = response.tenant;
          requirePassword = response.requiresVerify;
        })
        .finally(() => {
          loading = false;
        });
    }
  });

  function accept() {
    if (password !== passwordConfirm) {
      errorModal?.show($t("api.errors.passwordMismatch"));
      return;
    }

    loadingButton?.start();
    services.tenantUserInvitations
      .acceptInvitation(invitationQueryParam ?? "", {
        email,
        token,
        password,
        passwordConfirm,
      })
      .then((response) => {
        authStore.login(response);
        UserUtils.logged(response);
        window.location.reload();
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
        if (loadingButton) {
          loadingButton?.stop();
        }
      });
  }
</script>

<svelte:head>
  <title>{$t("account.invitation.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        {#if tenant && (tenant.logo || tenant.logoDarkmode)}
          <div>
            <Link to="/">
              <img alt="Logo" src={tenant.logo} class="mx-auto h-16 w-auto" />
            </Link>
          </div>
        {:else}
          <Logo className="mx-auto h-12 w-auto" />
        {/if}
      </div>
      {#if loading}
        <div />
      {:else if !invitation || !invitation.user}
        <div class="text-red-500 text-center">{$t("shared.invalidInvitation")}</div>
      {:else}
        <div>
          <h2 class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
            {$t("shared.hi")}
            {invitation.user.firstName ? invitation.user.firstName : invitation.user.email}, {$t("account.invitation.youWereInvited")}{" "}
            {invitation.tenant.name}
          </h2>
          <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
            {$t("account.register.alreadyRegistered")}{" "}
            <span class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
              <Link to="/login">{$t("account.register.clickHereToLogin")}</Link>
            </span>
          </p>

          <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="py-8 px-4 sm:rounded-sm sm:px-10">
              <form on:submit|preventDefault={accept} class="sm:w-96">
                <div>
                  <label for="email" class="block text-sm font-medium leading-5">
                    {$t("account.shared.email")}
                  </label>
                  <div class="mt-1 rounded-sm shadow-sm">
                    <input
                      disabled={true}
                      bind:value={email}
                      id="email"
                      type="email"
                      required
                      class="bg-gray-100 dark:bg-slate-800 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                {#if requirePassword}
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
                {/if}
                {#if requirePassword}
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

                <div class="mt-6">
                  <span class="block w-full rounded-sm shadow-sm">
                    <LoadingButton className="w-full block" type="submit" bind:this={loadingButton}>
                      {$t("account.invitation.button")}
                    </LoadingButton>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <ErrorModal bind:this={errorModal} />
  </div>
</div>
