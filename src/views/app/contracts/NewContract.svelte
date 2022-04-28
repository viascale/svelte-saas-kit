<script lang="ts">
  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import SelectEmployees from "@/components/app/employees/SelectEmployees.svelte";
  import SelectContractMembers from "@/components/app/contracts/SelectContractMembers.svelte";
  import LinkSelector from "@/components/app/links/selectors/LinkSelector.svelte";
  import type { AddContractMemberDto } from "@/application/contracts/app/contracts/AddContractMemberDto";
  import type { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
  import services from "@/services";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
  import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
  import type { FileBase64 } from "@/application/dtos/shared/FileBase64";
  import classNames from "@/utils/shared/ClassesUtils";
  import IconWorkers from "@/assets/icons/IconWorkers.svelte";
  import IconSign from "@/assets/icons/IconSign.svelte";
  import UploadDocument from "@/components/ui/uploaders/UploadDocument.svelte";
  import IconContract from "@/assets/icons/IconContract.svelte";
  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import PdfPreview from "@/components/ui/pdf/PdfViewer.svelte";
  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";
  import { appState } from "@/store/modules/appStore";

  const preselectLinkIdQueryParam = new URLSearchParams(window.location.search).get("l") ?? "";

  let inputName: any;
  let errorModal: ErrorModal;
  let confirmCreate: any;
  let selectEmployees: any;
  let selectContractMembers: any;
  let linkSelector: any;

  let name: string = "";
  let link: LinkDto | null = null;
  let linkId: string = "";
  let description: string = "";
  let contractFile: string = "";
  let members: AddContractMemberDto[] = [];
  let employees: EmployeeDto[] = [];
  let loading: boolean = false;
  let preselectLinkId: string = "";

  onMount(() => {
    preselectLinkId = preselectLinkIdQueryParam;
    if (preselectLinkId) {
      services.links.get(preselectLinkId).then((link) => {
        linkSelector?.select(link);
      });
    }
    loadFeatures();
  });

  function loadFeatures() {
    services.tenants.getCurrentUsage(AppUsageType.CONTRACTS);
    services.tenants.getFeatures();
  }
  function addMember() {
    if (!link || !link.id) {
      errorModal?.show($t("shared.missingFields"), $t("app.contracts.errors.linkRequired"));
    } else {
      selectContractMembers?.show(
        link,
        link?.id,
        members.map((f) => f.userId)
      );
    }
  }
  function addEmployee() {
    selectEmployees?.show(employees.map((f) => f.id));
  }
  function removeFile() {
    contractFile = "";
  }
  function removeMember(index: number) {
    members = members.filter((_x, i) => i !== index);
  }
  function removeEmployee(index: number) {
    employees = employees.filter((_x, i) => i !== index);
  }
  function save() {
    if (maxContractsReached()) {
      errorModal?.show($t("shared.error"), $t("app.subscription.errors.limitReachedContracts"));
    } else if (!link || !link.id) {
      errorModal?.show($t("shared.missingFields"), $t("app.contracts.errors.linkRequired"));
      return;
    } else if (!name) {
      errorModal?.show($t("shared.missingFields"), $t("app.contracts.errors.nameRequired"));
      return;
    } else if (!description) {
      errorModal?.show($t("app.contracts.errors.descriptionRequired"));
      return;
    } else if (!contractFile) {
      errorModal?.show($t("shared.missingFields"), $t("app.contracts.errors.fileRequired"));
    } else if (!members || members.filter((f) => f.role === ContractMemberRole.SIGNATORY).length < 2) {
      errorModal?.show($t("shared.missingFields"), $t("app.contracts.errors.atLeastNSignatories"));
      return;
    } else {
      confirmCreate?.show($t("app.contracts.actions.create"), $t("shared.create"), $t("shared.cancel"), $t("app.contracts.actions.createDescription"));
    }
  }
  function saveContract() {
    loading = true;
    services.contracts
      .create({
        linkId,
        // clientWorkspaceId: clientWorkspaceId,
        name,
        description,
        file: contractFile,
        members,
        employees,
      })
      .then((response: ContractDto) => {
        navigate("/app/contract/" + response.id);
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function droppedContractFile(event: any) {
    const files: FileBase64[] = event.detail.filesBase64;
    if (files.length > 0) {
      const mb = files[0].file.size / 1048576;
      if (mb >= 20) {
        errorModal?.show($t("shared.error"), $t("app.contracts.errors.maxFileReached"));
      } else {
        contractFile = files[0].base64;
      }
    }
  }
  function selectedLink(event: any) {
    const id: string = event.detail.id;
    const _link: LinkDto = event.detail.item;
    linkId = id;
    link = _link;
    // nextTick(() => {
    inputName?.focus();
    inputName?.select();
    // });
  }
  function selectedEmployees(event: any) {
    const items: EmployeeDto[] = event.detail.items;
    employees = items;
  }
  function selectedContractMembers(event: any) {
    const items: AddContractMemberDto[] = event.detail.items;
    members = items;
  }
  $: currentWorkspace = $tenantState.currentWorkspace;
  $: imProvider = currentWorkspace?.id === link?.providerWorkspaceId;
  $: features = $appState.features;
  $: usage = $appState.usage;
  $: maxContractsReached = () => {
    if (!features) {
      return true;
    } else {
      return features.monthlyContracts > 0 && usage.contracts >= features.monthlyContracts;
    }
  };
</script>

<div>
  <Breadcrumb
    menu={[
      {
        title: $t("app.contracts.title"),
        routePath: "/app/contracts/pending",
      },
      {
        title: $t("app.contracts.new.title"),
        routePath: "/app/contract/new",
      },
    ]}
  />
  <div class="lg:py-8 max-w-2xl mx-auto">
    {#if loading}
      <Loading />
    {:else}
      <div>
        {#if maxContractsReached()}
          <div>
            <WarningBanner
              redirect="/app/settings/subscription"
              title={$t("app.subscription.errors.limitReached")}
              text={$t("app.subscription.errors.limitReachedContracts", { values: { p1: features.monthlyContracts } })}
            />
          </div>
        {:else}
          <form>
            <div class="sm:space-y-4 divide-y divide-gray-200">
              <div class="bg-white py-6 px-8 shadow-lg border border-gray-200 space-y-6">
                <div class="flex items-center space-x-3 justify-between">
                  <div>
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{$t("app.contracts.new.title")}</h3>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{$t("app.contracts.new.description")}</p>
                  </div>
                  <IconContract className="h-8 w-8 text-gray-800" />
                </div>

                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-6">
                    <label for="link" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("models.link.object")}
                    </label>
                    <LinkSelector bind:this={linkSelector} className="mt-1 w-full" on:selected={selectedLink} />
                  </div>

                  <div class="sm:col-span-6">
                    <label for="name" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("shared.name")}
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm w-full">
                      <input
                        id="name"
                        bind:this={inputName}
                        value={name}
                        on:change={(e) => (name = e.currentTarget.value)}
                        type="text"
                        name="name"
                        autoComplete="off"
                        required
                        placeholder={$t("app.contracts.placeholders.name")}
                        class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-6">
                    <label for="description" class="block text-xs font-medium text-gray-700 truncate">
                      {$t("shared.description")}
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm w-full">
                      <textarea
                        id="description"
                        value={description}
                        on:change={(e) => (description = e.currentTarget.value)}
                        rows={3}
                        autoComplete="off"
                        required
                        placeholder={$t("app.contracts.placeholders.description")}
                        class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-6">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block text-xs font-medium text-gray-700 truncate">{$t("shared.file")}</label>
                    <div class="mt-1">
                      {#if contractFile}
                        <PdfPreview file={contractFile} editing={true} on:removeFile={removeFile} />
                      {:else}
                        <UploadDocument accept=".pdf" description={$t("shared.onlyFileTypes", { values: { p1: ".PDF" } })} on:droppedFiles={droppedContractFile}
                          ><span slot="icon"><IconContract className="mx-auto h-10 w-10 text-gray-400" /></span></UploadDocument
                        >
                      {/if}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
                <div class="flex items-center space-x-3 justify-between">
                  <div>
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{$t("app.contracts.signatories")}</h3>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{$t("app.contracts.new.addSignatories")}.</p>
                  </div>
                  <IconSign className="h-8 w-8 text-gray-800" />
                </div>
                <div>
                  {#each members as member, idxMember}
                    <div class="grid grid-cols-6 items-center space-x-2 relative py-3 gap-1">
                      <button
                        type="button"
                        disabled={members.length <= 1}
                        class={classNames(
                          "absolute origin-top-right right-0 top-0 mt-1 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500",
                          members.length <= 1 && "text-gray-400 cursor-not-allowed",
                          members.length > 1 && "text-gray-700 hover:bg-gray-50"
                        )}
                        on:click={() => removeMember(idxMember)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div class="col-span-6 sm:col-span-2">
                        <label for="full-name" class="block text-xs font-medium text-gray-700 truncate">
                          {$t("account.shared.fullName")}
                        </label>
                        <div class="mt-1">
                          <input
                            id="full-name"
                            bind:value={member.name}
                            required
                            type="text"
                            name="full-name"
                            placeholder={$t("account.shared.name")}
                            disabled
                            autoComplete="full-name"
                            class="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div class="col-span-3 sm:col-span-2">
                        <div class="flex items-start space-x-2">
                          <div class="flex-grow">
                            <label for="email" class="block text-xs font-medium text-gray-700 truncate">
                              {$t("account.shared.email")}
                            </label>
                            <div class="mt-1">
                              <input
                                id="email"
                                value={member.email}
                                name="email"
                                type="email"
                                disabled
                                placeholder={member.role === 0
                                  ? $t("app.contracts.placeholders.signatoryEmail")
                                  : $t("app.contracts.placeholders.spectatorEmail")}
                                autoComplete="email"
                                required
                                class="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-span-3 sm:col-span-2">
                        <div class="flex items-start space-x-2">
                          <div class="flex-grow">
                            <label for="role" class="block text-xs font-medium text-gray-700 truncate">
                              {$t("shared.role")}
                            </label>
                            <div class="mt-1">
                              <select
                                id="role"
                                bind:value={member.role}
                                autoComplete="email"
                                class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value={0}>{$t("app.contracts.signatory")}</option>
                                <option value={1}>{$t("app.contracts.spectator")}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                  <button type="button" on:click={addMember} class="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="uppercase font-medium">{$t("app.contracts.actions.selectSignatoryOrSpectator")}</span>
                  </button>
                </div>
              </div>

              {#if imProvider}
                <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
                  <div class="flex items-center space-x-3 justify-between">
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{$t("models.employee.plural")}</h3>
                      <p class="mt-1 text-sm text-gray-500">{$t("app.employees.actions.select")}.</p>
                    </div>
                    <IconWorkers className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <div>
                      {#each employees as employee, idxEmployee}
                        <div class="relative mt-1 grid grid-cols-6 items-center space-x-2 py-3 gap-1">
                          <button
                            type="button"
                            class="text-gray-700 hover:bg-gray-50 absolute origin-top-right right-0 top-0 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                            on:click={() => removeEmployee(idxEmployee)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div class="col-span-6 sm:col-span-2">
                            <label for="full-name" class="block text-xs font-medium text-gray-700 truncate">
                              {$t("models.employee.fullName")}
                            </label>
                            <div class="mt-1">
                              <input
                                id="employee-first-name-"
                                value={employee.firstName}
                                type="text"
                                name="employee-first-name-"
                                placeholder={$t("models.employee.object") + " " + (idxEmployee + 1)}
                                autoComplete="off"
                                required
                                disabled
                                class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div class="col-span-3 sm:col-span-2">
                            <label for="full-name" class="block text-xs font-medium text-gray-700 truncate">
                              {$t("models.employee.lastName")}
                            </label>
                            <div class="mt-1">
                              <input
                                id="employee-last-name"
                                value={employee.lastName}
                                type="text"
                                name="employee-last-name"
                                autoComplete="off"
                                required
                                disabled
                                class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div class="col-span-3 sm:col-span-2">
                            <label for="email" class="block text-xs font-medium text-gray-700 truncate">
                              {$t("models.employee.email")}
                            </label>
                            <div class="mt-1">
                              <input
                                id="email"
                                value={employee.email}
                                type="text"
                                name="email"
                                autoComplete="off"
                                required
                                disabled
                                class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      {/each}

                      <div class="flex items-center space-x-3">
                        <button type="button" on:click={addEmployee} class="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span class="uppercase font-medium">{$t("app.employees.actions.selectEmployees")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <div class="py-5">
              <div class="flex justify-end py-3 px-4 lg:px-0 lg:py-0">
                <Link
                  to="/app/contracts/pending"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  {$t("shared.cancel")}
                </Link>
                <button
                  type="button"
                  class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  on:click={save}
                >
                  {$t("app.contracts.new.save")}
                </button>
              </div>
            </div>
          </form>
        {/if}
      </div>
    {/if}
  </div>
  <SelectEmployees bind:this={selectEmployees} on:selected={selectedEmployees} />
  <SelectContractMembers bind:this={selectContractMembers} on:selected={selectedContractMembers} />
  <ConfirmModal bind:this={confirmCreate} on:yes={saveContract} />
  <ErrorModal bind:this={errorModal} />
</div>
