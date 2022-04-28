<script lang="ts">
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.svelte";
  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";

  export let items: LinkDto[];

  let sortByColumn = "type";
  let sortDirection: number = -1;
  const headers = [
    {
      name: "",
      title: $t("models.workspace.object"),
    },
    {
      title: $t("models.link.type"),
    },
    {
      title: $t("models.workspace.businessMainActivity"),
    },
    {
      title: $t("shared.actions"),
    },
  ];

  function sortBy(column: string) {
    if (column) {
      sortDirection = sortDirection === -1 ? 1 : -1;
      sortByColumn = column;
    }
  }
  function getWorkspace(item: LinkDto) {
    if (whoAmI(item) === 0) {
      return item.clientWorkspace;
    } else {
      return item.providerWorkspace;
    }
  }
  $: currentWorkspace = $tenantState.currentWorkspace;
  function whoAmI(item: LinkDto) {
    const currentWorkspaceId = currentWorkspace?.id ?? "";
    if (currentWorkspaceId === item.providerWorkspaceId) {
      return 0;
    }
    return 1;
  }
  $: sortedItems = (): LinkDto[] => {
    if (!items) {
      return [];
    }
    const column = sortByColumn;
    if (!column || column === "") {
      return items;
    }
    return items.slice().sort((x, y) => {
      if (x[column] && y[column]) {
        if (sortDirection === -1) {
          return (x[column] > y[column] ? 1 : -1) ?? 1;
        } else {
          return (x[column] < y[column] ? 1 : -1) ?? 1;
        }
      }
      return 1;
    });
  };
</script>

<div>
  {#if items.length === 0}
    <div>
      <EmptyState
        className="bg-white"
        captions={{
          thereAreNo: $t("app.links.empty"),
        }}
      />
    </div>
  {:else}
    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  {#each headers as header}
                    <th
                      on:click={() => sortBy(header.name)}
                      scope="col"
                      class={classNames(
                        "px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none",
                        header.name && "cursor-pointer hover:text-gray-700"
                      )}
                    >
                      <div class="flex items-center space-x-1 text-gray-500">
                        <div>{header.title}</div>
                        <div class={classNames((!header.name || sortByColumn !== header.name) && "invisible")}>
                          {#if sortDirection === -1}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fill-rule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          {/if}
                        </div>
                      </div>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each sortedItems() as link}
                  <tr>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                      <div class="flex items-end">
                        <div>
                          <div class="text-sm font-extrabold text-gray-900">{getWorkspace(link).name}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                      {#if whoAmI(link) === 0}
                        <span class="flex-shrink-0 inline-block px-2 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-sm border-indigo-300">
                          {$t("models.client.object")}
                        </span>
                      {:else}
                        <span class="flex-shrink-0 inline-block px-2 py-0.5 text-theme-800 text-xs font-medium bg-theme-100 rounded-sm border-theme-300">
                          {$t("models.provider.object")}
                        </span>
                      {/if}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                      <div class="max-w-sm truncate">{getWorkspace(link).businessMainActivity}</div>
                    </td>
                    <td class="w-20 px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                      <div class="flex items-center space-x-2">
                        <ButtonTertiary to={"/app/link/" + link.id}>
                          <div>{$t("app.links.profile.title")}</div>
                        </ButtonTertiary>
                        <ButtonTertiary to={"/app/contract/new?l=" + link.id}>
                          <div>{$t("app.contracts.new.title")}</div>
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
  {/if}
</div>
