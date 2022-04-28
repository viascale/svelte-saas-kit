<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import services from "@/services";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import classNames from "@/utils/shared/ClassesUtils";
  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import { _ as t } from "svelte-i18n";
  import { appState } from "@/store/modules/appStore";
  import { tenantState } from "@/store/modules/tenantStore";
  const dispatch = createEventDispatcher();

  export let asProvider: boolean;
  export let selectType: boolean;

  let inputEmail: HTMLInputElement;
  let errorModal: ErrorModal;
  let confirmCreateLinkModal: ConfirmModal;
  let confirmInviteNewUserModal: ConfirmModal;
  let successModal: SuccessModal;

  let showing = false;
  let loading: boolean = false;
  let loadingSearching = false;
  let loadingLinking = false;
  let email: string = "";
  let workspaceName: string = "";
  let workspace: WorkspaceDto | null = null;
  let linkCreated: LinkDto | null = null;

  $: setFocus();
  const setFocus = () => {
    if (showing) {
      inputEmail?.focus();
      inputEmail?.select();
    }
  };

  export function show(_asProvider: boolean, _selectType: boolean) {
    asProvider = _asProvider;
    selectType = _selectType;
    workspace = null;
    email = "";
    workspaceName = "";

    showing = true;
    reload();
  }

  function reload() {
    loading = true;
    const promises: any[] = [];
    promises.push(services.tenants.getCurrentUsage(AppUsageType.ALL));
    promises.push(services.tenants.getFeatures());

    Promise.all(promises).finally(() => {
      loading = false;
      if (inputEmail) {
        inputEmail?.focus();
        inputEmail?.select();
      }
    });
  }

  function close() {
    showing = false;
  }
  function linkUserWorkspace() {
    if (!email || email.trim() === "" || !workspaceName || workspaceName.trim() === "") {
      errorModal?.show($t("shared.missingFields"));
      return;
    }
    loadingSearching = true;
    workspace = null;
    services.links
      .searchUser(email)
      .then(() => {
        searchWorkspace();
      })
      .catch(() => {
        confirmInviteNewUserModal?.show(
          $t("app.links.accountNotFound"),
          $t("shared.invite"),
          $t("shared.cancel"),
          $t("app.links.invitation.userNotRegistered", { values: { p1: email } })
        );
        loadingSearching = false;
      });
  }
  function searchWorkspace() {
    services.links
      .searchMember(email, workspaceName)
      .then(() => {
        createLink();
      })
      .catch(() => {
        errorModal?.show($t("shared.error"), $t("app.links.invitation.notFound", { values: { p1: email, p2: workspaceName } }));
      })
      .finally(() => {
        loadingSearching = false;
      });
  }
  function createLink() {
    const confirmText = workspace?.id ? $t("app.links.link") : $t("shared.invite");
    const inviteText = workspace?.id ? "" : $t("app.links.invitation.invite");
    if (asProvider) {
      confirmCreateLinkModal?.show($t("app.clients.new.add"), confirmText, $t("shared.cancel"), inviteText);
    } else {
      confirmCreateLinkModal?.show($t("app.providers.new.add"), confirmText, $t("shared.cancel"), inviteText);
    }
  }
  function confirmInviteNewUser() {
    loadingLinking = true;
    services.links
      .createInvitation({
        email,
        workspaceName,
        message: "",
        inviteeIsProvider: !asProvider,
      })
      .then(() => {
        successModal?.show($t("app.links.pending.invitationSent"), $t("app.links.pending.invitationSentDescription", { values: { p1: email } }));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loadingLinking = false;
      });
  }
  function confirmCreateLink() {
    loadingLinking = true;
    services.links
      .create({
        email,
        workspaceName,
        asProvider: !asProvider,
        // permissions: permissions.value
      })
      .then((response) => {
        linkCreated = response;
        successModal?.show(
          $t("app.links.pending.invitationSent"),
          $t("app.links.invited", {
            values: {
              p1: email,
              p2: asProvider ? $t("models.client.object") : $t("models.provider.object"),
              p3: currentWorkspace.name,
            },
          })
        );
        services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loadingLinking = false;
      });
  }
  function createdLink() {
    tinyEventBus().emitter.emit("reload-links");
    if (linkCreated) {
      dispatch("created", { linkCreated });
    }
    close();
  }

  $: maxLinks = $appState.features?.maxLinks;
  $: maxLinksReached = maxLinks > 0 && ($appState.usage?.providers ?? 0) + ($appState.usage?.clients ?? 0) >= maxLinks;
  $: currentWorkspace = $tenantState.currentWorkspace ?? ({} as WorkspaceDto);

  useEscapeKeypress(close);
</script>

<div>
  <div>
    {#if showing}
      <div class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-800 opacity-75" />
            </div>
          </transition>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" />
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="max-w-lg inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div class="just absolute top-0 right-0 -mt-4 pr-4">
                <button
                  on:click={close}
                  type="button"
                  class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
                >
                  <span class="sr-only">{$t("shared.close")}</span>
                  <svg
                    class="h-5 w-5 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="mt-3 space-y-4">
                <h3 class="font-bold text-lg pb-2 border-b border-gray-100">
                  {#if asProvider} <span>{$t("app.links.newClient")}</span> {:else} <span>{$t("app.links.newProvider")}</span>{/if}
                </h3>
                <div>
                  <div class="mx-auto">
                    <div class="md:col-span-2 space-y-4">
                      <div>
                        {#if loading}
                          <Loading />
                        {:else if maxLinksReached}
                          <div>
                            <WarningBanner
                              redirect="/app/settings/subscription"
                              title={$t("app.subscription.errors.limitReached")}
                              text={$t("app.subscription.errors.limitReachedLinks", { values: { p1: maxLinks } })}
                            />
                          </div>
                        {:else}
                          <div class="bg-white rounded space-y-3">
                            <form on:submit|preventDefault={linkUserWorkspace} class="space-y-4">
                              {#if selectType}
                                <div class="col-span-2 relative flex items-start select-none cursor-pointer">
                                  <div class="flex items-center h-5 cursor-pointer">
                                    <input
                                      id="asProvider"
                                      bind:checked={asProvider}
                                      aria-describedby="asProvider-description"
                                      name="asProvider"
                                      type="checkbox"
                                      class="cursor-pointer focus:ring-theme-500 h-4 w-4 text-theme-600 border-gray-300 rounded"
                                    />
                                  </div>
                                  <div class="ml-3 text-sm">
                                    <label for="asProvider" class="font-medium text-gray-700 cursor-pointer">
                                      {$t("app.links.imTheProvider")}
                                    </label>
                                  </div>
                                </div>
                              {/if}
                              <div class="sm:col-span-6 grid grid-cols-2 gap-2">
                                <div>
                                  <label for="email" class="block text-xs font-medium text-gray-700 truncate">
                                    {$t("account.shared.email")}
                                  </label>
                                  <div class="mt-1 flex rounded-md shadow-sm w-full">
                                    <input
                                      type="email"
                                      name="email"
                                      bind:this={inputEmail}
                                      id="email"
                                      autoComplete="off"
                                      required
                                      bind:value={email}
                                      class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label for="workspaceName" class="block text-xs font-medium text-gray-700 truncate">
                                    {$t("models.workspace.object")}
                                  </label>
                                  <div class="mt-1 flex rounded-md shadow-sm w-full">
                                    <input
                                      type="text"
                                      name="workspaceName"
                                      id="workspaceName"
                                      autoComplete="off"
                                      required
                                      bind:value={workspaceName}
                                      class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div class="flex items-center justify-between mt-4">
                                <div class="text-theme-700 text-sm">
                                  {#if loadingSearching}
                                    <div>{$t("shared.searching")}...</div>
                                  {:else if loadingLinking}
                                    <div>{$t("shared.creating")}...</div>
                                  {:else}
                                    <div />
                                  {/if}
                                </div>

                                <button
                                  disabled={loadingSearching || loadingLinking}
                                  class={classNames(
                                    "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                    (loadingSearching || loadingLinking) && "bg-gray-100 cursor-not-allowed"
                                  )}
                                  type="submit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>

                                  <div>{$t("shared.search")}</div>
                                </button>
                              </div>
                            </form>
                            {#if workspace}
                              <div>
                                <div class="py-5 px-4 bg-theme-100 w-full border border-theme-200 shadow-sm">
                                  <div class="flex items-center justify-between space-x-1">
                                    <div class="flex items-center space-x-2 text-theme-800 truncate">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        />
                                      </svg>
                                      <div class="truncate">
                                        <p class="text-base font-medium">{$t("app.links.accountFound")}</p>
                                        <p class="text-xs truncate">{workspaceName}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        on:click={createLink}
                                        class="ml-1 h-8 inline-flex items-center px-4 py-5 text-base leading-5 font-medium rounded-sm text-white bg-theme-800 hover:bg-theme-700 focus:outline-shadow active:bg-theme-900 transition duration-150 ease-in-out"
                                      >
                                        {$t("app.links.link", { values: { p1: email } })}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            {/if}
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    {/if}
  </div>
  <ConfirmModal bind:this={confirmCreateLinkModal} on:yes={confirmCreateLink} />
  <ConfirmModal bind:this={confirmInviteNewUserModal} on:yes={confirmInviteNewUser} />
  <SuccessModal bind:this={successModal} on:closed={createdLink} className="z-50 relative" />
  <ErrorModal className="z-50 relative" bind:this={errorModal} />
</div>
