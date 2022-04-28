<script lang="ts">
  import Breadcrumb from "./Breadcrumb.svelte";

  let currentRoute = location.pathname;
</script>

<div class="space-y-2 w-full">
  <Breadcrumb
    className="w-full"
    home="/"
    menu={[{ title: "Home", routePath: "/" }, { title: "Components", routePath: currentRoute }, { title: "Breadcrumbs" }]}
  />
</div>
