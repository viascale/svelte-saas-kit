<script lang="ts">
  import { onMount } from "svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import type { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
  import type { FileBase64 } from "@/application/dtos/shared/FileBase64";
  import IconEmployees from "@/components/layouts/icons/IconEmployees.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import UploadDocument from "@/components/ui/uploaders/UploadDocument.svelte";
  import services from "@/services";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let confirmCreate: ConfirmModal;

  let importingEmployees: boolean = false;
  let loading: boolean = false;

  let employeesFile = "";
  let employees: EmployeeDto[] = [];

  const showImportEmployees = true;

  onMount(() => {
    if (import.meta.env.VITE_SVELTE_APP_SERVICE === "sandbox") {
      employees = [
        ...employees,
        {
          id: undefined,
          firstName: "Luna",
          lastName: "Davis",
          email: "luna.davis@company.com",
        },
      ];
    }

    addEmployee();
  });

  function removeEmployee(index: number) {
    employees = employees.filter((_x, i) => i !== index);
    if (employees.length === 0) {
      employeesFile = "";
    }
  }
  function save() {
    confirmCreate?.show($t("shared.confirmSave"), $t("shared.confirm"), $t("shared.back"));
  }
  function cancel() {
    navigate("/app/employees");
  }
  function confirmSave() {
    loading = true;
    if (employees.length > 0) {
      services.employees
        .createMultiple({
          employees,
        })
        .then(() => {
          successModal?.show($t("shared.saved"));
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loading = false;
        });
    }
  }
  function goToProfile() {
    navigate("/app/employees");
  }
  function addEmployee() {
    employees = [
      ...employees,
      {
        id: undefined,
        firstName: "",
        lastName: "",
        email: "",
      },
    ];
  }
  function downloadEmployeesFileTemplate() {
    const rows = [
      [
        $t("models.employee.firstName").toString().toUpperCase(),
        $t("models.employee.lastName").toString().toUpperCase(),
        $t("models.employee.email").toString().toUpperCase(),
      ],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla.csv");
    document.body.appendChild(link);

    link.click();
  }
  function droppedEmployeesFile(event: any) {
    const filesBase64: FileBase64[] = event.detail.filesBase64;
    const files: File[] = event.detail.files;
    if (files.length > 0) {
      employeesFile = filesBase64[0].base64;
      const _employeesFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const importedEmployees = csvToArray(e.target.result);
        importedEmployees.forEach((employeeObject: any) => {
          const employee: string[] = Object.values(employeeObject);
          const firstName = employee.length > 0 ? employee[0].toString().replace("\r", "") : "";
          if (firstName === "NOMBRE" || firstName === "FIRST NAME" || firstName === "NAME") {
            return;
          }
          const lastName = employee.length > 1 ? employee[1].toString().replace("\r", "") : "";
          const email = employee.length > 2 ? employee[2].toString().replace("\r", "") : "";
          employees = [
            ...employees,
            {
              id: undefined,
              firstName,
              lastName,
              email,
            },
          ];
        });
        employees = importedEmployees.filter((f: any) => f.firstName && f.lastName);
        clearEmptyEmployees();
      };
      reader.readAsText(_employeesFile);
    }
  }
  function clearEmptyEmployees() {
    employees.forEach((employee, index) => {
      if (!employee.firstName || employee.firstName.trim() === "") {
        employees = employees.filter((_x, i) => i !== index);
      }
    });
  }
  function csvToArray(str: any, delimiter = ",") {
    const headers: string[] = str.slice(0, str.indexOf("\n")).split(delimiter);

    let rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const header = headers[0].trim().toUpperCase();
    if (header === "NOMBRE" || header === "FIRST NAME" || header === "NAME") {
      rows = str.split("\n");
    }
    const arr = rows.map((row: any) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, _header, index) => {
        object[index] = values[index];
        return object;
      }, {});
      return el;
    });
    return arr;
  }
</script>

<div>
  {#if loading}
    <Loading />
  {:else}
    <form on:submit|preventDefault={save}>
      <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
        <div class="flex items-center space-x-3 justify-between">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">{$t("models.employee.plural")}</h3>
          </div>
        </div>
        <div class="mt-6">
          {#if !employeesFile && importingEmployees && showImportEmployees}
            <div>
              <div class="flex items-center justify-between space-x-3">
                <label for="file" class="block text-sm font-normal text-gray-700 truncate">
                  {$t("app.employees.actions.uploadCsv")}:
                  <span class="font-bold italic truncate">{$t("app.employees.actions.uploadCsvColumns")}</span>
                </label>
                <button
                  type="button"
                  on:click={downloadEmployeesFileTemplate}
                  class="inline-flex items-center space-x-1 text-theme-500 hover:text-theme-700 underline text-sm truncate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div>{$t("app.employees.actions.uploadCsvTemplate")}</div>
                </button>
              </div>
              <div class="mt-1">
                <UploadDocument accept=".csv" description={$t("app.employees.actions.onlyCsv")} on:droppedFiles={droppedEmployeesFile}
                  ><span slot="icon"><IconEmployees className="mx-auto h-10 w-10 text-gray-400" /> </span></UploadDocument
                >
              </div>
            </div>
          {/if}
          <div>
            {#each employees as employee, idxEmployee}
              <div class="relative mt-1 grid gap-1 grid-cols-6 py-2">
                <div class="col-span-3 sm:col-span-2">
                  {#if idxEmployee === 0}
                    <label for="first-name" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.employee.firstName")}
                    </label>
                  {/if}
                  <div class="mt-1">
                    <input
                      autoComplete="off"
                      type="text"
                      name={"employee-first-name-" + idxEmployee}
                      id={"employee-first-name-" + idxEmployee}
                      placeholder={$t("models.employee.firstName") + " " + (idxEmployee + 1)}
                      bind:value={employee.firstName}
                      required
                      class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div class="col-span-3 sm:col-span-2">
                  {#if idxEmployee === 0}
                    <label for="last-name" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.employee.lastName")}
                    </label>
                  {/if}
                  <div class="mt-1">
                    <input
                      autoComplete="off"
                      type="text"
                      name={"employee-last-name-" + idxEmployee}
                      id={"employee-last-name-" + idxEmployee}
                      placeholder={$t("models.employee.lastName") + " " + (idxEmployee + 1)}
                      bind:value={employee.lastName}
                      required
                      class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-2">
                  {#if idxEmployee === 0}
                    <label for="employee-email" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.employee.email")}
                    </label>
                  {/if}
                  <div class="mt-1 flex items-center space-x-2">
                    <input
                      autoComplete="off"
                      type="email"
                      name={"employee-email" + idxEmployee}
                      id={"employee-email" + idxEmployee}
                      placeholder={$t("models.employee.email") + " " + (idxEmployee + 1)}
                      bind:value={employee.email}
                      required
                      class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      class={classNames(
                        "text-gray-700 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500",
                        idxEmployee === 0 && "top-0",
                        idxEmployee > 0 && "-top-3"
                      )}
                      on:click={() => removeEmployee(idxEmployee)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            {/each}
            <div class="flex items-center space-x-3">
              <button type="button" on:click={addEmployee} class="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span class="uppercase font-medium">{$t("app.employees.actions.add")}</span>
              </button>
              <button type="button" on:click={() => (importingEmployees = !importingEmployees)} class="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="uppercase font-medium">{$t("app.employees.actions.import")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-4 flex items-center justify-end space-x-2">
        <div class="flex items-center space-x-2">
          <button
            on:click={cancel}
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >
            {$t("shared.cancel")}
          </button>
          <button
            type="submit"
            class="inline-flex items-center space-x-2 px-3 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{$t("shared.save")}</span>
          </button>
        </div>
      </div>
    </form>
  {/if}
  <ConfirmModal bind:this={confirmCreate} on:yes={confirmSave} />
  <SuccessModal bind:this={successModal} on:closed={goToProfile} />
  <ErrorModal bind:this={errorModal} />
</div>
