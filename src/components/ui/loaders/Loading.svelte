<script lang="ts">
  const sandbox = import.meta.env.VITE_SVELTE_APP_SERVICE === "sandbox";

  import { _ as t } from "svelte-i18n";
</script>

<div class="pt-4 space-y-2 pb-4 text-center">
  <div class="h-auto w-full flex justify-center py-12 flex-col text-center space-y-4">
    {#if sandbox}
      <div class="font-medium italic text-sm">{$t("shared.fakeLoading")}...</div>
    {/if}
    <div class="loader ease-linear rounded-full border-8 border-t-8 border-slate-200 h-20 w-20 mx-auto" />
  </div>
</div>
