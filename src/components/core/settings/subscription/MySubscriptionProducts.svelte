<script lang="ts">
  import { Link } from "svelte-routing";
  import type { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
  import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { appState } from "@/store/modules/appStore";

  export let withCurrentPlan: boolean;
  export let className: string = "";
  export let cols: string = "grid-cols-2 sm:grid-cols-2 xl:grid-cols-4";

  let loading: boolean = false;
  let subscription: SubscriptionGetCurrentResponse | null = null;
  let workspaces: WorkspaceDto[] = [];
  let users: TenantUserDto[] = [];

  onMount(() => {
    tinyEventBus().emitter.on("updated-plan", () => {
      reload();
    });
    reload();

    return () => {
      tinyEventBus().emitter.off("updated-plan");
    };
  });

  function reload() {
    loading = true;

    const promises: any[] = [];

    const loadDashboard = services.subscriptionManager.getCurrentSubscription().then((response) => {
      subscription = response;
    });
    const loadWorkspaces = services.workspaces.getAllWorkspaces(false).then((response) => {
      workspaces = response;
    });
    const loadUsers = services.tenantUsers.getAll().then((response) => {
      users = response;
    });
    promises.push(loadDashboard);
    promises.push(loadWorkspaces);
    // promises.push(loadFeatures);
    promises.push(loadUsers);

    loading = true;
    Promise.all(promises).finally(() => {
      loading = false;
    });
  }
  $: billableStatus = (max: number) => {
    if (loading) {
      return 2;
    }
    if (!currentProduct) {
      return 0;
    }
    if (max === 0) {
      return 1;
    }
    if (max > 0) {
      return 2;
    }
    return 0;
  };
  $: currentProduct = subscription?.myProducts && subscription?.myProducts.length > 0 ? subscription?.myProducts[0] : undefined;
  $: usage = $appState.usage;
  $: links = ($appState.usage?.providers ?? 0) + ($appState.usage?.clients ?? 0);
  $: maxLinksRemaining = () => {
    if (!currentProduct || !usage) {
      return 1;
    }
    const remaining = currentProduct.maxLinks - links;
    return remaining;
  };
  $: maxDocumentsRemaining = () => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.monthlyContracts - usage.contracts;
  };
  $: maxWorkspacesRemaining = () => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.maxWorkspaces - workspaces.length;
  };
  $: maxUsersRemaining = () => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.maxUsers - users.length;
  };
</script>

<div class={className}>
  <div>
    {#if withCurrentPlan}
      <div class="space-y-2 sm:space-y-0 sm:flex items-center sm:space-x-2 justify-between">
        <h3 class="leading-5 text-gray-900 truncate">
          {#if loading}
            <span class="leading-5">{$t("shared.loading")}...</span>
          {:else if currentProduct}
            <span>
              {$t("settings.subscription.current")}{" "}
              <Link to="/app/settings/subscription" class="leading-5 font-bold hover:underline hover:text-theme-600">
                {$t(currentProduct.subscriptionProduct.title)}
              </Link>
            </span>
          {:else if !loading}
            <span class="ml-1 text-sm leading-5 font-bold text-gray-500">({$t("settings.subscription.noActivePlan")})</span>
          {:else}
            <div />
          {/if}
        </h3>
      </div>
    {/if}
    <dl class={classNames("grid gap-5", cols, withCurrentPlan && "mt-2 ")}>
      <div
        class={classNames(
          "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6",
          billableStatus(maxLinksRemaining()) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
          billableStatus(maxLinksRemaining()) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
          billableStatus(maxLinksRemaining()) === 2 && "bg-white"
        )}
      >
        <dt class="text-sm font-medium text-gray-500 truncate">{$t("models.link.plural")}</dt>
        <dd class="mt-1 text-xl font-semibold text-gray-900">
          {#if loading}
            <span>...</span>
          {:else}
            <span>
              {#if links} <span>{links}</span> {:else} <span>0</span>{/if} /{" "}
              {#if currentProduct} <span>{currentProduct.maxLinks}</span> {:else} <span class="text-gray-500">0</span>{/if}
            </span>
          {/if}
        </dd>
      </div>

      <Link
        to="/app/contracts/pending"
        class={classNames(
          "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
          billableStatus(maxDocumentsRemaining()) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
          billableStatus(maxDocumentsRemaining()) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
          billableStatus(maxDocumentsRemaining()) === 2 && "bg-white"
        )}
      >
        <dt class="text-sm font-medium text-gray-500 truncate">{$t("models.contract.plural")}</dt>
        <dd class="mt-1 text-xl font-semibold text-gray-900">
          {#if loading}
            <span>...</span>
          {:else}
            <span>
              {#if usage && usage.contracts} <span>{usage.contracts}</span> {:else} <span>0</span>{/if} /{" "}
              {#if currentProduct} <span>{currentProduct.monthlyContracts}</span> {:else} <span class="text-gray-500">0</span>{/if}
            </span>
          {/if}
        </dd>
      </Link>

      <Link
        to="/app/settings/workspaces"
        class={classNames(
          "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
          billableStatus(maxWorkspacesRemaining()) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
          billableStatus(maxWorkspacesRemaining()) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
          billableStatus(maxWorkspacesRemaining()) === 2 && "bg-white"
        )}
      >
        <dt class="text-sm font-medium text-gray-500 truncate">{$t("models.workspace.plural")}</dt>
        <dd class="mt-1 text-xl font-semibold text-gray-900">
          {#if loading}
            <span>...</span>
          {:else}
            <span>
              {#if usage} <span>{workspaces.length}</span> {:else} <span>0</span>{/if} /{" "}
              {#if currentProduct} <span>{currentProduct.maxWorkspaces}</span> {:else} <span class="text-gray-500">0</span>{/if}
            </span>
          {/if}
        </dd>
      </Link>
      <Link
        to="/app/settings/members"
        class={classNames(
          "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
          billableStatus(maxUsersRemaining()) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
          billableStatus(maxUsersRemaining()) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
          billableStatus(maxUsersRemaining()) === 2 && "bg-white"
        )}
      >
        <dt class="text-sm font-medium text-gray-500 truncate">{$t("models.user.plural")}</dt>
        <dd class="mt-1 text-xl font-semibold text-gray-900">
          {#if loading}
            <span>...</span>
          {:else}
            <span>
              {#if usage} <span>{users.length}</span> {:else} <span>0</span>{/if} /{" "}
              {#if currentProduct} <span>{currentProduct.maxUsers}</span> {:else} <span class="text-gray-500">0</span>{/if}
            </span>
          {/if}
        </dd>
      </Link>
    </dl>
  </div>
</div>
