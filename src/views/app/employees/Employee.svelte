<script lang="ts">
  import EmployeeProfile from "@/components/app/employees/EmployeeProfile.svelte";
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import { _ as t } from "svelte-i18n";

  export let id: string = "";
</script>

<svelte:head>
  <title>{$t("models.employee.object")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <Breadcrumb menu={[{ title: $t("models.employee.plural"), routePath: "/app/employees" }]} />
  <EmployeeProfile {id} />
</div>
