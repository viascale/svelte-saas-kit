<script lang="ts">
  import { onMount } from "svelte";
  import type { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import services from "@/services";
  import DateUtils from "@/utils/shared/DateUtils";
  import classNames from "@/utils/shared/ClassesUtils";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let id: string = "";

  let firstNameInput: HTMLInputElement;
  let confirmSave: ConfirmModal;
  let confirmDeleteEmployee: ConfirmModal;
  let errorModal: ErrorModal;
  let successModal: SuccessModal;
  let successModalDeleted: SuccessModal;

  let loading: boolean = false;
  let firstName: string = "";
  let lastName: string = "";
  let email: string = "";

  let editing: boolean = false;

  let item: EmployeeDto;

  onMount(() => {
    reload();
  });

  function reload() {
    loading = true;
    services.employees
      .get(id)
      .then((response) => {
        item = response;
        loadProfile(response);
      })
      .finally(() => {
        loading = false;
      });
  }
  function loadProfile(item: EmployeeDto) {
    firstName = item?.firstName ?? "";
    lastName = item?.lastName ?? "";
    email = item?.email ?? "";
  }
  function edit() {
    editing = true;
    // nextTick(() => {
    firstNameInput?.focus();
    firstNameInput?.select();
    // });
  }
  function save() {
    if (thereAreNoChanges()) {
      errorModal?.show($t("shared.error"), $t("shared.noChanges"));
    } else {
      confirmSave?.show($t("shared.saveChanges"), $t("shared.yes"), $t("shared.cancel"));
    }
  }
  function deleteEmployee() {
    confirmDeleteEmployee?.show($t("shared.confirmDelete"), $t("shared.yes"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
  }
  function successModalDeletedClosed() {
    navigate("/app/employees");
  }
  function confirmedDeleteEmployee() {
    loading = true;
    services.employees
      .delete(id)
      .then(() => {
        successModalDeleted?.show($t("shared.deleted"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function saveConfirm() {
    loading = true;
    services.employees
      .update(id, {
        firstName,
        lastName,
        email,
      })
      .then((response) => {
        successModal?.show($t("shared.updated"));
        item = response;
        loadProfile(response);
        editing = false;
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function cancel() {
    loadProfile(item);
    editing = false;
  }
  function dateMonthDayYear(value: Date | undefined) {
    return DateUtils.dateMonthDayYear(value);
  }
  $: thereAreNoChanges = () => {
    if (item) {
      return firstName === item.firstName && lastName === item.lastName && email === item.email;
    }
    return true;
  };
</script>

<div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />
    {:else if item && item.id}
      <div>
        <div class="relative min-h-screen">
          <main class="py-4">
            <div class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative">
                    <span class="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="truncate">
                  <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold text-gray-900">{item.firstName}</h1>
                  </div>
                  {#if item.createdByUser}
                    <p class="text-sm font-medium text-gray-500 truncate">
                      {$t("shared.added")}
                      {$t("shared.by")}{" "}
                      <span class="text-gray-900">
                        {item.createdByUser.firstName}
                        {item.createdByUser.lastName}
                      </span>
                      {#if item.createdAt}
                        <span>
                          {" "}
                          {$t("shared.in")} <time>{dateMonthDayYear(item.createdAt)}</time>
                        </span>
                      {/if}
                    </p>
                  {/if}
                </div>
              </div>
              <div
                class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"
              >
                <ButtonSecondary on:click={edit}>{$t("shared.edit")}</ButtonSecondary>
              </div>
            </div>

            <div class="mt-8 max-w-3xl mx-auto lg:max-w-7xl">
              <div>
                <div class="lg:grid lg:grid-cols-3 lg:gap-6">
                  <div class="lg:col-span-1">
                    <div class="px-4 sm:px-0">
                      <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("app.employees.profile.title")}</h3>
                      <p class="mt-1 text-sm text-gray-600">{$t("app.employees.profile.general")}</p>
                    </div>
                  </div>
                  <div class="mt-5 lg:mt-0 lg:col-span-2">
                    <form on:submit|preventDefault={save} method="POST">
                      <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                          <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 lg:col-span-3">
                              <label for="first-name" class="block text-sm font-medium text-gray-700">
                                {$t("models.employee.firstName")}
                              </label>
                              <input
                                type="text"
                                bind:this={firstNameInput}
                                name="first-name"
                                id="first-name"
                                autoComplete="first-name"
                                bind:value={firstName}
                                required
                                disabled={!editing}
                                class={classNames(
                                  "mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                                  !editing && "bg-gray-100"
                                )}
                              />
                            </div>

                            <div class="col-span-6 lg:col-span-3">
                              <label for="last-name" class="block text-sm font-medium text-gray-700">
                                {$t("models.employee.lastName")}
                              </label>
                              <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="last-name"
                                bind:value={lastName}
                                required
                                disabled={!editing}
                                class={classNames(
                                  "mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                                  !editing && "bg-gray-100"
                                )}
                              />
                            </div>

                            <div class="col-span-6">
                              <label for="email-address" class="block text-sm font-medium text-gray-700">
                                {$t("models.employee.email")}
                              </label>
                              <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                autoComplete="email"
                                bind:value={email}
                                disabled={!editing}
                                class={classNames(
                                  "mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                                  !editing && "bg-gray-100"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        {#if editing}
                          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
                            <div>
                              <button
                                type="button"
                                on:click={deleteEmployee}
                                disabled={!editing}
                                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                              >
                                {$t("shared.delete")}
                              </button>
                            </div>
                            <div class="flex items-center space-x-2">
                              <button
                                type="button"
                                on:click={cancel}
                                disabled={!editing}
                                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                              >
                                {$t("shared.cancel")}
                              </button>
                              <button
                                type="submit"
                                disabled={!editing || thereAreNoChanges()}
                                class={classNames(
                                  "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                  (!editing || thereAreNoChanges()) && " opacity-50 cursor-not-allowed"
                                )}
                              >
                                {$t("shared.save")}
                              </button>
                            </div>
                          </div>
                        {/if}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    {/if}
  </div>
  <SuccessModal bind:this={successModal} />
  <SuccessModal bind:this={successModalDeleted} on:closed={successModalDeletedClosed} />
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmSave} on:yes={saveConfirm} />
  <ConfirmModal bind:this={confirmDeleteEmployee} on:yes={confirmedDeleteEmployee} />
</div>
