<script lang="ts">
  import { onMount } from "svelte";
  import ErrorModal from "../ui/modals/ErrorModal.svelte";
  import NewLink from "./links/pending/NewLink.svelte";
  import services from "@/services";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
  import StackedLayout from "../layouts/StackedLayout.svelte";
  import SidebarLayout from "../layouts/SidebarLayout.svelte";
  import TenantNew from "../core/settings/tenant/TenantNew.svelte";
  import { _ as t } from "svelte-i18n";
  import { appState } from "@/store/modules/appStore";
  import { navigate } from "svelte-routing";

  export let layout: "app" | "admin";

  let newLink: NewLink;
  let errorModal: ErrorModal;

  let addingTenant = false;

  onMount(() => {
    services.tenants.getAll();
    services.workspaces.getAllWorkspaces(true).then((response) => {
      if (response.length === 0) {
        errorModal?.show($t("app.workspaces.errors.noWorkspaces"), $t("app.workspaces.errors.addAtLeastOneWorkspace"));
        navigate("/app/settings/workspaces");
      }
    });

    tinyEventBus().emitter.on("view-pending-invitations", () => {
      navigate("/app/links/pending");
    });
    tinyEventBus().emitter.on("new-provider", () => {
      newLink?.show(false, false);
    });
    tinyEventBus().emitter.on("new-client", () => {
      newLink?.show(true, false);
    });
    tinyEventBus().emitter.on("new-link", () => {
      newLink?.show(true, true);
    });

    return () => {
      tinyEventBus().emitter.off("view-pending-invitations");
      tinyEventBus().emitter.off("view-pending-links");
      tinyEventBus().emitter.off("view-links-information");
      tinyEventBus().emitter.off("new-provider");
      tinyEventBus().emitter.off("new-client");
      tinyEventBus().emitter.off("new-link");
    };
  });

  // $: currentWorkspaceId = $tenantState.currentWorkspace.id ?? "";
  $: currentLayout = $appState.layout;
</script>

<!-- // TODO: KEY: WORKSPACE -->
<div>
  {#if currentLayout === ApplicationLayout.STACKED}
    <StackedLayout {layout}>
      <slot />
    </StackedLayout>
  {:else}
    <SidebarLayout {layout} on:addTenant={() => (addingTenant = true)}>
      <slot />
    </SidebarLayout>
  {/if}

  {#if addingTenant}
    <TenantNew
      close={() => {
        addingTenant = false;
      }}
    />
  {/if}

  <NewLink bind:this={newLink} asProvider={false} selectType={false} />
  <ErrorModal bind:this={errorModal} />
</div>
