<script lang="ts">
  import { onMount } from "svelte";
  import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import IconContract from "@/assets/icons/IconContract.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import UploadDocument from "@/components/ui/uploaders/UploadDocument.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";
  import ContractMembers from "./ContractMembers.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import PdfViewer from "@/components/ui/pdf/PdfViewer.svelte";
  import DropdownWithClick from "@/components/ui/dropdowns/DropdownWithClick.svelte";
  import ContractEmployees from "./ContractEmployees.svelte";
  import ContractActivity from "./ContractActivity.svelte";
  import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import { tenantState } from "@/store/modules/tenantStore";
  import { accountState } from "@/store/modules/accountStore";

  export let id: string = "";

  let inputName: HTMLInputElement;
  let confirmSendContract: ConfirmModal;
  let confirmDelete: ConfirmModal;
  let errorModal: ErrorModal;
  let successModal: SuccessModal;

  let name = "";
  let status = ContractStatus.PENDING;
  let description = "";
  let contractPdf = "";

  let editing = false;

  let item: ContractDto | undefined = undefined;
  let error = "";
  let loading: boolean = false;
  let loadingPdf = false;

  onMount(() => {
    tinyEventBus().emitter.on("contract-reload", () => {
      reload();
    });
    reload();

    return () => {
      tinyEventBus().emitter.off("contract-reload");
    };
  });

  function reload() {
    loading = true;
    item = undefined;
    services.contracts
      .getContract(id)
      .then((response) => {
        item = response;
        name = response.name;
        status = response.status;
        description = response.description;
        loadPdf();
      })
      .catch((error) => {
        error = error;
      })
      .finally(() => {
        loading = false;
      });
  }
  function removeFile() {
    if (item) {
      contractPdf = "";
    }
  }
  function loadPdf() {
    downloadFile(false);
  }
  function downloadFile(open: boolean) {
    loadingPdf = true;
    services.contracts
      .downloadFile(id)
      .then((response) => {
        if (open) {
          const downloadLink = document.createElement("a");
          const fileName = item?.name + ".pdf";
          downloadLink.href = response;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          contractPdf = response;
        }
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loadingPdf = false;
      });
  }
  function downloadPdf() {
    if (item) {
      const downloadLink = document.createElement("a");
      const fileName = item?.name + ".pdf";
      downloadLink.href = contractPdf;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
  function toggleEdit() {
    editing = !editing;
    if (editing) {
      inputName?.focus();
      inputName?.select();
      if (item) {
        name = item.name;
        status = item.status;
        description = item.description;
        loadPdf();
      }
    }
  }
  function deleteContract() {
    confirmDelete?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
  }
  function yesDelete() {
    loading = true;
    services.contracts
      .delete(item?.id)
      .then(() => {
        navigate("/app/contracts/all");
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
        loading = false;
      });
  }
  function droppedContractFile(event: any) {
    const { filesBase64 } = event.detail;
    if (item) {
      if (filesBase64.length > 0) {
        contractPdf = filesBase64[0].base64;
      }
    }
  }
  function send() {
    confirmSendContract?.show(
      $t("shared.send"),
      $t("shared.send"),
      $t("shared.cancel"),
      $t("shared.sendTo", {
        values: { p1: item?.members.map((f) => (f.user.firstName + " " + f.user.lastName).trim() + " (" + f.user.email + ")").join(", ") },
      })
    );
  }
  function yesSendContract() {
    if (!item) {
      return;
    }
    services.contracts
      .send(item.id, {
        emails: [],
      })
      .then(() => {
        successModal?.show($t("shared.sent"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  function save() {
    if (!name) {
      errorModal?.show($t("shared.error"), $t("app.contracts.errors.nameRequired"));
    } else if (!description) {
      errorModal?.show($t("shared.error"), $t("app.contracts.errors.descriptionRequired"));
    } else if (!contractPdf) {
      errorModal?.show($t("shared.error"), $t("app.contracts.errors.fileRequired"));
    } else {
      loading = true;
      services.contracts
        .update(id, {
          name,
          description,
          file: contractPdf,
          status,
        })
        .then(() => {
          editing = false;
          successModal?.show($t("shared.updated"), $t("shared.saved"));
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loading = false;
        });
    }
  }
  const clientFullName = () => {
    if (item && item.link?.clientWorkspace) {
      return `${item.link.clientWorkspace.name}`;
    }
    return "";
  };
  const providerFullName = () => {
    if (item && item.link?.providerWorkspace) {
      return `${item.link.providerWorkspace.name}`;
    }
    return "";
  };

  $: canBeEdited = item?.members.filter((f) => f.role === 0 && f.signDate).length === 0;
  $: isOwnerOrAdmin = currentRole === TenantUserRole.OWNER || currentRole === TenantUserRole.ADMIN;
  $: user = $accountState.user;
  $: currentRole = $tenantState.current?.currentUser.role ?? TenantUserRole.GUEST;
  $: canEdit = () => {
    if (isOwnerOrAdmin) {
      return true;
    }
    return item?.createdByUserId === user?.id || true;
  };
</script>

<div class="max-w-5xl xl:max-w-7xl mx-auto pb-6">
  {#if loading}
    <Loading />
  {:else if !item || !item.id}
    <div class="mx-auto p-5 items-center justify-between flex text-red-700">{error}</div>
  {:else if item}
    <div>
      <div class="md:flex space-y-2 md:space-y-0 items-center justify-between py-3 border-b border-gray-200 mb-2 md:space-x-3">
        <div class="font-bold text-xl uppercase truncate">
          <span class="truncate">{item.name}</span>
        </div>
        <div class="flex justify-end items-end space-x-2">
          {#if editing && isOwnerOrAdmin}
            <button
              on:click={deleteContract}
              type="button"
              class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {$t("shared.delete")}
            </button>
          {/if}
          {#if editing}
            <button
              on:click={toggleEdit}
              type="button"
              class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
            >
              {$t("shared.cancel")}
            </button>
          {/if}
          {#if editing}
            <button
              on:click={save}
              type="submit"
              class="inline-flex truncate justify-center px-4 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
            >
              {$t("shared.saveChanges")}
            </button>
          {/if}
          {#if !editing}
            <div class="flex items-end space-x-2 space-y-0">
              <DropdownWithClick on:click={downloadPdf}>
                <div slot="button" class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {$t("shared.download")}
                </div>

                <div slot="options">
                  {#if canEdit}
                    <button
                      on:click={toggleEdit}
                      disabled={!canBeEdited}
                      class={classNames(
                        "w-full text-left text-gray-700 block px-4 py-2 text-sm focus:outline-none",
                        !canBeEdited && " bg-gray-100 cursor-not-allowed",
                        canBeEdited && " hover:bg-gray-50"
                      )}
                      role="menuitem"
                      tabindex="-1"
                      id="option-menu-item-1"
                    >
                      <div>{$t("shared.edit")}</div>
                    </button>
                  {/if}

                  <button
                    type="button"
                    on:click={reload}
                    class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                    role="menuitem"
                    tabindex="-1"
                    id="option-menu-item-2"
                  >
                    <div>{$t("shared.reload")}</div>
                  </button>

                  <button
                    type="button"
                    on:click={send}
                    class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                    role="menuitem"
                    tabindex="-1"
                    id="option-menu-item-6">{$t("shared.send")}</button
                  >
                </div>
              </DropdownWithClick>
            </div>
          {/if}
        </div>
      </div>
      <div class="bg-gray-50 min-h-screen">
        <div class="py-2">
          <div class="grid gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 space-y-4">
              <div>
                <h3 class="mb-2 text-gray-400 font-medium text-sm">{$t("app.contracts.details.general")}</h3>
                <div class="bg-white p-3 rounded border border-gray-100 shadow-md space-y-3">
                  <div class="grid sm:grid-cols-3 gap-2">
                    <div>
                      <label for="provider" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.provider.object")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="provider"
                          id="provider"
                          autoComplete="off"
                          required
                          value={providerFullName()}
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="client" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.client.object")}
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="client"
                          id="client"
                          autoComplete="off"
                          required
                          value={clientFullName()}
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="status" class="block text-xs font-medium text-gray-700 truncate">
                        {$t("models.contract.status")}
                      </label>
                      <select
                        id="status"
                        name="status"
                        disabled={!editing}
                        class={classNames(
                          "mt-1 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                          !editing && "bg-gray-100",
                          editing && "bg-white"
                        )}
                        bind:value={status}
                      >
                        <option value={ContractStatus.PENDING}>{$t("app.contracts.status.PENDING")}</option>
                        <option value={ContractStatus.SIGNED}>{$t("app.contracts.status.SIGNED")}</option>
                        <option value={ContractStatus.ARCHIVED}>{$t("app.contracts.status.ARCHIVED")}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label for="name" class="block text-xs font-medium text-gray-700">
                      {$t("models.contract.name")}
                    </label>
                    <div class="mt-1">
                      <input
                        disabled={!editing}
                        type="text"
                        bind:this={inputName}
                        name="name"
                        bind:value={name}
                        id="name"
                        class={classNames(
                          "text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                          !editing && "bg-gray-100",
                          editing && "bg-white"
                        )}
                        placeholder={$t("models.contract.name")}
                      />
                    </div>
                  </div>
                  <div>
                    <label for="description" class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2">
                      {$t("models.contract.description")}
                    </label>
                    <div class="mt-1 sm:col-span-2">
                      <textarea
                        disabled={!editing}
                        id="description"
                        bind:value={description}
                        rows={5}
                        class={classNames(
                          "p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                          !editing && "bg-gray-100",
                          editing && "bg-white"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2">{$t("models.contract.file")}</label>
                    <div class={classNames("mt-1 sm:col-span-2", editing && "bg-white")}>
                      {#if loadingPdf}
                        <div class="overflow-hidden border border-gray-300 rounded-md items-center">
                          <Loading />
                        </div>
                      {:else}
                        <div>
                          {#if contractPdf && contractPdf.length > 0}
                            <PdfViewer file={contractPdf} fileName={item.name} {editing} on:removeFile={removeFile} />
                          {:else}
                            <UploadDocument
                              accept=".pdf"
                              description={$t("shared.onlyFileTypes", { values: { p1: ".PDF" } })}
                              on:droppedFiles={droppedContractFile}
                            >
                              <IconContract slot="icon" className="mx-auto h-10 w-10 text-gray-400" />
                            </UploadDocument>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <ContractMembers items={item.members} />
              {#if item.employees.length > 0} <ContractEmployees items={item.employees} />{/if}
              <ContractActivity items={item.activity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <ConfirmModal bind:this={confirmSendContract} on:yes={yesSendContract} />
  <ConfirmModal bind:this={confirmDelete} on:yes={yesDelete} />
  <ErrorModal bind:this={errorModal} />
  <SuccessModal bind:this={successModal} />
</div>
