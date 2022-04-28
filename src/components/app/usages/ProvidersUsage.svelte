<script lang="ts">
  import { Link } from "svelte-routing";
  import services from "@/services";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { appState } from "@/store/modules/appStore";

  let loading: boolean = false;

  onMount(() => {
    loading = true;
    services.tenants.getCurrentUsage(AppUsageType.PROVIDERS).finally(() => {
      loading = false;
    });
  });
  $: providers = $appState.usage?.providers ?? 0;
</script>

<Link to="/app/links/providers" class="px-4 py-5 border shadow-md rounded-lg overflow-hidden sm:p-6 bg-white border-gray-300 hover:bg-gray-50">
  <div>
    <dt class="text-sm font-medium text-gray-500 truncate">
      {$t("models.provider.plural")}
      {#if loading}
        <dd class="mt-1 text-xl font-semibold text-gray-900">...</dd>
      {:else}
        <dd class="mt-1 text-gray-900 truncate">
          <span class="text-xl font-semibold">{providers}</span>
        </dd>
      {/if}
    </dt>
  </div>
</Link>
