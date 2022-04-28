<script lang="ts">
  import { Link } from "svelte-routing";
  import TenantSelector from "./selectors/TenantSelector.svelte";
  import WorkspaceSelector from "./selectors/WorkspaceSelector.svelte";
  import SidebarMenu from "./SidebarMenu.svelte";
  import LayoutSelector from "../ui/selectors/LayoutSelector.svelte";
  import LocaleSelector from "../ui/selectors/LocaleSelector.svelte";
  import ChatSupportButton from "./buttons/ChatSupportButton.svelte";
  import PendingInvitationsButton from "./buttons/PendingInvitationsButton.svelte";
  import ProfileButton from "./buttons/ProfileButton.svelte";
  import QuickActionsButton from "./buttons/QuickActionsButton.svelte";
  import LogoLight from "@/assets/img/logo-light.png";
  import IconLight from "@/assets/img/icon-light.png";
  import { tenantState } from "@/store/modules/tenantStore";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let layout: "app" | "admin";

  let sidebarOpen = false;

  $: currentWorkspaceId = $tenantState.currentWorkspace?.id ?? "";
</script>

<div class="h-screen flex overflow-hidden bg-gray-100 text-gray-800">
  <!--Mobile sidebar -->

  <div class="md:hidden">
    {#if sidebarOpen}
      <div class="fixed inset-0 flex z-40">
        <transition
          enter-active-class="transition-opacity ease-linear duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-linear duration-300"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0">
            <div class="absolute inset-0 bg-gray-800 opacity-75" />
          </div>
        </transition>

        <div class="relative flex-1 flex flex-col max-w-xs w-full pb-4 bg-gray-900">
          <div class="absolute top-0 right-0 -mr-14 p-1 mt-2">
            <button
              class="flex items-center justify-center h-12 w-12 rounded-sm focus:outline-none focus:bg-gray-600"
              aria-label="Close sidebar"
              on:click={() => (sidebarOpen = !sidebarOpen)}
            >
              <svg class="text-white h-7 w-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-5 flex-1 h-0 overflow-y-auto">
            <nav class="px-2 space-y-2">
              <TenantSelector className="text-sm" on:add={() => dispatch("addTenant")} />
              {#if layout === "app"} <WorkspaceSelector className="text-sm" />{/if}
              <SidebarMenu {layout} on:selected={() => (sidebarOpen = !sidebarOpen)} />
            </nav>
          </div>
        </div>
        <div class="flex-shrink-0 w-14"><!--Dummy element to force sidebar to shrink to fit close icon --></div>
      </div>
    {/if}
  </div>

  <!--Desktop sidebar -->
  <div
    class={sidebarOpen
      ? "hidden transition ease-in duration-1000"
      : "overflow-x-hidden hidden md:flex md:flex-shrink-0 border-r dark:border-r-0 border-theme-200 dark:border-theme-800 shadow-sm dark:shadow-lg"}
  >
    <div class="flex flex-col w-64">
      <div class="flex flex-col h-0 flex-1 shadow-md bg-theme-600">
        <div class="flex-1 flex flex-col overflow-y-auto">
          <nav class="flex-1 px-2 py-4 space-y-3 bg-gray-900 select-none">
            <TenantSelector className="text-xs sm:text-sm" on:add={() => dispatch("addTenant")} />
            {#if layout === "app"}
              <WorkspaceSelector className="text-xs sm:text-sm" on:add={() => (sidebarOpen = false)} on:selected={() => (sidebarOpen = false)} />
            {/if}
            <SidebarMenu {layout} />
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!--Content -->
  <div class="flex flex-col w-0 flex-1 overflow-hidden">
    <div class="relative flex-shrink-0 flex h-14 bg-white shadow-inner border-b border-gray-200">
      <button
        class="px-4 border-r border-gray-200 text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600"
        aria-label="Open sidebar"
        on:click={() => (sidebarOpen = !sidebarOpen)}
      >
        <svg class="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <div class="flex-1 px-3 flex justify-between">
        <div class="flex-1 flex items-center">
          <div class="w-full flex md:ml-0">
            <div class="align-baseline w-full text-slate-200 pl-1">
              <!--Logo -->
              <nav class="lg:hidden">
                <Link to="/app">
                  <img alt="Logo" class="h-7 w-auto sm:hidden" src={IconLight} />
                  <img alt="Logo" class="h-7 w-auto hidden sm:block" src={LogoLight} />
                </Link>
              </nav>
              <nav class="hidden lg:flex items-center text-base leading-5 font-medium">
                <Link to="/app">
                  <img alt="Logo" class="hidden sm:block h-7 sm:h-8 w-auto" src={LogoLight} />
                </Link>
              </nav>
              <!--Logo: End -->
            </div>
          </div>
        </div>
        <div class="flex items-center md:ml-6 space-x-2">
          {#if layout === "admin"} <LayoutSelector className="text-sm" />{/if}
          {#if layout === "admin"} <LocaleSelector className="text-sm" />{/if}
          {#if layout === "app"} <PendingInvitationsButton />{/if}
          {#if layout === "app"} <ChatSupportButton />{/if}
          {#if layout === "app"} <QuickActionsButton />{/if}
          <ProfileButton />
        </div>
      </div>
    </div>

    <main class="flex-1 focus:outline-none overflow-y-auto bg-gray-50" tabIndex={0}>
      {#key currentWorkspaceId}
        <div class="pb-20 sm:pb-0">
          <slot />
        </div>
      {/key}
    </main>
  </div>
</div>
