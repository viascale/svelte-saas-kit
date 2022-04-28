<script lang="ts">
  import { onMount } from "svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import WorkspacesListAndTable from "@/components/core/workspaces/WorkspacesListAndTable.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";
  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";
  import { Link } from "svelte-routing";

  let errorModal: ErrorModal;

  let loading: boolean = false;
  let searchInput: string = "";

  onMount(() => {
    tinyEventBus().emitter.on("workspace-deleted", () => reload());
    tinyEventBus().emitter.on("workspace-added", () => reload());
    tinyEventBus().emitter.on("workspace-saved", () => reload());

    services.tenants.getFeatures();
    reload();

    return () => {
      tinyEventBus().emitter.off("workspace-deleted");
      tinyEventBus().emitter.off("workspace-added");
      tinyEventBus().emitter.off("workspace-saved");
    };
  });

  function reload() {
    loading = true;
    services.workspaces
      .getAllWorkspaces(true)
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  $: workspaces = $tenantState.workspaces;
  $: filteredItems = (): WorkspaceDto[] => {
    if (!workspaces) {
      return [];
    }
    return workspaces.filter(
      (f) => f.id?.toUpperCase().includes(searchInput.toUpperCase()) || f.name?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };
</script>

<svelte:head>
  <title>{$t("models.workspace.plural")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />;
    {:else}
      <div>
        <div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <div class="flex items-center justify-between w-full space-x-2">
                <div class="relative flex items-center w-full flex-grow">
                  <div class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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

                <Link
                  to="/app/settings/workspaces/new"
                  class="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>

                  <div>{$t("shared.new")}</div>
                </Link>
              </div>
            </div>
            <div>
              <WorkspacesListAndTable items={filteredItems()} />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <ErrorModal bind:this={errorModal} />
  <slot />
</div>
