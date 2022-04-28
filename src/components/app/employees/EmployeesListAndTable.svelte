<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import type { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
  import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.svelte";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import DateUtils from "@/utils/shared/DateUtils";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";

  export let items: EmployeeDto[];
  export let className: string = "";
  export let canEdit: boolean = true;

  let sortByColumn: string = "";
  let sortDirection: number = -1;
  let headers: any[] = [
    {
      name: "firstName",
      title: $t("models.employee.firstName"),
    },
    {
      name: "lastName",
      title: $t("models.employee.lastName"),
    },
  ];

  onMount(() => {
    if (canEdit) {
      headers = [
        ...headers,
        {
          name: "email",
          title: $t("models.employee.email"),
        },
        {
          title: $t("shared.actions"),
        },
      ];
    }
  });

  function sortBy(column: string) {
    if (column) {
      sortDirection = sortDirection === -1 ? 1 : -1;
      sortByColumn = column;
    }
  }
  function dateMonthName(value: Date | undefined) {
    return DateUtils.dateMonthName(value);
  }
  $: sortedItems = (): EmployeeDto[] => {
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

<div class={className}>
  {#if items.length === 0}
    <div>
      <EmptyState
        className="bg-white"
        to="/app/employees/new"
        captions={{
          new: $t("shared.add"),
          thereAreNo: $t("app.employees.errors.notDefined"),
        }}
        icon="plus"
      />
    </div>
  {:else}
    <div>
      <div class="sm:hidden">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each sortedItems() as employee}
              <li>
                <Link to={"/app/employee/" + employee.id} class="block hover:bg-gray-50">
                  <div class="flex items-center px-4 py-2 sm:px-4">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <div class="mt-2 flex items-center justify-between text-gray-500 space-x-1">
                            <div class="truncate">
                              {employee.firstName}
                              {employee.lastName}
                            </div>
                            <div class="text-sm">{employee.email}</div>
                          </div>
                        </div>
                        <div class="hidden md:block">
                          <div>
                            <p class="text-sm text-gray-900">
                              {#if employee.createdAt} <time>{dateMonthName(employee.createdAt)}</time>{/if}
                            </p>
                            <p class="mt-2 flex items-center text-sm text-gray-500">
                              <!--Heroicon name: solid/check-circle -->
                              <svg
                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <!--Heroicon name: solid/chevron-right -->
                      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="hidden sm:block">
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
                            "text-xs px-4 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate",
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
                    {#each sortedItems() as employee}
                      <tr>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{employee.firstName}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{employee.lastName}</td>
                        {#if canEdit} <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>{/if}

                        {#if canEdit}
                          <td class="w-20 px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div class="flex items-center space-x-2">
                              <ButtonTertiary to={"/app/employee/" + employee.id}>{$t("shared.edit")}</ButtonTertiary>
                            </div>
                          </td>
                        {/if}
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
