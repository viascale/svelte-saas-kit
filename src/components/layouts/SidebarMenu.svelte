<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SideBarItem } from "@/application/sidebar/SidebarItem";
  import { AdminSidebar } from "@/application/sidebar/AdminSidebar";
  import { AppSidebar } from "@/application/sidebar/AppSidebar";
  import type { SidebarGroup } from "@/application/sidebar/SidebarGroup";
  import { UserType } from "@/application/enums/core/users/UserType";
  import type { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import classNames from "@/utils/shared/ClassesUtils";
  import SidebarIcon from "./icons/SidebarIcon.svelte";
  import { accountState } from "@/store/modules/accountStore";
  import { tenantState } from "@/store/modules/tenantStore";
  import { Link } from "svelte-routing";
  import url from "@/router/url";
  const dispatch = createEventDispatcher();
  export let layout: "app" | "admin";

  let menu: SideBarItem[] = [];
  let expanded: number[] = [];

  menu = layout === "admin" ? AdminSidebar : AppSidebar;

  menu.forEach((group) => {
    group.items?.forEach((element, index) => {
      if (element.open) {
        expanded = [...expanded, index];
      } else {
        expanded = expanded.filter((f) => f !== index);
      }
    });
  });

  $: menuItemIsExpanded = (index: number) => {
    return expanded.includes(index);
  };
  function toggleMenuItem(index: number) {
    if (expanded.includes(index)) {
      expanded = expanded.filter((item) => item !== index);
    } else {
      expanded = [...expanded, index];
    }
  }
  const isCurrent = (menuItem: SideBarItem, pathname: string) => {
    return pathname.includes(menuItem.path);
    // return route.name && menuItem.pathName && route.name.includes(menuItem.pathName)
  };
  $: currentUserType = $accountState.user?.type ?? UserType.Tenant;
  $: currentUserRole = $tenantState.current?.currentUser?.role as TenantUserRole;
  function allowCurrentUserType(item: SideBarItem) {
    return !item.userTypes || item.userTypes.includes(currentUserType);
  }
  function allowCurrentRole(item: SideBarItem) {
    return !item.userRoles || item.userRoles.includes(currentUserRole);
  }
  const getMenu = (): SidebarGroup[] => {
    let _menu: SidebarGroup[] = [];
    menu
      .filter((f) => allowCurrentUserType(f) && allowCurrentRole(f))
      .forEach(({ title, items }) => {
        _menu = [
          ..._menu,
          {
            title: title.toString(),
            items: items?.filter((f) => allowCurrentUserType(f) && allowCurrentRole(f)) ?? [],
          },
        ];
      });
    return _menu.filter((f) => f.items.length > 0);
  };
</script>

<div>
  <div class="sm:hidden">
    {#each getMenu() as group}
      <div class="mt-2">
        <div class="mt-2">
          <h3 class="px-1 text-xs leading-4 font-semibold text-slate-500 uppercase tracking-wider">{group.title}</h3>
        </div>
        {#each group.items as menuItem, index}
          <div>
            {#if !menuItem.items || menuItem.items.length === 0}
              <div>
                <Link
                  to={menuItem.path}
                  class={classNames(
                    "px-4 mt-1 group flex items-center space-x-4 py-2 text-base leading-5 rounded-sm hover:text-white text-slate-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150",
                    isCurrent(menuItem, $url.pathname) && "text-slate-300 bg-theme-600 focus:bg-theme-700",
                    !isCurrent(menuItem, $url.pathname) && "text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
                  )}
                  on:click={() => dispatch("selected")}
                >
                  {#if menuItem.icon !== undefined} <SidebarIcon className="h-5 w-5 text-white" icon={menuItem.icon} />{/if}
                  <div>{menuItem.title}</div>
                </Link>
              </div>
            {:else}
              <div>
                <div
                  class="px-4 justify-between mt-1 group flex items-center py-2 text-base leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 focus:bg-slate-800 transition ease-in-out duration-150 text-slate-200 hover:bg-slate-800"
                  on:click={() => toggleMenuItem(index)}
                >
                  <div class="flex items-center space-x-4">
                    <span class="text-slate-200 h-5 w-5 transition ease-in-out">
                      {#if menuItem.icon !== undefined} <SidebarIcon className="h-5 w-5 text-white" icon={menuItem.icon} />{/if}
                    </span>
                    <div>{menuItem.title}</div>
                  </div>
                  <!--Expanded: "text-gray-400 rotate-90", Collapsed: "text-slate-200" -->
                  <svg
                    class={classNames(
                      "ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150",
                      menuItemIsExpanded(index)
                        ? "rotate-90 ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150"
                        : "ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                  </svg>
                </div>
                <!--Expandable link section, show/hide based on state. -->
                {#if menuItemIsExpanded(index)}
                  <div class="mt-1">
                    {#each menuItem.items as subItem}
                      <Link
                        to={subItem.path}
                        class={classNames(
                          "pl-14 mt-1 group flex items-center py-2 sm:text-sm leading-5 rounded-sm hover:text-slate-300 focus:outline-none focus:text-slate-300 transition ease-in-out duration-150",
                          isCurrent(subItem, $url.pathname) && "text-slate-300 bg-theme-600 focus:bg-theme-700",
                          !isCurrent(subItem, $url.pathname) && "text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
                        )}
                        on:click={() => dispatch("selected")}
                      >
                        {#if subItem.icon !== undefined}
                          <span class="mr-1 h-5 w-5 transition ease-in-out">
                            <SidebarIcon className="h-5 w-5 text-white" icon={subItem.icon} />
                          </span>
                        {/if}
                        {subItem.title}
                      </Link>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="hidden sm:block">
    {#each getMenu() as group}
      <div class="select-none">
        <div class="mt-2">
          <h3 id="Settings-headline" class="px-1 text-xs leading-4 font-semibold text-slate-500 uppercase tracking-wider">
            {group.title}
          </h3>
        </div>
        {#each group.items as menuItem, index}
          <div>
            {#if !menuItem.items || menuItem.items.length === 0}
              <div>
                <Link
                  to={menuItem.path}
                  class={classNames(
                    "px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white text-slate-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150",
                    menuItem.icon !== undefined && "px-4",
                    isCurrent(menuItem, $url.pathname) && "text-slate-300 bg-theme-600 focus:bg-theme-700",
                    !isCurrent(menuItem, $url.pathname) && "text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
                  )}
                >
                  <div class="flex items-center space-x-5">
                    {#if menuItem.icon !== undefined} <SidebarIcon className="h-5 w-5 text-white" icon={menuItem.icon} />{/if}
                    <div>{menuItem.title}</div>
                  </div>
                </Link>
              </div>
            {:else}
              <div>
                <button
                  type="button"
                  class="w-full px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 transition ease-in-out duration-150 text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
                  on:click={() => toggleMenuItem(index)}
                >
                  <div class="flex items-center space-x-5">
                    {#if menuItem.icon !== undefined} <SidebarIcon className="h-5 w-5 text-white" icon={menuItem.icon} />{/if}
                    <div>{menuItem.title}</div>
                  </div>
                  <!--Expanded: "text-gray-400 rotate-90", Collapsed: "text-slate-200" -->
                  <svg
                    class={classNames(
                      "bg-slate-900 ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150",
                      menuItemIsExpanded(index)
                        ? "rotate-90 ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150"
                        : "ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                  </svg>
                </button>
                <!--Expandable link section, show/hide based on state. -->
                {#if menuItemIsExpanded(index)}
                  <div class="mt-1">
                    {#each menuItem.items as subItem}
                      <Link
                        to={subItem.path}
                        class={classNames(
                          "mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 text-slate-300 transition ease-in-out duration-150",
                          menuItem.icon === undefined && "pl-10",
                          menuItem.icon !== undefined && "pl-14",
                          isCurrent(subItem, $url.pathname) && "text-slate-300 bg-theme-600 focus:bg-theme-700",
                          !isCurrent(subItem, $url.pathname) && "text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
                        )}
                      >
                        {#if subItem.icon !== undefined} <SidebarIcon className="h-5 w-5 text-white" icon={subItem.icon} />{/if}
                        <div>{subItem.title}</div>
                      </Link>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
