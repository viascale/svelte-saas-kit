<script lang="ts">
  import { Link } from "svelte-routing";
  import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";

  export let items: TenantUserDto[];

  let sortByColumn: string = "";
  let sortDirection: number = 1;
  const headers = [
    {
      name: "role",
      title: $t("settings.profile.role"),
    },
    {
      name: "email",
      title: $t("account.shared.email"),
    },
    {
      name: "firstName",
      title: $t("settings.profile.name"),
    },
    {
      title: $t("settings.profile.phone"),
    },
    {
      title: $t("shared.status"),
    },
  ];

  function getUserRole(item: TenantUserDto) {
    return $t("settings.profile.roles." + TenantUserRole[item.role]);
  }
  function getUserStatus(item: TenantUserDto) {
    return $t("settings.profile.status." + TenantUserStatus[item.status]);
  }
  function getUserRoleClass(item: TenantUserDto) {
    switch (item.role as TenantUserRole) {
      case TenantUserRole.OWNER:
        return "bg-slate-50 text-gray-800 border border-slate-300";
      case TenantUserRole.ADMIN:
        return "bg-rose-50 border border-rose-200";
      case TenantUserRole.MEMBER:
        return "bg-blue-50 border border-blue-200";
      case TenantUserRole.GUEST:
        return "bg-gray-50 border border-gray-200";
    }
  }
  function sortBy(column: string) {
    if (column) {
      sortDirection = sortDirection === -1 ? 1 : -1;
      sortByColumn = column;
    }
  }
</script>

<div>
  {#if !items || items.length === 0}
    <div>
      <EmptyState
        className="bg-white"
        to="/app/settings/members/new"
        captions={{
          new: $t("shared.add"),
          thereAreNo: $t("app.workspaces.errors.noUsers"),
        }}
        icon="plus"
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
                        "text-xs px-2 py-1 text-left font-medium text-gray-500 tracking-wider select-none truncate",
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
                {#each items as item}
                  <tr>
                    <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                      <span class={classNames("text-xs w-28 justify-center inline-flex items-center px-1 py-1 rounded-sm font-medium", getUserRoleClass(item))}>
                        {getUserRole(item)}
                      </span>
                    </td>
                    <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                    <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                      {item.firstName}
                      {item.lastName}
                    </td>

                    <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">{item.phone}</td>

                    <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">{getUserStatus(item)}</td>
                    <!--<td
                              class="px-2 py-1 whitespace-nowrap text-sm text-gray-600"
                  >{ getUserJoined(item) }</td>-->
                    <td class="w-20 px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                      <div class="flex items-center space-x-2">
                        <Link to={"/app/settings/members/edit/" + item.id} class="flex items-center space-x-2 text-theme-600 hover:text-theme-900">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <div>{$t("shared.edit")}</div>
                        </Link>
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
