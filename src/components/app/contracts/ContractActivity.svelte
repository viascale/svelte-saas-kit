<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import type { ContractActivityDto } from "@/application/dtos/app/contracts/ContractActivityDto";
  import DateUtils from "@/utils/shared/DateUtils";
  import { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
  import { _ as t } from "svelte-i18n";

  export let items: ContractActivityDto[];

  $: sortedItems = () => {
    return items.slice().sort((x, y) => {
      if (x.createdAt && y.createdAt) {
        return x.createdAt > y.createdAt ? 1 : -1;
      }
      return 1;
    });
  };

  function dateDM(value: Date | undefined) {
    return DateUtils.dateDM(value);
  }

  function getActivityTitle(activity: ContractActivityDto) {
    switch (activity.type) {
      case ContractActivityType.CREATED:
        return $t("app.contracts.activity.types.CREATED");
    }
  }
</script>

<div>
  <h3 class="mb-2 text-gray-400 font-medium text-sm">{$t("models.contract.activity")}</h3>
  <div class="bg-white p-3 rounded-md border border-gray-100 shadow-md space-y-3 overflow-hidden">
    <div class="flow-root">
      <ul role="list" class="-mb-8">
        {#each sortedItems() as activity, idxActivity}
          <li>
            <div class="relative pb-8">
              {#if items.length > 0 && idxActivity + 1 < items.length}
                <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              {/if}

              <div class="relative flex space-x-3">
                <div>
                  <span class={classNames("h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white")}>
                    <!--Heroicon name: solid/user -->
                    {#if activity.type === ContractActivityType.CREATED}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    {/if}
                  </span>
                </div>
                <div class="flex-grow">
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    <div class="truncate">
                      <div class="text-sm text-gray-500">
                        <div class="text-gray-900 truncate">
                          <span title={getActivityTitle(activity)}>{getActivityTitle(activity)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right text-xs whitespace-nowrap text-gray-500 lowercase">
                      {#if activity.createdAt} <time>{dateDM(activity.createdAt)}</time>{/if}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    {#if activity.createdByUser} <div class="font-light text-xs">{activity.createdByUser.email}</div>{/if}
                  </div>
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
