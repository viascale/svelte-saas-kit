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
    services.tenants.getCurrentUsage(AppUsageType.EMPLOYEES).finally(() => {
      loading = false;
    });
  });
  $: employees = $appState.usage?.employees ?? 0;
</script>

<Link to="/app/employees" class="px-4 py-5 border shadow-md rounded-lg overflow-hidden sm:p-6 bg-white border-gray-300 hover:bg-gray-50">
  <div>
    <dt class="text-sm font-medium text-gray-500 truncate">{$t("models.employee.plural")}</dt>
    {#if loading}
      <dd class="mt-1 text-xl font-semibold text-gray-900">...</dd>
    {:else}
      <dd class="mt-1 text-gray-900 truncate">
        <span class="text-xl font-semibold">{employees}</span>
      </dd>
    {/if}
  </div>
</Link>
