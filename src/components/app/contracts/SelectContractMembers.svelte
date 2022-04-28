<script lang="ts">
  import type { AddContractMemberDto } from "@/application/contracts/app/contracts/AddContractMemberDto";
  import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
  import type { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
  import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import services from "@/services";
  import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
  import classNames from "@/utils/shared/ClassesUtils";
  import IconSign from "@/assets/icons/IconSign.svelte";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let maxSize: string = "sm:max-w-lg";

  let errorModal: ErrorModal;

  let showing: boolean = false;
  let searchInput: string = "";
  let items: WorkspaceUserDto[] = [];
  let loading: boolean = false;
  let selected: string[] = [];
  let link: LinkDto | null = null;

  export function show(_link: LinkDto, _linkId: string, _selected: string[]) {
    link = _link;
    selected = _selected;
    showing = true;

    reload(_linkId);
  }
  function reload(linkId: string) {
    loading = true;
    services.links
      .getLinkUsers(linkId)
      .then((response) => {
        items = response;
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function close() {
    dispatch("closed");
    showing = false;
  }
  function toggle(item: WorkspaceUserDto) {
    if (isSelected(item)) {
      selected = selected.filter((f) => f !== item.userId);
    } else {
      selected = [...selected, item.userId];
    }
  }
  $: isSelected = (item: WorkspaceUserDto) => {
    return selected.find((f) => f === item.userId);
  };
  function accept() {
    const selected: AddContractMemberDto[] = [];
    items.forEach((element) => {
      if (isSelected(element)) {
        const contractMember: AddContractMemberDto = {
          userId: element.userId,
          role: ContractMemberRole.SIGNATORY,
          name: (element.user?.firstName + " " + element.user?.lastName).trim(),
          email: element.user?.email ?? "",
        };
        selected.push(contractMember);
      }
    });
    dispatch("selected", { items: selected });
    close();
  }
  function getNoMembers() {
    if (link?.providerWorkspace && link.clientWorkspace) {
      return $t("app.tenants.members.noMembersFoundIn", {
        values: {
          p1: link?.clientWorkspace.name,
          p2: link?.providerWorkspace.name,
        },
      });
    }
    return $t("app.tenants.members.noMembers");
  }
  $: filteredItems = (): WorkspaceUserDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.id?.toUpperCase().includes(searchInput.toUpperCase()) ||
        f.workspace?.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.user?.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.user?.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.user?.email?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };

  useEscapeKeypress(close);
</script>

<div>
  {#if showing}
    <div class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-800 opacity-75" />
          </div>
        </transition>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" />
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class={classNames(
              "inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6",
              maxSize
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="just absolute top-0 right-0 -mt-4 pr-4">
              <button
                on:click={close}
                type="button"
                class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">{$t("shared.close")}</span>
                <svg class="h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mt-3">
              <div class="max-w-lg mx-auto">
                <div>
                  <div class="text-center">
                    <IconSign className="mx-auto h-12 w-12 text-gray-800" />
                    <h2 class="mt-2 text-lg font-medium text-gray-900">{$t("app.contracts.members.add")}</h2>
                    <p class="mt-1 text-sm text-gray-500">{$t("app.contracts.members.select")}</p>
                  </div>
                  <form action="#" class="mt-6 flex">
                    <label for="search" class="sr-only">
                      {$t("shared.search")}
                    </label>
                    <input
                      bind:value={searchInput}
                      type="text"
                      name="search"
                      id="search"
                      class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder={$t("shared.searchDot")}
                    />
                  </form>
                </div>
                <div class="mt-5">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">{$t("models.user.plural")}</h3>

                  {#if loading}
                    <Loading />
                  {:else if items.length === 0}
                    <div>
                      <EmptyState
                        className="bg-white"
                        to="/app/settings/members/new"
                        captions={{
                          new: $t("shared.add"),
                          thereAreNo: getNoMembers(),
                        }}
                        icon="plus"
                      />
                    </div>
                  {:else}
                    <div>
                      <ul role="list" class="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
                        {#each filteredItems() as item}
                          <li class="py-2 flex items-center justify-between space-x-3">
                            {#if item.user}
                              <div class="min-w-0 flex-1 flex items-center space-x-3">
                                <div class="min-w-0 flex-1">
                                  <p class="text-sm font-bold text-gray-900 truncate">
                                    {item.user.firstName}
                                    {item.user.lastName}
                                    <span class="text-xs font-normal">({item.user.email})</span>
                                  </p>
                                  <p class="text-sm text-gray-500 truncate">
                                    {#if item.workspace} <span>{item.workspace.name}</span>{/if}
                                  </p>
                                </div>
                              </div>
                            {/if}
                            {#if item.user}
                              <div class="flex-shrink-0">
                                <button
                                  on:click={() => toggle(item)}
                                  type="button"
                                  class={classNames(
                                    "inline-flex items-center py-2 px-3 border border-transparent rounded-full focus:outline-none",
                                    !isSelected(item) && "text-gray-800 bg-gray-100 hover:bg-teal-200",
                                    isSelected(item) && "text-teal-800 bg-teal-100 hover:bg-red-200 "
                                  )}
                                >
                                  <!--Heroicon name: solid/plus-sm -->

                                  {#if !isSelected(item)}
                                    <svg
                                      class="-ml-1 mr-0.5 h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  {:else}
                                    <svg class="-ml-1 mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  {/if}

                                  {#if !isSelected(item)}
                                    <span class="text-sm font-medium text-gray-900">
                                      {$t("shared.add")}
                                      <span class="sr-only">
                                        {item.user.firstName}
                                        {item.user.lastName}
                                      </span>
                                    </span>
                                  {:else}
                                    <span class="text-sm font-medium text-gray-900">
                                      {$t("shared.remove")}
                                      <span class="sr-only">
                                        {item.user.firstName}
                                        {item.user.lastName}
                                      </span>
                                    </span>
                                  {/if}
                                </button>
                              </div>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                      <div class="py-3 text-right flex justify-end">
                        <div class="flex items-center space-x-2">
                          <button
                            type="button"
                            on:click={close}
                            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                          >
                            {$t("shared.cancel")}
                          </button>
                          <button
                            on:click={accept}
                            type="submit"
                            disabled={selected.length === 0}
                            class={classNames(
                              "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                              selected.length === 0 && " opacity-50 cursor-not-allowed"
                            )}
                          >
                            {$t("shared.accept")}
                          </button>
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <ErrorModal bind:this={errorModal} />
    </div>
  {/if}
</div>
