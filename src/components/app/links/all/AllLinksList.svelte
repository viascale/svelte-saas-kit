<script lang="ts">
  import { onMount } from "svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import services from "@/services";
  import AllLinksListAndTable from "./AllLinksListAndTable.svelte";
  import { _ as t } from "svelte-i18n";

  let loading: boolean = false;
  let searchInput: string = "";
  let items: LinkDto[] = [];

  onMount(() => {
    reload();
  });

  function reload() {
    items = [];
    loading = true;
    services.links
      .getAllLinked()
      .then((response) => {
        items = response;
      })
      .finally(() => {
        loading = false;
      });
  }
  $: filteredItems = (): LinkDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.id?.toUpperCase().includes(searchInput.toUpperCase()) ||
        f.clientWorkspace.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.providerWorkspace.name?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };
</script>

<div>
  {#if loading}
    <Loading />
  {:else}
    <div>
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
        <AllLinksListAndTable items={filteredItems()} />
      </div>
    </div>
  {/if}
</div>
