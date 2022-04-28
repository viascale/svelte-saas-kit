<script lang="ts">
  import { onMount } from "svelte";
  import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
  import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import services from "@/services";
  import ContractsListAndTable from "./ContractsListAndTable.svelte";
  import { _ as t } from "svelte-i18n";

  export let filter: ContractStatusFilter = ContractStatusFilter.ALL;

  let loading: boolean = false;
  let searchInput: string = "";

  let items: ContractDto[] = [];

  onMount(() => {
    reload(filter);
  });

  $: reload(filter);
  function reload(filter: ContractStatusFilter) {
    loading = true;
    services.contracts
      .getAllByStatusFilter(filter)
      .then((response) => {
        items = response;
      })
      .finally(() => {
        loading = false;
      });
  }
  $: filteredItems = (): ContractDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.id?.toUpperCase().includes(searchInput.toUpperCase()) ||
        f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.link?.providerWorkspace.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.link?.clientWorkspace.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.createdByUser?.email?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };
</script>

<div>
  {#if loading}
    <Loading />
  {:else}
    <div>
      <div class="space-y-2">
        <div class="flex justify-between items-center space-x-0">
          <div class="space-y-2 sm:space-y-0 flex-col text-right sm:flex-row flex sm:items-center sm:space-x-3" />
        </div>
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
        <ContractsListAndTable items={filteredItems()} />
      </div>
    </div>
  {/if}
</div>
