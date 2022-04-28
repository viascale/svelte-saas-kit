<script lang="ts">
  import { onMount } from "svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";

  import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
  import services from "@/services";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import plans from "@/application/pricing/plans";
  import { _ as t } from "svelte-i18n";

  let errorModal: ErrorModal;

  let loading: boolean = false;
  let items: SubscriptionProductDto[] = [];
  let fromServer = true;

  onMount(() => {
    reload();
  });

  function reload() {
    items = [];
    loading = true;
    services.subscriptionProducts
      .getProducts()
      .then((response: SubscriptionProductDto[]) => {
        let products = response.sort((x, y) => {
          return x?.tier > y?.tier ? 1 : -1;
        });
        if (products.length === 0) {
          products = plans;
        }
        items = products;
        const notInDatabase = products.filter((f) => f.id === undefined || f.id === "");
        if (notInDatabase.length === 0) {
          fromServer = true;
        } else if (notInDatabase.length === products.length) {
          fromServer = false;
        }
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function generateFromFiles() {
    loading = true;
    createAllPlans().finally(() => {
      reload();
    });
  }
  async function createAllPlans() {
    const allAsyncResults: any[] = [];

    for (const product of items) {
      const asyncResult = await services.subscriptionProducts.createProduct(product).catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
      allAsyncResults.push(asyncResult);
    }

    return allAsyncResults;
  }
</script>

<svelte:head>
  <title>{$t("admin.pricing.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2 ">
      <h1 class="flex-1 font-bold flex items-center truncate">
        {$t("admin.pricing.title")}
        {#if !loading}
          <span class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300">
            {items.length}
          </span>
        {/if}
      </h1>
      <div class="flex items-center space-x-2 h-9">
        <ButtonSecondary to="/pricing" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {#if !fromServer} <div>{$t("shared.preview")}</div> {:else} <div>{$t("shared.view")}</div>{/if}
        </ButtonSecondary>
      </div>
    </div>
  </div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl overflow-auto">
    {#if loading}
      <Loading />
    {:else}
      <div>
        {#if !items || items.length === 0}
          <div />
        {:else}
          <div>
            <div>
              <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-sm border-b border-gray-200 space-y-2">
                {#if !fromServer}
                  <div class="bg-yellow-50 mb-2 rounded-sm border border-yellow-300 min-w-full">
                    <div class="rounded-sm bg-yellow-50 p-4">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fill-rule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>

                        <div class="ml-3">
                          <h3 class="text-sm leading-5 font-medium text-yellow-800">{$t("shared.warning")}</h3>
                          <div class="mt-2 text-sm leading-5 text-yellow-700">
                            <p>{$t("admin.pricing.thesePricesAreFromFiles")}</p>
                          </div>
                          <div class="text-sm leading-5 right-0 -ml-3 mt-2">
                            <span class="inline-flex rounded-sm ml-2">
                              <button
                                on:click={generateFromFiles}
                                class="ml-1 h-8 inline-flex items-center px-4 py-2 border border-orange-200 text-xs leading-5 font-medium rounded-sm text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:shadow-outline-indigo focus:border-theme-700 active:bg-theme-700 transition duration-150 ease-in-out"
                              >
                                {$t("admin.pricing.generateFromFiles")}
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.tier")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.title")}
                      </th>

                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.badge")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.status")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.workspaces")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.users")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.links")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.storage")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.monthlyContracts")}
                      </th>
                      <th class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate">
                        {$t("models.subscriptionProduct.serviceId")}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each items as item}
                      <tr class="text-gray-600">
                        <td class="truncate px-3 py-3 text-sm leading-3">{item.tier}</td>
                        <td class="truncate px-3 py-3 text-sm leading-3">{$t(item.title)}</td>
                        <td class="truncate px-3 py-3 text-sm leading-3"
                          >{#if item.badge} <div>{$t(item.badge)}</div>{/if}</td
                        >
                        <td class="truncate px-3 py-3 text-sm leading-3">{item.active ? $t("shared.active") : $t("shared.inactive")}</td>
                        <td class="truncate px-3 py-3 text-sm leading-3">
                          {#if !item.maxWorkspaces || item.maxWorkspaces === 0} {$t("shared.unlimited")} {:else} {item.maxWorkspaces}{/if}
                        </td>
                        <td class="truncate px-3 py-3 text-sm leading-3">
                          {#if !item.maxUsers || item.maxUsers === 0} {$t("shared.unlimited")} {:else} {item.maxUsers}{/if}
                        </td>
                        <td class="truncate px-3 py-3 text-sm leading-3">
                          {#if !item.maxLinks || item.maxLinks === 0} {$t("shared.unlimited")} {:else} {item.maxLinks}{/if}
                        </td>
                        <td class="truncate px-3 py-3 text-sm leading-3">
                          {#if !item.maxStorage || item.maxStorage === 0} {$t("shared.unlimited")} {:else} {item.maxStorage / 1024}{/if}
                          {#if item.maxStorage > 0} <span>{$t("shared.storage.gb")}</span>{/if}
                        </td>
                        <td class="truncate px-3 py-3 text-sm leading-3">
                          {!item.monthlyContracts || item.maxLinks === 0 ? $t("shared.unlimited") : item.monthlyContracts}
                        </td>
                        <td class="truncate px-3 py-3 text-sm leading-3 text-theme-700">{item.serviceId}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
    <ErrorModal bind:this={errorModal} />
  </div>
</div>
