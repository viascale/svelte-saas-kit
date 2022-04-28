<script lang="ts">
  import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
  import type { UserDto } from "@/application/dtos/core/users/UserDto";
  import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";

  import SelectUsers from "../users/SelectUsers.svelte";
  import classNames from "@/utils/shared/ClassesUtils";

  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { appState } from "@/store/modules/appStore";
  import { tenantState } from "@/store/modules/tenantStore";

  export let maxSize: string = "sm:max-w-lg";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let selectUsers: SelectUsers;
  let inputName: HTMLInputElement;

  let loading: boolean = false;
  let name: string = "";
  let businessMainActivity: string = "";
  let registrationNumber: string = "";
  let registrationDate: string = "";
  let type: WorkspaceType = WorkspaceType.PRIVATE;
  let users: UserDto[] = [];

  onMount(() => {
    if (inputName) {
      inputName?.focus();
      inputName?.select();
    }
  });
  function close() {
    navigate("/app/settings/workspaces");
  }
  function save() {
    if (users.length === 0) {
      errorModal?.show($t("shared.error"), $t("account.tenant.workspaces.errors.atLeastOneUser"));
      return;
    }
    loading = true;
    services.workspaces
      .create({
        name,
        type,
        businessMainActivity,
        registrationNumber,
        registrationDate: new Date(registrationDate ?? ""),
        users,
      })
      .then((response) => {
        tinyEventBus().emitter.emit("workspace-added", response);
        successModal?.show($t("shared.added"), $t("app.workspaces.added"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function selectWorkspaceUsers() {
    selectUsers?.show([]);
  }
  function selectedUsers(event: any) {
    users = event.detail.items;
  }
  function changedType(e: any) {
    const _type: WorkspaceType = Number(e.currentTarget.value);
    type = _type;
  }
  const currentUsersDescription = (users: UserDto[]) => {
    if (users.length === 0) {
      return $t("app.users.seletAtLeastOne");
    }
    return users.map((f) => `${f.firstName} (${f.email})`).join(", ");
  };
  $: maxWorkspaces = $appState.features?.maxWorkspaces ?? 0;
  $: maxWorkspacesReached = maxWorkspaces > 0 && ($tenantState.workspaces?.length ?? 0) >= maxWorkspaces;

  useEscapeKeypress(close);
</script>

<div>
  <div class="fixed inset-0 overflow-y-auto">
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
          class={classNames(
            "inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6",
            maxSize
          )}
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
              <svg class="h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-medium">{$t("app.workspaces.actions.new")}</h4>
            </div>
            {#if maxWorkspacesReached}
              <div>
                <WarningBanner
                  redirect="/app/settings/subscription"
                  title={$t("app.subscription.errors.limitReached")}
                  text={$t("app.subscription.errors.limitReachedWorkspaces", { values: { p1: maxWorkspaces } })}
                />
              </div>
            {:else if loading}
              <Loading />
            {:else}
              <form on:submit|preventDefault={save} class="space-y-4">
                <div class="grid grid-cols-2 gap-2">
                  <!--Workspace Name -->
                  <div class="col-span-2">
                    <label for="name" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.workspace.name")}
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm w-full">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        bind:this={inputName}
                        autoComplete="off"
                        required
                        disabled={loading}
                        bind:value={name}
                        class={classNames(
                          "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                          loading && "bg-gray-100 cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>
                  <!--Workspace Name: End -->

                  <!--Workspace Business Main Activity -->
                  <div class="col-span-2">
                    <label for="business-main-activity" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.workspace.businessMainActivity")}
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm w-full">
                      <input
                        type="text"
                        id="business-main-activity"
                        name="business-main-activity"
                        autoComplete="off"
                        required
                        bind:value={businessMainActivity}
                        class={classNames(
                          "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                          loading && "bg-gray-100 cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>
                  <!--Workspace Business Main Activity: End -->

                  <!--Workspace Type -->
                  <div class="col-span-2">
                    <label for="role" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.workspace.type")}
                    </label>
                    <div class="mt-1 rounded-md shadow-sm w-full">
                      <fieldset name="type" id="type">
                        <legend class="sr-only">{$t("models.workspace.type")}</legend>
                        <div class="bg-white rounded-md -space-y-px">
                          <label
                            class={classNames(
                              "rounded-tl-md rounded-tr-md relative border py-2 px-4 flex cursor-pointer focus:outline-none",
                              type === 0 && "bg-theme-50 border-theme-200 z-10",
                              type !== 0 && "border-gray-200"
                            )}
                          >
                            <input
                              type="radio"
                              name="workspace-type"
                              class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                              aria-labelledby="workspace-type-0-label"
                              aria-describedby="workspace-type-0-description"
                              value={0}
                              checked={type === 0}
                              on:change={changedType}
                            />
                            <div class="ml-3 flex flex-col">
                              <span
                                id="workspace-type-0-label"
                                class={classNames("block text-sm font-medium", type === 0 && "text-theme-900", type !== 0 && "text-gray-900")}
                              >
                                {$t("app.workspaces.types.PRIVATE")}
                              </span>

                              <span
                                id="workspace-type-0-description"
                                class={classNames("block text-sm", type === 0 && "text-theme-700", type !== 0 && "text-gray-500")}
                              >
                                {$t("app.workspaces.typesDescription.PRIVATE")}
                              </span>
                            </div>
                          </label>

                          <label
                            class={classNames(
                              "relative border py-2 px-4 flex cursor-pointer focus:outline-none",
                              type === 1 && "bg-theme-50 border-theme-200 z-10",
                              type !== 1 && "border-gray-200"
                            )}
                          >
                            <input
                              type="radio"
                              name="workspace-type"
                              class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                              aria-labelledby="workspace-type-1-label"
                              aria-describedby="workspace-type-1-description"
                              value={1}
                              checked={type === 1}
                              on:change={changedType}
                            />
                            <div class="ml-3 flex flex-col">
                              <span
                                id="workspace-type-1-label"
                                class={classNames("block text-sm font-medium", type === 1 && "text-theme-900", type !== 1 && "text-gray-900")}
                              >
                                {$t("app.workspaces.types.PUBLIC")}
                              </span>
                              <span
                                id="workspace-type-1-description"
                                class={classNames("block text-sm", type === 1 && "text-theme-700", type !== 1 && "text-gray-500")}
                              >
                                {$t("app.workspaces.typesDescription.PUBLIC")}
                              </span>
                            </div>
                          </label>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <!--Workspace Type: End -->

                  <!--Workspace Registration Number -->
                  {#if type === 1}
                    <div>
                      <label for="registration-number" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.workspace.registrationNumber")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="registration-number"
                          name="registration-number"
                          autoComplete="off"
                          required
                          bind:value={registrationNumber}
                          class={classNames(
                            "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                            loading && "bg-gray-100 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                  {/if}
                  <!--Workspace Registration Number: End -->

                  <!--Workspace Registration Date -->
                  {#if type === 1}
                    <div>
                      <label for="registration-date" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.workspace.registrationDate")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="date"
                          id="registration-date"
                          name="registration-date"
                          autoComplete="off"
                          required
                          bind:value={registrationDate}
                          class={classNames(
                            "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                            loading && "bg-gray-100 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                  {/if}
                  <!--Workspace Registration Date: End -->

                  <!--Workspace Users -->
                  <div class="col-span-2">
                    <label for="users" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.user.plural")}
                    </label>
                    <div class="mt-2 rounded-md w-full space-y-2">
                      <input
                        type="text"
                        id="users"
                        autoComplete="off"
                        disabled
                        value={currentUsersDescription(users)}
                        class="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                      />
                      <button type="button" on:click={selectWorkspaceUsers} class="flex items-center space-x-1 text-xs text-theme-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span class="uppercase font-medium">{$t("app.workspaces.actions.selectWorkspaceUsers")}</span>
                      </button>
                    </div>
                  </div>
                  <!--Workspace Users: End -->
                </div>

                <div class="flex items-center justify-between mt-4">
                  <div class="text-theme-700 text-sm">
                    {#if loading} <div>{$t("shared.loading")}...</div>{/if}
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      disabled={loading}
                      class={classNames(
                        "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                        loading && "bg-gray-100 cursor-not-allowed"
                      )}
                      type="button"
                      on:click={close}
                    >
                      <div>{$t("shared.cancel")}</div>
                    </button>
                    <button
                      disabled={loading}
                      class={classNames(
                        "inline-flex items-center px-3 py-2 border space-x-2 border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                      type="submit"
                    >
                      <div>{$t("shared.create")}</div>
                    </button>
                  </div>
                </div>
              </form>
            {/if}
          </div>
        </div>
      </transition>
    </div>
  </div>

  <ErrorModal bind:this={errorModal} />
  <SuccessModal bind:this={successModal} on:closed={close} />
  <SelectUsers bind:this={selectUsers} on:selected={selectedUsers} />
</div>
