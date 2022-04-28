<script lang="ts">
  import services from "@/services";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import { clickOutside } from "@/utils/shared/KeypressUtils";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher, onMount } from "svelte";
  import { tenantState, tenantStore } from "@/store/modules/tenantStore";
  import { navigate } from "svelte-routing";
  const dispatch = createEventDispatcher();

  export let className: string = "";

  let inputSearch: HTMLInputElement;

  let opened: boolean = false;
  let search: string = "";

  onMount(() => {
    if (!currentWorkspace && workspaces && workspaces.length > 0) {
      const defaultWorkspace = workspaces.find((f) => f.default);
      if (defaultWorkspace) {
        change(defaultWorkspace);
      } else {
        change(workspaces[0]);
      }
    }
    if (!workspaces) {
      services.workspaces.getAllWorkspaces(true);
    }
  });
  function addWorkspace() {
    dispatch("add");
    closeDropDown();
    navigate("/app/settings/workspaces/new");
  }
  function closeDropDown() {
    opened = false;
  }
  function toggleDropDown() {
    opened = !opened;
    if (opened) {
      // nextTick(() => {
      inputSearch?.focus();
      inputSearch?.select();
      // });
    }
  }
  function keyUp(event: any) {
    if (event.keyCode == 13) {
      if (sortedItems.length === 1) {
        change(sortedItems[0]);
      }
    }
  }
  function change(workspace: WorkspaceDto) {
    search = "";
    dispatch("selected");
    closeDropDown();
    tenantStore.setCurrentWorkspace(workspace);
  }
  $: workspaces = $tenantState.workspaces;
  $: currentWorkspace = $tenantState.currentWorkspace;
  $: sortedItems = (): WorkspaceDto[] => {
    return (
      workspaces
        ?.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()))
        .sort((x, y) => {
          if (x.name && y.name) {
            return (x.name > y.name ? 1 : -1) ?? 1;
          }
          return 1;
        }) ?? []
    );
  };
</script>

<div class={className} use:clickOutside on:click_outside={() => (opened = false)}>
  <div class="relative text-left w-auto">
    <span class="inline-block w-full rounded-sm shadow-sm">
      <button
        class="bg-slate-800 hover:bg-theme-600 hover:text-theme-50 truncate text-slate-300 cursor-pointer w-full pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:leading-5 rounded-sm shadow-sm"
        on:click={toggleDropDown}
      >
        <div class="font-bold truncate pr-7 sm:hidden">
          {#if currentWorkspace}
            <span class="truncate">{currentWorkspace.name}</span>
          {:else}
            <span class="text-gray-600">- {$t("app.workspaces.select")} -</span>
          {/if}
        </div>
        <div class="font-bold truncate pr-7 hidden sm:block sm:w-full">
          {#if currentWorkspace}
            <span class="mt-4 truncate">{currentWorkspace.name}</span>
          {:else}
            <span class="mt-4 text-gray-600">- {$t("app.workspaces.select")} -</span>
          {/if}
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </button>
    </span>

    <!--Select popover, show/hide based on select state. -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      {#if opened}
        <div class="z-40 absolute object-top mt-1 w-full rounded-sm bg-white shadow-lg">
          <div class="m-1 border border-gray-100 relative flex items-stretch flex-grow focus-within:z-10">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <!--Heroicon name: solid/users -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search"
              bind:this={inputSearch}
              placeholder={$t("shared.searchDot")}
              bind:value={search}
              autoComplete="none"
              onKeyUp={keyUp}
              class="focus:ring-theme-500 focus:border-theme-500 block w-full rounded-none rounded-l-sm pl-10 sm:text-sm px-3 py-2 bg-gray-100 text-sm focus:outline-none"
            />
          </div>
          <div class="max-h-60 rounded-sm text-sm leading-5 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {#each sortedItems() as workspace}
              <button
                role="option"
                title={workspace.name}
                class="text-left w-full text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-5 hover:bg-gray-100 border-gray-100 font-medium truncate focus:outline-none"
                on:click={() => change(workspace)}
              >
                {workspace.name}
              </button>
            {/each}

            <button
              on:click={addWorkspace}
              role="option"
              class="text-theme-600 w-full text-sm text-left font-bold cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-theme-700"
            >
              {$t("shared.add")}
            </button>
          </div>
        </div>
      {/if}
    </transition>
  </div>
</div>
