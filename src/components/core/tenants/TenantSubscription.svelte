<script lang="ts">
  import { onMount } from "svelte";
  import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
  import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
  import type { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
  import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
  import services from "@/services";
  import DateUtils from "@/utils/shared/DateUtils";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import { _ as t } from "svelte-i18n";

  export let id: string = "";

  let loading: boolean = false;

  let item: TenantDto = {} as TenantDto;
  let products: TenantProductDto[] = [];

  const headers = [
    {
      title: $t("app.tenants.subscription.plan"),
    },
    {
      title: $t("app.tenants.subscription.price"),
    },
    {
      title: $t("app.tenants.subscription.starts"),
    },
    {
      title: $t("app.tenants.subscription.ends"),
    },
    {
      title: $t("app.tenants.subscription.isTrial"),
    },
    {
      title: $t("app.tenants.subscription.status"),
    },
    {
      title: $t("app.tenants.subscription.workspaces"),
    },
    {
      title: $t("app.tenants.subscription.members"),
    },
    {
      title: $t("app.tenants.subscription.links"),
    },
    {
      title: $t("models.contract.plural"),
    },
    {
      title: $t("app.tenants.subscription.storage"),
    },
  ];

  onMount(() => {
    reload();
  });

  function reload() {
    // closeOptions();
    const promises: any[] = [
      services.tenants.get(id).then((response) => {
        item = response;
      }),
      services.tenants.adminGetProducts(id).then((response) => {
        products = response;
      }),
    ];

    loading = true;
    Promise.all(promises).finally(() => {
      loading = false;
    });
  }
  // function closeOptions() {
  //  openOptions = (false);
  // }
  function priceBillingPeriod(price: SubscriptionPriceDto): string {
    if (price.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return $t("pricing.once").toString();
    } else {
      return "/" + $t("pricing." + SubscriptionBillingPeriod[price.billingPeriod] + "Short");
    }
  }
  function dateAgo(value: Date) {
    return DateUtils.dateAgo(value);
  }
  function dateYMD(value: Date | undefined) {
    return DateUtils.dateYMD(value);
  }
</script>

<div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />
    {:else if item && item.id}
      <div>
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
              <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      {#each headers as header}
                        <th scope="col" class="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate">
                          <div class="flex items-center space-x-1 text-gray-500">
                            <div>{header.title}</div>
                          </div>
                        </th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each products as item}
                      <tr>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                          {#if item.subscriptionPrice && item.subscriptionPrice.subscriptionProduct}
                            <span>{$t(item.subscriptionPrice.subscriptionProduct.title)}</span>
                          {/if}
                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                          {#if item.subscriptionPrice}
                            <span>
                              {item.subscriptionPrice.price}
                              {priceBillingPeriod(item.subscriptionPrice)}
                            </span>
                          {/if}
                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{dateYMD(item.startDate)}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{dateYMD(item.endDate)}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                          {#if item.trialEnds}
                            <span>
                              {$t("settings.subscription.trial.ends")}
                              {dateAgo(item.trialEnds)}
                            </span>
                          {/if}
                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                          {#if item.active} <span>{$t("shared.active")}</span> {:else} <span>{$t("shared.inactive")}</span>{/if}
                        </td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.maxWorkspaces}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.maxUsers}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.maxLinks}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.monthlyContracts}</td>
                        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.maxStorage / 1024}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div />
    {/if}
  </div>
</div>
