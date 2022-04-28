<script lang="ts">
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import type { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
  import type { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
  import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
  import { UserType } from "@/application/enums/core/users/UserType";
  import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.svelte";
  import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.svelte";
  import UploadImage from "@/components/ui/uploaders/UploadImage.svelte";
  import supportedLocales from "@/locale/supportedLocales";
  import services from "@/services";
  import UserUtils from "@/utils/store/UserUtils";
  import { _ as t, locale } from "svelte-i18n";
  import { accountState } from "@/store/modules/accountStore";
  import { authStore } from "@/store/modules/authStore";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let confirmModal: ConfirmModal;

  const locales = supportedLocales;
  let selectedLocale = $locale;
  let showUploadImage = false;
  let uploadingImage = false;

  let id = $accountState.user?.id ?? "";
  let email = $accountState.user?.email ?? "";
  let loginType = $accountState.user?.loginType ?? "";
  let firstName = $accountState.user?.firstName ?? "";
  let lastName = $accountState.user?.lastName ?? "";
  let phone = $accountState.user?.phone ?? "";

  let passwordCurrent: string = "";
  let passwordNew: string = "";
  let passwordConfirm: string = "";

  function canChangePassword() {
    return loginType === UserLoginType.PASSWORD;
  }
  function changedLocale(value: string) {
    selectedLocale = value;
    services.users
      .updateLocale({ locale: value })
      .then(() => {
        window.location.reload();
      })
      .finally(() => {
        localStorage.setItem("locale", value);
        locale.set(value);
      });
  }
  function updateProfile() {
    const updateRequest: UserUpdateRequest = {
      firstName,
      lastName,
      phone,
    };
    services.users
      .update(id, updateRequest)
      .then(() => {
        successModal?.show($t("shared.updated"), $t("settings.profile.profileUpdated"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  function signOut() {
    authStore.logout();
    UserUtils.loggedOut();
  }
  function updatePassword() {
    services.users
      .updatePassword({
        passwordCurrent,
        passwordNew,
        passwordConfirm,
      })
      .then(() => {
        successModal?.show($t("shared.updated"), $t("settings.profile.passwordUpdated"));
        passwordCurrent = "";
        passwordNew = "";
        passwordConfirm = "";
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  function deleteAccount() {
    if ($accountState.user?.type === UserType.Admin) {
      errorModal?.show($t("settings.profile.errors.cannotDeleteAdmin"));
    } else {
      confirmModal?.show($t("settings.danger.confirmDelete"), $t("shared.confirm"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
    }
  }
  function confirmDelete() {
    services.users
      .deleteMe()
      .then(() => {
        UserUtils.loggedOut();
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  function loadedImage(event: any) {
    const image = event?.detail?.base64;
    const updateAvatar: UserUpdateAvatarRequest = {
      avatar: image,
    };
    uploadingImage = true;
    services.users
      .updateAvatar(updateAvatar)
      .then(() => {
        showUploadImage = false;
      })
      .catch((error) => {
        console.error("Error: " + JSON.stringify(error));
      })
      .finally(() => {
        uploadingImage = false;
      });
  }
  $: avatar = $accountState.user?.avatar;
</script>

<svelte:head>
  <title>{$t("settings.profile.profileTitle")} | Svelte SaasFrontend</title>
</svelte:head>

<div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
  <!--Profile -->
  <div>
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.profile.profileTitle")}</h3>
          <p class="mt-1 text-xs leading-5 text-gray-600">{$t("settings.profile.profileText")}</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form on:submit|preventDefault={updateProfile}>
          <div class="shadow overflow-hidden sm:rounded-sm">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-6 md:col-span-6">
                  <label for="email_address" class="block text-sm font-medium leading-5 text-gray-700">
                    {$t("account.shared.email")}
                  </label>
                  <input
                    value={email}
                    required
                    disabled={true}
                    type="email"
                    id="email_address"
                    class="bg-gray-100 mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
                <div class="col-span-6 md:col-span-3">
                  <label for="firstName" class="block text-sm font-medium leading-5 text-gray-700">
                    {$t("settings.profile.firstName")}
                  </label>
                  <input
                    id="firstName"
                    required
                    bind:value={firstName}
                    class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>

                <div class="col-span-6 md:col-span-3">
                  <label for="lastName" class="block text-sm font-medium leading-5 text-gray-700">
                    {$t("settings.profile.lastName")}
                  </label>
                  <input
                    bind:value={lastName}
                    id="lastName"
                    class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>

                <div class="col-span-6 sm:col-span-6">
                  <label for="avatar" class="block text-sm leading-5 font-medium text-gray-700">
                    {$t("shared.avatar")}
                  </label>
                  <div class="mt-2 flex items-center space-x-3">
                    <div class="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      {#if avatar}
                        <img id="avatar" alt="Avatar" src={avatar} />
                      {:else}
                        <svg id="avatar" class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      {/if}
                    </div>

                    <ButtonTertiary on:click={() => (showUploadImage = true)} type="button">
                      {$t("shared.upload")}
                    </ButtonTertiary>
                    {#if avatar}
                      <ButtonTertiary destructive={true} on:click={() => loadedImage(null)} type="button">
                        {$t("shared.delete")}
                      </ButtonTertiary>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              >
                {$t("shared.save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!--Separator -->
    <div class="block">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <!--Security -->
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.profile.securityTitle")}</h3>
          <p class="mt-1 text-xs leading-5 text-gray-600">
            {$t("account.login.forgot")}{" "}
            <a on:click={signOut} class="text-theme-600 font-bold hover:text-theme-500" href={"/forgot-password?e=" + email}>
              {$t("account.reset.button")}
            </a>
          </p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form on:submit|preventDefault={updatePassword}>
          <div class="shadow overflow-hidden sm:rounded-sm">
            {#if canChangePassword()}
              <div>
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-6">
                      <label for="passwordCurrent" class="block text-sm font-medium leading-5 text-gray-700">
                        {$t("settings.profile.passwordCurrent")}
                      </label>
                      <input
                        required={loginType === 0}
                        type="password"
                        id="passwordCurrent"
                        bind:value={passwordCurrent}
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                    <div class="col-span-6 md:col-span-3">
                      <label for="password" class="block text-sm font-medium leading-5 text-gray-700">
                        {$t("settings.profile.password")}
                      </label>
                      <input
                        required
                        type="password"
                        id="password"
                        bind:value={passwordNew}
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>

                    <div class="col-span-6 md:col-span-3">
                      <label for="passwordConfirm" class="block text-sm font-medium leading-5 text-gray-700">
                        {$t("settings.profile.passwordConfirm")}
                      </label>
                      <input
                        required
                        type="password"
                        bind:value={passwordConfirm}
                        id="passwordConfirm"
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  >
                    {$t("shared.save")}
                  </button>
                </div>
              </div>
            {:else}
              <div class="px-4 py-5 bg-white sm:p-6 block text-sm font-medium leading-5 text-gray-700">
                {$t("settings.profile.cannotChangePassword")}
              </div>
            {/if}
          </div>
        </form>
      </div>
    </div>

    <!--Separator -->
    <div class="block">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <!--Preferences -->
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.preferences.title")}</h3>
          <p class="mt-1 text-xs leading-5 text-gray-600">{$t("settings.preferences.description")}</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form>
          <div class="shadow sm:rounded-sm">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-6">
                  <label for="locale" class="block text-sm font-medium leading-5 text-gray-700">
                    {$t("settings.preferences.language")}
                  </label>
                  <select
                    id="locale"
                    required
                    bind:value={selectedLocale}
                    on:change={(e) => changedLocale(e.currentTarget.value)}
                    class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                  >
                    {#each locales as locale}
                      <option value={locale.lang}>
                        {locale.name}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!--Separator -->
    <div class="block">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>
    <!--Danger -->
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.danger.title")}</h3>
          <p class="mt-1 text-xs leading-5 text-gray-600">{$t("settings.danger.description")}</p>
        </div>
      </div>
      <div class="mt-12 md:mt-0 md:col-span-2">
        <form>
          <div class="bg-white shadow sm:rounded-sm">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{$t("settings.danger.deleteYourAccount")}</h3>
              <div class="mt-2 max-w-xl text-sm leading-5 text-gray-500">
                <p>{$t("settings.danger.onceYouDelete")}.</p>
              </div>
              <div class="mt-5">
                <ButtonPrimary destructive={true} on:click={deleteAccount} type="button">
                  {$t("settings.danger.deleteAccount")}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  {#if showUploadImage && !uploadingImage}
    <UploadImage on:close={() => (showUploadImage = false)} title={$t("shared.avatar")} initialImage={avatar} on:loaded={loadedImage} />
  {/if}
  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmModal} on:yes={confirmDelete} />
</div>
