<script lang="ts">
  import { onMount } from "svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";

  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
  import DateUtils from "@/utils/shared/DateUtils";
  import services from "@/services";
  import { _ as t } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let id: string;

  let successModalDeleted: any;
  let errorModal: ErrorModal;

  let loading: boolean = false;
  let item: TenantDto = {} as TenantDto;

  onMount(() => {
    reload();
  });

  function reload() {
    loading = true;
    services.tenants
      .get(id)
      .then((response) => {
        item = response;
      })
      .finally(() => {
        loading = false;
      });
  }
  function confirmedDelete() {
    loading = true;
    services.tenants
      .adminDelete(id)
      .then(() => {
        successModalDeleted?.show($t("shared.deleted"), $t("app.tenants.actions.deleted"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading = false;
      });
  }
  function successModalDeletedClosed() {
    navigate("/admin/tenants");
  }
  function dateMonthDayYear(value: Date | undefined) {
    return DateUtils.dateMonthDayYear(value);
  }
</script>

<div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />
    {:else}
      <div>
        <div class="relative min-h-screen">
          <main class="py-4">
            <div class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 172 172" class="h-16 w-16" fill="currentColor">
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
                    <h1 class="text-2xl font-bold text-gray-900">{item.name}</h1>
                  </div>
                  <p class="text-sm font-medium text-gray-500 truncate">
                    {$t("shared.createdBy")}
                    {#if item.createdByUser}
                      <span>
                        {$t("shared.by")}
                        <span class="text-gray-900">{item?.createdByUser?.email}</span>
                      </span>
                    {/if}
                    {$t("shared.in")}
                    {#if item.createdAt} <time>{dateMonthDayYear(item.createdAt)}</time>{/if}
                  </p>
                </div>
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
                          <dd class="mt-1 text-sm text-gray-900">{item.name}</dd>
                        </div>

                        <div class="sm:col-span-1">
                          <dt class="text-sm font-medium text-gray-500">{$t("models.workspace.plural")}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {#if item.workspaces} <span>{item.workspaces.length}</span>{/if}
                          </dd>
                        </div>
                        <div class="sm:col-span-2">
                          <dt class="text-sm font-medium text-gray-500">{$t("models.user.plural")}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {#if item.users} <span>{item.users.length}</span>{/if}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    {/if}
  </div>
  <SuccessModal bind:this={successModalDeleted} on:closed={successModalDeletedClosed} />
  <ConfirmModal on:yes={confirmedDelete} />
  <ErrorModal bind:this={errorModal} />
</div>
