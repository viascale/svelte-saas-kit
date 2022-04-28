<script lang="ts">
  import type { ContractMemberDto } from "@/application/dtos/app/contracts/ContractMemberDto";
  import { accountState } from "@/store/modules/accountStore";
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";

  export let items: ContractMemberDto[];

  $: currentEmail = $accountState.user?.email ?? "";

  $: sortedItems = () => {
    return items?.slice().sort((x, y) => {
      return x.user.firstName > y.user.firstName ? 1 : -1;
    });
  };
</script>

<div>
  <h3 class="mb-2 text-gray-400 font-medium text-sm">{$t("models.contract.members")}</h3>
  <div class="bg-white border-gray-200 rounded-md border shadow-md overflow-hidden">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200">
        {#each sortedItems() as member}
          <li class={classNames("flex items-center justify-between py-2 px-4 space-x-2")}>
            <div class="truncate">
              <div class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between">
                <div class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between">
                  {#if member.user.email === currentEmail} <span class="text-theme-600 font-normal capitalize mr-1">({$t("shared.you")})</span>{/if}
                  {member.user.firstName}
                  {member.user.lastName}
                </div>

                {#if member.role === 0}
                  <div class="text-gray-400 inline-flex items-centerpx-2.5 py-0.5 text-sm leading-5 font-medium rounded-full hover:bg-gray-50" />
                {/if}
              </div>
              <div class="flex items-center space-x-2 justify-between truncate">
                <p class="text-sm text-gray-500 truncate">{member.user.email}</p>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
