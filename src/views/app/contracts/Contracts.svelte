<script lang="ts">
  import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
  import ContractsList from "@/components/app/contracts/ContractsList.svelte";
  import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.svelte";
  import Tabs from "@/components/ui/tabs/Tabs.svelte";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let status: string = "";

  // let filter: ContractStatusFilter = ContractStatusFilter.ALL;
  const tabs = [
    {
      name: $t("shared.all"),
      routePath: "/app/contracts/all",
    },
    {
      name: $t("app.contracts.pending.title"),
      routePath: "/app/contracts/pending",
    },
    {
      name: $t("app.contracts.signed.title"),
      routePath: "/app/contracts/signed",
    },
    {
      name: $t("app.contracts.archived.title"),
      routePath: "/app/contracts/archived",
    },
  ];

  $: filter = () => {
    switch (status) {
      case "pending":
        return ContractStatusFilter.PENDING;
      case "signed":
        return ContractStatusFilter.SIGNED;
      case "archived":
        return ContractStatusFilter.ARCHIVED;
      case "all":
        return ContractStatusFilter.ALL;
      default:
        navigate("/app/contracts/pending");
        break;
    }
    return ContractStatusFilter.ALL;
  };
</script>

<svelte:head>
  <title>{$t("models.contract.plural")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">{$t("models.contract.plural")}</h1>
      <div class="flex items-center">
        <ButtonPrimary to="/app/contract/new">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span class="hidden lg:block">{$t("app.contracts.new.title")}</span>
          <span class="lg:hidden">{$t("shared.new")}</span>
        </ButtonPrimary>
      </div>
    </div>
  </div>
  <div class="bg-white border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <Tabs {tabs} className="flex-grow" />
    </div>
  </div>
  <div class="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ContractsList filter={filter()} />
  </div>
</div>
