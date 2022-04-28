<script lang="ts">
  import type { SideBarItem } from "@/application/sidebar/SidebarItem";

  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import { AdminSidebar } from "@/application/sidebar/AdminSidebar";
  import { AppSidebar } from "@/application/sidebar/AppSidebar";
  import SidebarIcon from "@/components/layouts/icons/SidebarIcon.svelte";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";

  let items: SideBarItem[] = [];
  let roles: TenantUserRole[] = [];
  let searchInput: string = "";

  onMount(() => {
    items = [];
    AdminSidebar.forEach((admin) => {
      admin.items?.forEach((item) => {
        items = [...items, item];
      });
    });
    AppSidebar.forEach((app) => {
      app.items?.forEach((item) => {
        items = [...items, item];
      });
    });
    const roleKeys = Object.keys(TenantUserRole).filter((key) => !isNaN(Number(key)));
    roles = roleKeys.map((f) => Number(f));
  });

  function roleName(role: TenantUserRole) {
    return $t("settings.profile.roles." + TenantUserRole[role]);
  }
  function roleHasAccess(item: SideBarItem, role: TenantUserRole): boolean {
    return !item.path.includes("/admin") && allowRole(item, role);
  }
  function allowRole(item: SideBarItem, role: TenantUserRole) {
    return !item.userRoles || item.userRoles.includes(role);
  }
</script>

<svelte:head>
  <title>{$t("admin.navigation.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">{$t("admin.navigation.title")}</h1>
    </div>
  </div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
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
      <div>
        <div>
          <div class="flex flex-col">
            <div class="overflow-x-auto">
              <div class="py-2 align-middle inline-block min-w-full">
                <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none truncate border border-gray-200"
                        >
                          {$t("admin.navigation.icon")}
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none truncate border border-gray-200"
                        >
                          {$t("admin.navigation.menu")}
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none truncate border border-gray-200"
                        >
                          {$t("admin.navigation.url")}
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-bold text-gray-500 tracking-wider select-none truncate border border-gray-200">
                          {$t("admin.navigation.sysadmin")}
                        </th>
                        {#each roles as role}
                          <th
                            scope="col"
                            class="px-4 py-2 text-left text-xs font-bold text-gray-500 tracking-wider select-none truncate border border-gray-200"
                          >
                            <div class="flex items-center justify-center space-x-1 text-gray-500">{roleName(role)}</div>
                          </th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      {#each items as item}
                        <tr>
                          <td class="w-10 px-4 py-2 whitespace-nowrap border-l border-t border-b border-gray-200 text-sm">
                            {#if item.icon} <SidebarIcon className="mx-auto h-5 w-5 text-slate-700" icon={item.icon} />{/if}
                          </td>
                          <td class="px-4 py-2 whitespace-nowrap border-l border-t border-b border-gray-200 text-sm">{item.title}</td>
                          <td class="px-4 py-2 whitespace-nowrap border-l border-t border-b border-gray-200 text-sm">
                            <a target="_blank" rel="noreferrer" href={item.path} class="underline text-blue-500 hover:text-blue-700">
                              {item.path}
                            </a>
                          </td>
                          <td class="px-4 whitespace-nowrap text-sm text-gray-600 text-center border border-gray-200">
                            <div class="flex justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                          </td>
                          {#each roles as role}
                            <td class="px-4 whitespace-nowrap text-sm text-gray-600 text-center border border-gray-200">
                              <div class="flex justify-center">
                                {#if roleHasAccess(item, role)}
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fill-rule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                {:else}
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                {/if}
                              </div>
                            </td>
                          {/each}
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
    </div>
  </div>
</div>
