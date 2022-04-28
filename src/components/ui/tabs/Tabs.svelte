<script lang="ts">
  import { _ as t } from "svelte-i18n";
  import { Link, navigate } from "svelte-routing";
  import classNames from "@/utils/shared/ClassesUtils";
  import type { TabItem } from "./TabItem";
  import { createEventDispatcher } from "svelte";
  import url from "@/router/url";
  const dispatch = createEventDispatcher();

  export let tabs: TabItem[] = [];
  export let className: string = "";
  export let asLinks: boolean = true;

  let selected = 0;

  function change(event: any) {
    selectTab(event.currentTarget.value);
  }
  function selectTab(idx: number) {
    const tab = tabs[idx];
    if (asLinks) {
      if (tab?.routePath) {
        navigate(tab.routePath);
      }
    } else {
      // selected = (idx);
      selected = idx;
      dispatch("selected", { idx });
    }
  }
  $: currentTab = () => {
    if (asLinks) {
      return tabs.find((element) => element.routePath && $url.pathname === element.routePath);
    } else {
      return tabs[selected];
    }
  };
</script>

<div class={className}>
  <div class="sm:hidden">
    <label for="tabs" class="sr-only">
      {$t("app.shared.tabs.select")}
    </label>
    <select
      id="tabs"
      name="tabs"
      class="block w-full focus:ring-theme-500 focus:border-theme-500 border-gray-300 rounded-sm"
      on:change={change}
      value={selected}
    >
      {#each tabs as tab, idx}
        <option value={Number(idx)}>
          {tab.name}
        </option>
      {/each}
    </select>
  </div>
  <div class="hidden sm:block">
    {#if asLinks}
      <nav class="flex space-x-4" aria-label="Tabs">
        {#each tabs.filter((f) => f.routePath) as tab, idx}
          <Link
            to={tab.routePath ?? ""}
            class={classNames(
              "truncate border",
              currentTab() === tabs[idx] ? "bg-theme-100 text-theme-700 border border-theme-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              "px-3 py-2 font-medium text-sm rounded-sm border-transparent"
            )}
            aria-current={currentTab() === tabs[idx] ? "page" : undefined}
          >
            {tab.name}
          </Link>
        {/each}
      </nav>
    {:else}
      <nav class="flex space-x-4" aria-label="Tabs">
        {#each tabs as tab, idx}
          <button
            type="button"
            on:click={() => selectTab(idx)}
            class={classNames(
              "truncate border",
              currentTab() === tabs[idx] ? "bg-theme-100 text-theme-700 border border-theme-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              "px-3 py-2 font-medium text-sm rounded-sm border-transparent"
            )}
          >
            {tab.name}
          </button>
        {/each}
      </nav>
    {/if}
  </div>
</div>
