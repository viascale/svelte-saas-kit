<script lang="ts">
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";

  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import type { UserDto } from "@/application/dtos/core/users/UserDto";
  import services from "@/services";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.svelte";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";

  let confirmDelete: ConfirmModal;
  let errorModal: ErrorModal;
  let successModal: SuccessModal;

  let items: UserDto[] = [];
  let loading: boolean = false;
  let searchInput: string = "";
  const headers = [
    {
      title: $t("models.user.object"),
    },
    {
      title: $t("models.user.tenants"),
    },
    {
      title: $t("shared.actions"),
    },
  ];

  onMount(() => {
    reload();
  });

  function reload() {
    loading = true;
    services.users
      .adminGetAll()
      .then((response: UserDto[]) => {
        items = response;
      })
      .finally(() => {
        loading = false;
      });
  }
  function impersonate(user: UserDto) {
    services.authentication.impersonate(user.id).catch((error) => {
      errorModal?.show($t("shared.error"), $t(error));
    });
  }
  function changePassword(user: UserDto) {
    const password = prompt($t("settings.profile.changePassword") + " - " + user.email);
    if (!password || password.length < 8) {
      alert("Set a password with 8 characters minimum");
    } else if (user.type === 0) {
      alert("You cannot change password for admin user");
    } else {
      if (confirm("[ADMINISTRATOR] Update password for user " + user.email + "?")) {
        services.users
          .adminUpdatePassword(user.id, password)
          .then(() => {
            alert("Updated");
          })
          .catch((error) => {
            errorModal?.show($t("shared.error"), $t(error));
          });
      }
    }
  }
  function getUserTenants(user: UserDto) {
    return user.tenants.map((f) => `${f.tenant?.name} (${$t("settings.profile.roles." + TenantUserRole[f.role])})`).join(", ");
  }
  let userToBeDeleted = {};
  function deleteUser(item: UserDto) {
    if (confirmDelete) {
      userToBeDeleted = item;
      confirmDelete.show($t("shared.delete") + " " + item.email, $t("shared.delete"), $t("shared.cancel"), $t("admin.users.deleteWarning"));
    }
  }
  function confirmDeleteUser(event: any) {
    const item: UserDto = event.detail.value;
    loading = true;
    services.users
      .adminDelete(item.id)
      .then(() => {
        successModal?.show($t("shared.deleted"));
        reload();
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  $: filteredItems = (): UserDto[] => {
    if (!items) {
      return [];
    }
    const filtered = items.filter((f) => f.firstName?.toString()?.toUpperCase().includes(searchInput.toUpperCase()));

    return filtered.sort((x, y) => {
      if (x.createdAt && y.createdAt) {
        return (x.createdAt > y.createdAt ? -1 : 1) ?? -1;
      }
      return -1;
    });
  };
</script>

<svelte:head>
  <title>{$t("models.user.plural")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">
        {$t("models.user.plural")}
        {#if !loading}
          <span class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300">
            {filteredItems().length}
          </span>
        {/if}
      </h1>
      <div class="flex items-center space-x-2 h-9">
        <ButtonSecondary on:click={reload} type="button">
          {$t("shared.reload")}
        </ButtonSecondary>
      </div>
    </div>
  </div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
    {#if loading}
      <Loading />
    {:else}
      <div class="space-y-2">
        <div class="flex justify-between">
          <div class="flex items-center justify-start w-full">
            <div class="relative flex items-center w-full">
              <div class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="buscador"
                id="buscador"
                class="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                placeholder={$t("shared.searchDot")}
                bind:value={searchInput}
              />
            </div>
          </div>
        </div>
        {#if filteredItems().length === 0}
          <div>
            <EmptyState
              className="bg-white"
              captions={{
                thereAreNo: $t("app.workspaces.errors.noUsers"),
              }}
            />
          </div>
        {:else}
          <div>
            <div>
              <div class="flex flex-col">
                <div class="overflow-x-auto">
                  <div class="py-2 align-middle inline-block min-w-full">
                    <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            {#each headers as header}
                              <th scope="col" class="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate">
                                <div class="flex items-center space-x-1 text-gray-500">
                                  <div>{header.title}</div>
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          {#each filteredItems() as item}
                            <tr>
                              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                <div class="flex items-center space-x-4">
                                  <div>
                                    <div class="text-sm font-medium text-gray-900">
                                      {item.firstName}
                                      {item.lastName}
                                    </div>
                                    <div class="text-sm text-gray-500">{item.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                {#if item.tenants && item.tenants.length > 0} <span>{getUserTenants(item)}</span> {:else} <span>?</span>{/if}
                              </td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                <div class="flex items-center space-x-2">
                                  <ButtonTertiary disabled={item.type === 0} on:click={() => impersonate(item)}>
                                    {$t("models.user.impersonate")}
                                  </ButtonTertiary>
                                  <ButtonTertiary disabled={item.type === 0} on:click={() => changePassword(item)}>
                                    {$t("settings.profile.changePassword")}
                                  </ButtonTertiary>
                                  <ButtonTertiary disabled={item.type === 0} on:click={() => deleteUser(item)} destructive={true}>
                                    {$t("shared.delete")}
                                  </ButtonTertiary>
                                </div>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmDelete} bind:value={userToBeDeleted} on:yes={confirmDeleteUser} />
</div>
