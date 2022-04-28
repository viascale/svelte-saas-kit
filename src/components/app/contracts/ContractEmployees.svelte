<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import type { ContractEmployeeDto } from "@/application/dtos/app/contracts/ContractEmployeeDto";
  import { _ as t } from "svelte-i18n";

  export let items: ContractEmployeeDto[];

  $: sortedItems = () => {
    return items?.slice().sort((x, y) => {
      return x.employee.firstName > y.employee.firstName ? 1 : -1;
    });
  };
</script>

<div>
  <h3 class="mb-2 text-gray-400 font-medium text-sm">{$t("models.employee.plural")}</h3>
  <div class="bg-white border-gray-200 rounded-md border shadow-md overflow-hidden">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200">
        {#each sortedItems() as employee}
          <li class={classNames("flex items-center justify-between py-2 px-4 space-x-2")}>
            <div class="truncate">
              <div class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between">
                <div class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between">
                  {employee.employee.firstName}
                  {employee.employee.lastName}
                </div>
              </div>
              <div class="flex items-center space-x-2 justify-between truncate">
                <p class="text-sm text-gray-500 truncate">{employee.employee.email}</p>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
