<script lang="ts">
  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
  import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import IconContractArchived from "@/assets/icons/IconContractArchived.svelte";
  import IconContractCheck from "@/assets/icons/IconContractCheck.svelte";
  import IconContractClock from "@/assets/icons/IconContractClock.svelte";
  import IconSign from "@/assets/icons/IconSign.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import services from "@/services";
  import DateUtils from "@/utils/shared/DateUtils";
  import { _ as t } from "svelte-i18n";
  import { tenantState } from "@/store/modules/tenantStore";

  export let id: string = "";

  let confirmDelete: ConfirmModal;
  let successModalDeleted: SuccessModal;
  let errorModal: ErrorModal;

  let loading: boolean = false;
  let openOptions: boolean = false;

  let link: LinkDto = {} as LinkDto;
  let workspace: WorkspaceDto = {} as WorkspaceDto;
  let contracts: ContractDto[] = [];

  onMount(() => {
    reload();
    reloadContracts();
  });

  function reload() {
    closeOptions();
    loading = true;
    services.links
      .get(id)
      .then((response) => {
        link = response;
      })
      .finally(() => {
        loading = false;
      });
  }

  $: workspace = whoAmI(link) === 0 ? link.clientWorkspace : link.providerWorkspace;
  function reloadContracts() {
    services.contracts.getAllByLink(link.id).then((response) => {
      contracts = response;
    });
  }
  function deleteLink() {
    closeOptions();
    confirmDelete?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
  }
  function confirmedDelete() {
    loading = true;
    services.links
      .delete(id)
      .then(() => {
        services.tenants.getCurrentUsage(AppUsageType.ALL);
        successModalDeleted?.show($t("shared.deleted"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function successModalDeletedClosed() {
    if (link.providerWorkspaceId === currentWorkspace?.id) {
      navigate("/app/links/clients");
    } else {
      navigate("/app/links/providers");
    }
  }
  function closeOptions() {
    openOptions = false;
  }
  function toggleOptions() {
    openOptions = !openOptions;
  }
  function dateMonthDayYear(value: Date | undefined) {
    return DateUtils.dateMonthDayYear(value);
  }
  function dateDM(value: Date | undefined) {
    return DateUtils.dateDM(value);
  }
  $: currentWorkspace = $tenantState.currentWorkspace;
  function whoAmI(item: LinkDto) {
    const currentWorkspaceId = currentWorkspace?.id ?? "";
    if (currentWorkspaceId === item.providerWorkspaceId) {
      return 0;
    }
    return 1;
  }
  $: isOwnerOrAdmin = currentRole == TenantUserRole.OWNER || currentRole == TenantUserRole.ADMIN;
  $: currentRole = $tenantState.current?.currentUser.role;
</script>

<div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />
    {:else if workspace?.id}
      <div>
        <div class="relative min-h-screen">
          <main class="py-4">
            <div class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 172 172" class="h-16 w-16">
                      <g
                        fill="none"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                      >
                        <path d="M0,172v-172h172v172z" fill="none" />
                        <g fill="currentColor">
                          <path
                            d="M150.5,150.5h-129v-114.66667c0,-7.88333 6.45,-14.33333 14.33333,-14.33333h100.33333c7.88333,0 14.33333,6.45 14.33333,14.33333z"
                            fill="#a3bffa"
                          />
                          <path d="M21.5,150.5h129v7.16667h-129z" fill="#667eea" />
                          <path
                            d="M111.08333,96.75h21.5v17.91667h-21.5zM75.25,96.75h21.5v17.91667h-21.5zM39.41667,96.75h21.5v17.91667h-21.5zM111.08333,125.41667h21.5v17.91667h-21.5zM39.41667,125.41667h21.5v17.91667h-21.5zM111.08333,68.08333h21.5v17.91667h-21.5zM75.25,68.08333h21.5v17.91667h-21.5zM39.41667,68.08333h21.5v17.91667h-21.5zM111.08333,39.41667h21.5v17.91667h-21.5zM75.25,39.41667h21.5v17.91667h-21.5zM39.41667,39.41667h21.5v17.91667h-21.5zM75.25,125.41667h21.5v32.25h-21.5z"
                            fill="#5a67d8"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="truncate">
                  <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold text-gray-900">{workspace.name}</h1>
                  </div>
                  {#if workspace.createdByUser}
                    <p class="text-sm font-medium text-gray-500 truncate">
                      <span>
                        {$t("shared.added")}
                        {$t("shared.by")} <span class="text-gray-900">{workspace.createdByUser.email} </span>
                      </span>
                      <span>
                        {$t("shared.in")} <time>{dateMonthDayYear(workspace.createdAt)}</time>
                      </span>
                    </p>
                  {/if}
                </div>
              </div>
              <div
                class="mt-6 flex justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3 justify-end"
              >
                <!--Options -->
                <span class="relative inline-flex justify-end rounded-md">
                  <Link
                    to={"/app/contract/new?l=" + id}
                    class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500 truncate"
                  >
                    <IconSign className="-ml-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                    {$t("app.contracts.new.title")}
                  </Link>
                  <span class="-ml-px relative block">
                    <button
                      on:click={toggleOptions}
                      type="button"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
                      id="option-menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                    >
                      <span class="sr-only">{$t("app.shared.buttons.openOptions")}</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      {#if openOptions}
                        <div
                          class="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="option-menu-button"
                          tabIndex={-1}
                        >
                          <div class="py-1" role="none">
                            <!--Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->

                            <button
                              type="button"
                              on:click={reload}
                              class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                              role="menuitem"
                              tabIndex={-1}
                              id="option-menu-item-0"
                            >
                              <div>{$t("shared.reload")}</div>
                            </button>

                            {#if isOwnerOrAdmin}
                              <button
                                type="button"
                                on:click={deleteLink}
                                class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                                role="menuitem"
                                tabIndex={-1}
                                id="option-menu-item-2"
                              >
                                {$t("shared.delete")}
                              </button>
                            {/if}
                          </div>
                        </div>
                      {/if}
                    </transition>
                  </span>
                </span>
                <!--Options: End -->
              </div>
            </div>

            <div class="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-3 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 xl:gap-6">
              <div class="space-y-6 lg:col-start-1 lg:col-span-2">
                <!--Description list-->
                <section aria-labelledby="applicant-information-title">
                  <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h2 id="applicant-information-title" class="text-lg leading-6 font-medium text-gray-900">
                        {$t("app.links.profile.company")}
                      </h2>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500">{$t("app.links.profile.general")}</p>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                        <div class="sm:col-span-3">
                          <dt class="text-sm font-medium text-gray-500">{$t("models.workspace.name")}</dt>
                          <dd class="mt-1 text-sm text-gray-900">{workspace.name}</dd>
                        </div>

                        <div class="sm:col-span-2">
                          <dt class="text-sm font-medium text-gray-500">{$t("app.workspaces.typesDescription.PUBLIC")}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {#if workspace.type === 1}
                              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                                {$t("shared.yes")}
                              </span>
                            {:else}
                              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                {$t("shared.no")}
                              </span>
                            {/if}
                          </dd>
                        </div>

                        <div class="sm:col-span-3">
                          <dt class="text-sm font-medium text-gray-500">{$t("models.workspace.businessMainActivity")}</dt>
                          <dd class="mt-1 text-sm text-gray-900">{workspace.businessMainActivity}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>

              <section aria-labelledby="timeline-title" class="lg:col-start-3 lg:col-span-1">
                <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <h2 id="timeline-title" class="text-lg font-medium text-gray-900">
                    {$t("app.shared.activity.title")}
                  </h2>

                  <!--Activity Feed -->
                  <div class="mt-6 flow-root">
                    <ul role="list" class="-mb-8">
                      <li>
                        <div class="relative pb-8">
                          {#if contracts.length > 0} <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />{/if}
                          <div class="relative flex space-x-3">
                            <div>
                              <span class="h-8 w-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center ring-8 ring-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div class="min-w-0 flex-1 flex justify-between space-x-2">
                              <div>
                                {#if workspace.createdByUser}
                                  <p class="text-sm text-gray-500">
                                    {$t("shared.added")}
                                    {$t("shared.by")}{" "}
                                    <span class="text-gray-900">
                                      {workspace.createdByUser.firstName}
                                      {workspace.createdByUser.lastName}
                                    </span>
                                  </p>
                                {/if}
                              </div>
                              <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{dateDM(workspace.createdAt)}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      {#each contracts as contract, idx}
                        <li>
                          <div class="relative pb-8">
                            {#if idx < contracts.length - 1}
                              <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            {/if}
                            <div class="relative flex space-x-3">
                              <div class="flex-shrink-0">
                                {#if contract.status === 0} <IconContractClock className="h-8 w-8 text-yellow-500" />{/if}
                                {#if contract.status === 1} <IconContractCheck className="h-8 w-8 text-teal-500" />{/if}
                                {#if contract.status === 2} <IconContractArchived className="h-8 w-8 text-gray-500" />{/if}
                              </div>
                              <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-2">
                                <div class="truncate">
                                  <p class="text-sm text-gray-500">
                                    <Link to={"/app/contract/" + contract.id} class="font-medium text-gray-600 underline hover:text-gray-700">
                                      {contract.name}
                                    </Link>
                                  </p>
                                </div>
                                <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                  {#if contract.createdAt} <time>{dateDM(contract.createdAt)}</time>{/if}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    {:else}
      <div />
    {/if}
  </div>
  <SuccessModal bind:this={successModalDeleted} on:closed={successModalDeletedClosed} />
  <ConfirmModal bind:this={confirmDelete} on:yes={confirmedDelete} />
  <ErrorModal bind:this={errorModal} />
</div>
