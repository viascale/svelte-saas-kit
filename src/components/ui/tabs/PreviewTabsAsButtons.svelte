<script lang="ts">
  import Tabs from "./Tabs.svelte";

  let selectedTab: number = 0;
</script>

<div class="space-y-2 w-full">
  <Tabs
    asLinks={false}
    on:selected={(event) => {
      selectedTab = event.detail.idx;
    }}
    className="w-full sm:w-auto"
    tabs={[{ name: "Tab 1" }, { name: "Tab 2" }, { name: "Tab 3" }]}
  />
  <div class="p-2 bg-gray-100 border border-gray-300">
    {#if selectedTab === 0}
      <div>Tab 1 Content...</div>
    {:else if selectedTab === 1}
      <div>Tab 2 Content...</div>
    {:else}
      <div>Tab 3 Content...</div>
    {/if}
  </div>
</div>
