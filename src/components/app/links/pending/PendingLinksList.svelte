<script lang="ts">
  import { onMount } from "svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import services from "@/services";
  import DateUtils from "@/utils/shared/DateUtils";
  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";

  let errorModal: ErrorModal;
  let modalReject: ConfirmModal;
  let modalAccept: ConfirmModal;

  let loading: boolean = false;
  let items: LinkDto[] = [];

  onMount(() => {
    reload();
    tinyEventBus().emitter.on("reload-links", () => {
      reload();
    });

    return () => {
      tinyEventBus().emitter.off("reload-links");
    };
  });

  function reload() {
    items = [];
    loading = true;
    services.links
      .getAllPending()
      .then((response) => {
        items = response;
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  let selectedLink: LinkDto;
  function reject(item: LinkDto) {
    const whoAmIName = whoAmI(item) === 0 ? $t("models.provider.object") : $t("models.client.object");
    if (modalReject) {
      selectedLink = item;
      modalReject.show(
        $t("app.links.invitation.confirmReject"),
        $t("shared.reject"),
        $t("shared.back"),
        $t("app.links.invitation.rejectWarning", {
          values: {
            p1: whoAmIName,
            p2: inviterWorkspace(item).name,
          },
        })
      );
    }
  }
  function accept(item: LinkDto) {
    const whoAmIName = whoAmI(item) === 0 ? $t("models.provider.object") : $t("models.client.object");
    if (modalAccept) {
      selectedLink = item;
      modalAccept.show(
        $t("app.links.invitation.confirmAccept", { values: { p1: whoAmIName } }),
        $t("shared.accept"),
        $t("shared.back"),
        $t("app.links.invitation.acceptWarning", { values: { p1: inviterWorkspace(item).name } })
      );
    }
  }
  function accepted(event: any) {
    const { value } = event.detail;
    loading = true;
    services.links
      .acceptOrReject(value.id, {
        accepted: true,
      })
      .then(() => {
        value.status = 1;
        services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function rejected(event: any) {
    const { value } = event.detail;
    loading = true;
    services.links
      .acceptOrReject(value.id, {
        accepted: false,
      })
      .then(() => {
        value.status = 2;
        services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  $: currentWorkspace = $tenantState.currentWorkspace;
  function whoAmI(item: LinkDto) {
    const currentWorkspaceId = currentWorkspace?.id ?? "";
    if (currentWorkspaceId === item.providerWorkspaceId) {
      return 0;
    }
    return 1;
  }
  function inviterWorkspace(item: LinkDto): WorkspaceDto {
    if (item.createdByWorkspaceId === item.providerWorkspaceId) {
      return item.providerWorkspace;
    }
    return item.clientWorkspace;
  }
  function dateAgo(value: Date) {
    return DateUtils.dateAgo(value);
  }
  $: currentWorkspaceId = $tenantState.currentWorkspace.id ?? "";
</script>

<div class="max-w-lg mx-auto pb-12">
  {#if loading}
    <Loading />
  {:else}
    <div>
      {#if items.length === 0}
        <div>
          <EmptyState
            className="bg-white"
            captions={{
              thereAreNo: $t("app.links.pending.empty"),
            }}
          />
        </div>
      {:else}
        <ul role="list" class="sm:grid grid-cols-1 gap-3">
          {#each items as item}
            <li class="col-span-1 bg-white rounded-sm shadow-md divide-y divide-gray-200 border-t sm:border border-gray-300">
              <div class="w-full flex items-center justify-between p-6 space-x-6">
                <div class="w-full space-y-2">
                  {#if item.createdByWorkspaceId !== currentWorkspaceId && item.createdByUser}
                    <div class="flex items-center justify-between space-x-3">
                      <p class="text-sm font-normal text-gray-700 border-b pb-3 mb-2 w-full">
                        {item.createdByUser.firstName} ({item.createdByUser.email}) {$t("app.links.invitation.hasSentYou")}.
                      </p>
                    </div>
                  {/if}
                  <div class="flex items-center justify-between space-x-3">
                    <h3 class="text-gray-900 text-sm font-medium truncate">
                      {#if whoAmI(item) === 0} <span>{item.clientWorkspace.name}</span> {:else} <span>{item.providerWorkspace.name}</span>{/if}
                    </h3>

                    {#if whoAmI(item) !== 0}
                      <span class="flex-shrink-0 inline-block px-2 py-0.5 text-teal-800 text-sm font-medium bg-teal-100 rounded-sm border-teal-300">
                        {$t("models.provider.object")}
                      </span>
                    {:else}
                      <span class="flex-shrink-0 inline-block px-2 py-0.5 text-purple-800 text-sm font-medium bg-purple-100 rounded-sm border-purple-300">
                        {$t("models.client.object")}
                      </span>
                    {/if}
                  </div>
                  <div class="sm:flex sm:items-center sm:space-x-2 sm:justify-between text-gray-500 text-sm">
                    <p class="truncate">
                      {#if whoAmI(item) === 0} <span>{item.clientWorkspace.name}</span> {:else} <span>{item.providerWorkspace.name}</span>{/if}
                    </p>
                    {#if item.createdAt} <p class="font-light text-sm truncate">{dateAgo(item.createdAt)}</p>{/if}
                  </div>
                </div>
              </div>
              <div>
                {#if item.status === 0 && item.createdByWorkspaceId !== currentWorkspaceId}
                  <div class="-mt-px flex divide-x divide-gray-200">
                    <div class="w-0 flex-1 flex">
                      <button
                        type="button"
                        on:click={() => reject(item)}
                        class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-theme-500 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span class="ml-3">{$t("shared.cancel")}</span>
                      </button>
                    </div>
                    <div class="-ml-px w-0 flex-1 flex">
                      <button
                        type="button"
                        on:click={() => accept(item)}
                        class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-theme-500 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>

                        {#if whoAmI(item) === 0}
                          <span class="ml-3">{$t("shared.accept")}</span>
                        {:else}
                          <span class="ml-3">{$t("shared.accept")}</span>
                        {/if}
                      </button>
                    </div>
                  </div>
                {:else}
                  <div class="-mt-px flex divide-x divide-gray-200">
                    <div class="w-full">
                      {#if item.status === 0}
                        <div
                          class="bg-gray-100 w-full relative -mr-px flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="ml-3">{$t("app.links.pending.invitationSent")}</span>
                        </div>
                      {/if}
                      {#if item.status === 2}
                        <div
                          class="w-full relative -mr-px flex-1 inline-flex items-center justify-center py-4 text-sm bg-red-50 text-red-700 font-medium border border-transparent rounded-bl-lg"
                        >
                          <span class="ml-3">{$t("shared.rejected")}</span>
                        </div>
                      {:else if item.status === 1}
                        <div
                          class="w-full relative flex-1 inline-flex items-center justify-center py-4 text-sm bg-teal-50 text-teal-700 font-medium border border-transparent rounded-br-lg"
                        >
                          <span class="ml-3">{$t("shared.accepted")}</span>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
  <ConfirmModal bind:this={modalAccept} bind:value={selectedLink} on:yes={accepted} />
  <ConfirmModal bind:this={modalReject} bind:value={selectedLink} on:yes={rejected} />
  <ErrorModal bind:this={errorModal} />
</div>
