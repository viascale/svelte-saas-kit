<script lang="ts">
  import EmployeesList from "@/components/app/employees/EmployeesList.svelte";
  import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.svelte";
  import { _ as t } from "svelte-i18n";
</script>

<svelte:head>
  <title>{$t("models.employee.plural")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">{$t("app.employees.my")}</h1>
      <div class="flex items-center space-x-2">
        <ButtonPrimary to="/app/employees/new">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>

          <div>{$t("app.employees.new.title")}</div>
        </ButtonPrimary>
      </div>
    </div>
  </div>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    <EmployeesList />
  </div>
</div>
