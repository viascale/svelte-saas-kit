<script lang="ts">
  import TenantProfile from "@/components/core/tenants/TenantProfile.svelte";
  import TenantSubscription from "@/components/core/tenants/TenantSubscription.svelte";
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import Tabs from "@/components/ui/tabs/Tabs.svelte";
  import type { TabItem } from "@/components/ui/tabs/TabItem";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";

  export let tenantId: string = "";

  onMount(() => {
    console.log("tenantId", tenantId);
  });
  let selected = 0;

  const tabs: TabItem[] = [
    {
      name: $t("admin.tenants.profile.title"),
    },
    {
      name: $t("admin.tenants.subscription.title"),
    },
  ];

  function selectedTab(event: any) {
    selected = Number(event.detail.idx);
  }
</script>

<div>
  <Breadcrumb home="/admin" menu={[{ title: $t("models.tenant.plural"), routePath: "/admin/tenants" }]} />
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-3 px-8 h-13">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between">
      <Tabs asLinks={false} {tabs} on:selected={selectedTab} className="flex-grow" />
    </div>
  </div>
  <div>
    {#if selected === 0} <TenantProfile id={tenantId} />{/if}
    {#if selected === 1} <TenantSubscription id={tenantId} />{/if}
  </div>
</div>
