<script lang="ts">
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import AddEmployees from "@/components/app/employees/AddEmployees.svelte";
  import { _ as t } from "svelte-i18n";
</script>

<div>
  <Breadcrumb
    menu={[
      {
        title: $t("models.employee.plural"),
        routePath: "/app/employees",
      },
      {
        title: $t("shared.new"),
      },
    ]}
  />
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h2 class="flex-1 font-bold flex items-center truncate">{$t("app.employees.new.multiple")}</h2>
    </div>
  </div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
    <AddEmployees />
  </div>
</div>
