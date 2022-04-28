<script lang="ts">
  import AllComponentsList from "@/components/ui/AllComponentsList.svelte";
  import { _ as t } from "svelte-i18n";
</script>

<svelte:head>
  <title>{$t("admin.components.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">{$t("admin.components.title")}</h1>
    </div>
  </div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
    <AllComponentsList withSlideOvers={true} />
  </div>
</div>
