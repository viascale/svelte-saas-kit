<script lang="ts">
  import Tabs from "@/components/ui/tabs/Tabs.svelte";
  import type { TabItem } from "@/components/ui/tabs/TabItem";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  if (location.pathname?.toString() === "/app/settings") {
    navigate("/app/settings/profile");
  }
  const tabs: TabItem[] = [
    {
      name: $t("settings.profile.profileTitle"),
      routePath: "/app/settings/profile",
    },
    {
      name: $t("models.workspace.plural"),
      routePath: "/app/settings/workspaces",
    },
    {
      name: $t("settings.members.title"),
      routePath: "/app/settings/members",
    },
    {
      name: $t("settings.subscription.title"),
      routePath: "/app/settings/subscription",
    },
    {
      name: $t("settings.tenant.title"),
      routePath: "/app/settings/tenant",
    },
  ];
</script>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex space-x-3 items-center justify-between px-4 sm:px-6 lg:px-8">
      <Tabs {tabs} className="flex-grow" />
    </div>
  </div>
  <slot />
</div>
