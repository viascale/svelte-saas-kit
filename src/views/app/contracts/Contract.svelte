<script lang="ts">
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import ContractDetails from "@/components/app/contracts/ContractDetails.svelte";
  import { _ as t } from "svelte-i18n";

  export let id: string = "";
</script>

<svelte:head>
  <title>{$t("models.contract.object")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <Breadcrumb
    menu={[
      {
        title: $t("app.contracts.title"),
        routePath: "/app/contracts/pending",
      },
    ]}
  />
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
    <ContractDetails id={id ?? ""} />
  </div>
</div>
