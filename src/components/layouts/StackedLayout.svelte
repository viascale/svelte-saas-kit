<script lang="ts">
  import { Link } from "svelte-routing";
  import type { SideBarItem } from "@/application/sidebar/SidebarItem";
  import { AdminSidebar } from "@/application/sidebar/AdminSidebar";
  import { AppSidebar } from "@/application/sidebar/AppSidebar";
  import { UserType } from "@/application/enums/core/users/UserType";
  import type { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";

  import UserUtils from "@/utils/store/UserUtils";
  import type { SidebarGroup } from "@/application/sidebar/SidebarGroup";

  import classNames from "@/utils/shared/ClassesUtils";
  import LayoutSelector from "../ui/selectors/LayoutSelector.svelte";
  import LocaleSelector from "../ui/selectors/LocaleSelector.svelte";
  import QuickActionsButton from "./buttons/QuickActionsButton.svelte";
  import ProfileButton from "./buttons/ProfileButton.svelte";
  import SidebarMenu from "./SidebarMenu.svelte";
  import LogoLight from "@/assets/img/logo-light.png";
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";
  import { authStore } from "@/store/modules/authStore";
  import { accountState } from "@/store/modules/accountStore";
  import { tenantState } from "@/store/modules/tenantStore";

  export let layout: "app" | "admin";

  let currentRoute = location.pathname;

  let menu: SideBarItem[] = [];
  let menuOpened = false;

  onMount(() => {
    if (layout === "admin") {
      menu = AdminSidebar;
    } else {
      menu = AppSidebar;
    }
  });

  $: currentUserType = $accountState.user?.type ?? UserType.Tenant;
  $: currentUserRole = $tenantState.current?.currentUser?.role as TenantUserRole;

  function allowCurrentUserType(types: UserType[] | undefined) {
    return !types || types.includes(currentUserType);
  }
  function allowCurrentRole(roles: TenantUserRole[] | undefined) {
    return !roles || roles.includes(currentUserRole);
  }
  function signOut() {
    authStore.logout();
    UserUtils.loggedOut();
  }
  $: getMenu = (): SidebarGroup[] => {
    const _menu: SidebarGroup[] = [];
    menu
      .filter((f) => allowCurrentUserType(f.userTypes) && allowCurrentRole(f.userRoles))
      .forEach(({ title, items }) => {
        _menu.push({
          title: title.toString(),
          items: items?.filter((f) => allowCurrentUserType(f.userTypes) && allowCurrentRole(f.userRoles)) ?? [],
        });
      });
    return _menu.filter((f) => f.items.length > 0);
  };
  $: currentWorkspaceId = $tenantState.currentWorkspace?.id ?? "";
</script>

<div>
  <nav class="bg-gray-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-3 justify-between h-16">
        <div class="flex items-center space-x-2 overflow-x-auto py-1">
          <div class="flex-shrink-0">
            <Link to="/app">
              <img class="h-8 w-auto" src={LogoLight} alt="Workflow" />
            </Link>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <!--Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              {#each getMenu() as group}
                <div class="flex items-baseline space-x-4 py-1">
                  {#each group.items as menuItem}
                    <div>
                      <Link
                        to={menuItem.path}
                        class={classNames(
                          "px-3 py-2 rounded-md text-sm font-medium truncate",
                          currentRoute === menuItem.path ? "text-white bg-theme-700" : "text-gray-500 hover:bg-gray-700 hover:text-white"
                        )}
                        aria-current="page"
                        on:click={() => (menuOpened = false)}
                      >
                        {menuItem.title}
                      </Link>
                    </div>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0">
          {#if layout === "admin"} <LayoutSelector className="text-sm" />{/if}
          {#if layout === "admin"} <LocaleSelector className="text-sm" />{/if}
          {#if layout === "app"} <QuickActionsButton className="text-gray-400" />{/if}
          <ProfileButton />
          <button
            on:click={() => (menuOpened = !menuOpened)}
            type="button"
            class="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-800 focus:ring-theme-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!--Heroicon name: outline/menu -->
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!--Heroicon name: outline/x -->
            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!--Mobile menu, show/hide based on menu state. -->
    {#if menuOpened}
      <div id="mobile-menu" class="bg-slate-900">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <!--Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <SidebarMenu {layout} on:selected={() => (menuOpened = false)} />
        </div>
        <div class="pt-2 pb-3 border-t border-gray-700">
          <div class="px-2 space-y-1">
            <Link
              on:click={() => (menuOpened = !menuOpened)}
              to="/app/settings/profile"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {$t("settings.profile.profileTitle")}
            </Link>

            <button
              type="button"
              on:click={signOut}
              class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {$t("app.navbar.signOut")}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </nav>
  <main>
    <div class="mx-auto">
      {#key currentWorkspaceId}
        <!--Replace with your content -->
        <slot />
        <!--/End replace -->
      {/key}
    </div>
  </main>
</div>
