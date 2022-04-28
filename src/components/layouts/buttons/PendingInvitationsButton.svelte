<script lang="ts">
  import services from "@/services";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import classNames from "@/utils/shared/ClassesUtils";

  import { _ as t } from "svelte-i18n";
  import { appState } from "@/store/modules/appStore";
  import { tenantState } from "@/store/modules/tenantStore";
  import { onMount } from "svelte";

  onMount(() => {
    services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
  });

  function showPendingLinks() {
    tinyEventBus().emitter.emit("view-pending-invitations");
  }
  $: pendingInvitations = $appState.usage?.pendingInvitations ?? 0;
  $: currentRole = $tenantState.current?.currentUser.role;
</script>

<div>
  <!--Pending invitations (links) -->
  {#if currentRole && currentRole < 3}
    <div class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
      <div class="text-sm relative z-0 inline-flex shadow-none rounded-full">
        <button
          on:click={showPendingLinks}
          type="button"
          class={classNames(
            "text-gray-800 bg-gray-50 border-gray-100 shadow-inner border relative inline-flex items-center p-2 rounded-full font-medium hover:bg-theme-300 hover:text-theme-800 focus:bg-theme-400 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-100",
            pendingInvitations > 0 &&
              "px-3 flex space-x-2 text-theme-900 bg-theme-50 border-theme-300 hover:bg-theme-100 hover:text-theme-800 focus:bg-theme-200 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-100",
            (!pendingInvitations || pendingInvitations === 0) &&
              " text-gray-800 bg-gray-50 border-gray-100 hover:bg-theme-300 hover:text-theme-800 focus:bg-theme-400 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-50"
          )}
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          {#if pendingInvitations > 0}
            <div>
              <span>{pendingInvitations} </span>
              {#if pendingInvitations === 1}
                <span class="hidden md:inline-block lowercase">{$t("app.links.pending.one")}</span>
              {:else}
                <span class="hidden md:inline-block lowercase">{$t("app.links.pending.multiple")}</span>;
              {/if}
            </div>
          {/if}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}
  <!--Pending invitations (links): End -->
</div>
