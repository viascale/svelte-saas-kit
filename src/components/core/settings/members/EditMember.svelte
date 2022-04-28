<script lang="ts">
  import { onMount } from "svelte";
  import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";

  import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
  import SelectWorkspaces from "../../workspaces/SelectWorkspaces.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import { tenantState } from "@/store/modules/tenantStore";

  export let id: string = "";
  export let maxSize: string = "sm:max-w-lg";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let selectWorkspaces: SelectWorkspaces;
  let confirmRemove: ConfirmModal;

  let item: TenantUserDto | null = null;
  let loading: boolean = false;
  let email: string = "";
  let firstName: string = "";
  let lastName: string = "";
  let phone: string = "";
  let role: TenantUserRole = TenantUserRole.MEMBER;
  let workspaces: WorkspaceDto[] = [];
  const roleOptions = [
    {
      value: TenantUserRole.OWNER,
      name: $t("settings.profile.roles.OWNER"),
      description: $t("settings.profile.permissions.OWNER"),
    },
    {
      value: TenantUserRole.ADMIN,
      name: $t("settings.profile.roles.ADMIN"),
      description: $t("settings.profile.permissions.ADMIN"),
    },
    {
      value: TenantUserRole.MEMBER,
      name: $t("settings.profile.roles.MEMBER"),
      description: $t("settings.profile.permissions.MEMBER"),
    },
    {
      value: TenantUserRole.GUEST,
      name: $t("settings.profile.roles.GUEST"),
      description: $t("settings.profile.permissions.GUEST"),
    },
  ];

  onMount(() => {
    loading = true;
    services.tenantUsers
      .get(id ?? "")
      .then((response) => {
        item = response;
        email = response.email;
        firstName = response.firstName;
        lastName = response.lastName;
        role = response.role;
        phone = response.phone;
        workspaces = [];
        response.user?.workspaces?.forEach((element) => {
          if (element.workspace) {
            workspaces = [...workspaces, element.workspace];
          }
        });
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  });
  function close() {
    navigate("/app/settings/members");
  }
  function save() {
    if (workspaces.length === 0) {
      errorModal?.show($t("shared.error"), $t("account.tenant.members.errors.atLeastOneWorkspace"));
      return;
    }
    loading = true;
    services.tenantUsers
      .update(id ?? "", {
        phone: phone,
        role: role,
        workspaces: workspaces,
      })
      .then(() => {
        tinyEventBus().emitter.emit("user-saved", item);
        successModal?.show($t("shared.updated"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function remove() {
    confirmRemove?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"));
  }
  function yesRemove() {
    if (currentRole === TenantUserRole.MEMBER || currentRole === TenantUserRole.GUEST) {
      errorModal?.show($t("account.tenant.onlyAdmin"));
    } else {
      loading = true;
      services.tenantUsers
        .delete(id ?? "")
        .then(() => {
          tinyEventBus().emitter.emit("user-deleted", item);
          navigate("/app/settings/members");
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loading = false;
        });
    }
  }
  function selectUserWorkspaces() {
    selectWorkspaces?.show(workspaces.map((f) => f.id));
  }
  function selectedWorkspaces(event: any) {
    workspaces = event.detail.items;
  }
  function changedRole(e: any) {
    const _role: TenantUserRole = Number(e.currentTarget.value);
    role = _role;
  }
  $: currentRole = $tenantState.current?.currentUser.role;
  const currentWorkspacesDescription = (workspaces: WorkspaceDto[]) => {
    if (workspaces.length === 0) {
      return $t("app.workspaces.seletAtLeastOne");
    }
    return workspaces.map((f) => f.name).join(", ");
  };

  useEscapeKeypress(close);
</script>

<div>
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
                <h4 class="text-lg font-medium">{$t("settings.members.actions.edit")}</h4>
              </div>

              {#if loading}
                <Loading />
              {:else if !item}
                <div>{$t("shared.notFound")}</div>
              {:else if item}
                <form on:submit|preventDefault={save} class="space-y-4">
                  <div class="grid grid-cols-2 gap-2">
                    <!--Email -->
                    <div class="col-span-2">
                      <label for="email" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.user.email")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="off"
                          disabled
                          bind:value={email}
                          class={classNames(
                            "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                            true && "bg-gray-100 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                    <!--Email: End -->

                    <!--User First Name -->
                    <div>
                      <label for="first-name" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.user.firstName")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="first-name"
                          name="first-name"
                          autoComplete="off"
                          disabled
                          bind:value={firstName}
                          class={classNames(
                            "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                            true && "bg-gray-100 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                    <!--User First Name: End -->

                    <!--User Last Name -->
                    <div>
                      <label for="last-name" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.user.lastName")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="last-name"
                          name="last-name"
                          autoComplete="off"
                          disabled
                          bind:value={lastName}
                          class={classNames(
                            "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                            true && "bg-gray-100 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                    <!--User Last Name: End -->

                    <!--User Role -->
                    <div class="col-span-2">
                      <label for="last-name" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.user.role")}
                      </label>
                      <div class="mt-1 rounded-md shadow-sm w-full">
                        <fieldset>
                          <legend class="sr-only">{$t("models.user.role")}</legend>
                          <div class="bg-white rounded-md -space-y-px">
                            {#each roleOptions as option, idxRole}
                              <label
                                class={classNames(
                                  "rounded-tl-md rounded-tr-md relative border py-2 px-4 flex cursor-pointer focus:outline-none",
                                  role === option.value && "bg-theme-50 border-theme-200 z-10",
                                  role !== option.value && "border-gray-200",
                                  idxRole === 0 && "rounded-tl-md rounded-tr-md",
                                  idxRole === roleOptions.length - 1 && "rounded-bl-md rounded-br-md"
                                )}
                              >
                                <input
                                  type="radio"
                                  name="tenant-user-role"
                                  class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                  aria-labelledby="tenant-user-role-0-label"
                                  aria-describedby="tenant-user-role-0-description"
                                  value={option.value}
                                  checked={role === option.value}
                                  on:change={changedRole}
                                />
                                <div class="ml-3 flex flex-col">
                                  <span
                                    id="tenant-user-role-0-label"
                                    class={classNames(
                                      "block text-sm font-medium",
                                      role === option.value && "text-theme-900",
                                      role !== option.value && "text-gray-900"
                                    )}
                                  >
                                    {option.name}
                                  </span>

                                  <span
                                    id="tenant-user-role-0-description"
                                    class={classNames("block text-sm", role === option.value && "text-theme-700", role !== option.value && "text-gray-500")}
                                  >
                                    {option.description}
                                  </span>
                                </div>
                              </label>
                            {/each}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <!--User Role: End -->

                    <!--User Workspaces -->
                    <div class="col-span-2">
                      <label for="description" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.workspace.plural")}
                      </label>
                      <div class="mt-2 rounded-md w-full space-y-2">
                        <input
                          type="text"
                          id="description"
                          autoComplete="off"
                          disabled
                          value={currentWorkspacesDescription(workspaces)}
                          class="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                        />
                        <button type="button" on:click={selectUserWorkspaces} class="flex items-center space-x-1 text-xs text-theme-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span class="uppercase font-medium">{$t("app.workspaces.actions.selectUserWorkspaces")}</span>
                        </button>
                      </div>
                    </div>
                    <!--User Workspaces: End -->
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    {#if loading}
                      <div class="text-theme-700 text-sm">
                        <div>{$t("shared.loading")}...</div>
                      </div>
                    {:else}
                      <div>
                        <button
                          disabled={loading}
                          class={classNames(
                            "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                            loading && "bg-gray-100 cursor-not-allowed"
                          )}
                          type="button"
                          on:click={remove}
                        >
                          <div>{$t("shared.delete")}</div>
                        </button>
                      </div>
                    {/if}

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
                        <div>{$t("shared.save")}</div>
                      </button>
                    </div>
                  </div>
                </form>
              {:else}
                <div />
              {/if}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <ConfirmModal bind:this={confirmRemove} on:yes={yesRemove} />
  <ErrorModal bind:this={errorModal} />
  <SuccessModal bind:this={successModal} on:closed={close} />
  <SelectWorkspaces bind:this={selectWorkspaces} on:selected={selectedWorkspaces} />
</div>
