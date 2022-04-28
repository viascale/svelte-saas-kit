<script lang="ts">
  import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
  import Logo from "@/components/front/Logo.svelte";
  import LoadingButton from "@/components/ui/buttons/LoadingButton.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import services from "@/services";
  import classNames from "@/utils/shared/ClassesUtils";
  import UserUtils from "@/utils/store/UserUtils";
  import { Link } from "svelte-routing";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";

  const emailQueryParam = new URLSearchParams(window.location.search).get("e") ?? "";
  const tokenQueryParam = new URLSearchParams(window.location.search).get("t") ?? "";

  let loadingButton: LoadingButton;
  let errorModal: ErrorModal;

  const requireName = false;
  const requirePassword = true;

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let passwordConfirm = "";
  let token = "";

  onMount(() => {
    email = emailQueryParam;
    token = tokenQueryParam;
  });

  function verify() {
    if (password !== passwordConfirm) {
      errorModal?.show($t("account.login.errors.passwordMissmatch"));
      return;
    }

    const verify: UserVerifyRequest = {
      email,
      password,
      passwordConfirm,
      token,
    } as UserVerifyRequest;

    loadingButton?.start();
    services.authentication
      .verify(verify)
      .then((response) => {
        UserUtils.logged(response);
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
</script>

<svelte:head>
  <title>{$t("account.verify.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo className="mx-auto h-12 w-auto" />
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">{$t("account.verify.title")}</h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
          {$t("account.register.alreadyRegistered")}{" "}
          <span class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
            <Link to="/login">{$t("account.register.clickHereToLogin")}</Link>
          </span>
        </p>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="sm:rounded-sm sm:px-10">
            <form on:submit|preventDefault={verify}>
              <div>
                <label for="email" class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                  {$t("account.shared.email")}
                </label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    class={classNames(
                      "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                      "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                    )}
                    bind:value={email}
                    id="email"
                    type="email"
                    required
                  />
                </div>
              </div>
              {#if requireName}
                <div class="mt-6">
                  <label for="firstName" class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                    {$t("account.register.firstName")}
                  </label>
                  <div class="mt-1 rounded-sm shadow-sm">
                    <input
                      bind:value={firstName}
                      id="firstName"
                      type="text"
                      required
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              {/if}
              {#if requireName}
                <div class="mt-6">
                  <label for="lastName" class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                    {$t("account.register.lastName")}
                  </label>
                  <div class="mt-1 rounded-sm shadow-sm">
                    <input
                      bind:value={lastName}
                      id="lastName"
                      type="text"
                      required
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              {/if}
              {#if requirePassword}
                <div class="mt-6">
                  <label for="password" class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
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
                  <label for="confirmPassword" class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
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
                  <LoadingButton bind:this={loadingButton} className="w-full block" type="submit">
                    {$t("account.verify.button")}
                  </LoadingButton>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal bind:this={errorModal} />
  </div>
</div>
