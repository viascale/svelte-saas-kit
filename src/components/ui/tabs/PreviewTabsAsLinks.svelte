<script lang="ts">
  import Tabs from "./Tabs.svelte";

  const currentRoute = location.pathname;
</script>

<div class="space-y-2 w-full">
  <Tabs
    asLinks={true}
    className="w-full sm:w-auto"
    tabs={[
      { name: "Home", routePath: "/" },
      { name: "Components", routePath: currentRoute },
    ]}
  />
</div>
