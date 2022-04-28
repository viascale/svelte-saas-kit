<script lang="ts">
  import { onMount } from "svelte";
  import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
  import { UserType } from "@/application/enums/core/users/UserType";
  import MembersListAndTable from "@/components/core/settings/members/MembersListAndTable.svelte";
  import ConfirmModal from "@/components/ui/modals/ConfirmModal.svelte";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import tinyEventBus from "@/plugins/tinyEventBus";
  import services from "@/services";
  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import { _ as t } from "svelte-i18n";
  import { Link } from "svelte-routing";
  import { tenantState } from "@/store/modules/tenantStore";
  import { appState } from "@/store/modules/appStore";
  import { accountState } from "@/store/modules/accountStore";

  const acceptedUserQueryParam = new URLSearchParams(window.location.search).get("au") ?? "";

  let errorModal: ErrorModal;
  let confirmAcceptUser: ConfirmModal;

  let loading: boolean = false;
  let searchInput: string = "";

  let items: TenantUserDto[] = [];
  // const [tenantJoinSettings,tenantJoinSettings = ] = useState({} as any);
  // const [enableLink,enableLink = ] = useState(false);
  // const [enablePublicUrl,enablePublicUrl = ] = useState(false);
  // const [requireAcceptance,requireAcceptance = ] = useState(false);
  let acceptedUser: TenantUserDto | null = null;
  let acceptUserEmail = acceptedUserQueryParam;

  onMount(() => {
    tinyEventBus().emitter.on("user-added", () => reload());
    tinyEventBus().emitter.on("user-saved", () => reload());
    tinyEventBus().emitter.on("user-deleted", () => reload());

    reload();

    return () => {
      tinyEventBus().emitter.off("user-deleted");
      tinyEventBus().emitter.off("user-added");
      tinyEventBus().emitter.off("user-saved");
    };
  });

  function reload() {
    loading = true;
    const promises: any[] = [];
    promises.push(services.tenants.getFeatures());
    // promises.push(
    //   services.tenantUserInvitations.getInvitationSettings().then((response: TenantJoinSettingsDto) => {
    //    tenantJoinSettings = (response);
    //    enableLink = (tenantJoinSettings.linkActive);
    //    enablePublicUrl = (tenantJoinSettings.publicUrl);
    //    requireAcceptance = (tenantJoinSettings.requireAcceptance);
    //   })
    // );
    promises.push(
      services.tenantUsers
        .getAll()
        .then((response: TenantUserDto[]) => {
          items = response;

          if (acceptUserEmail) {
            const user = items.find((f) => f.email === acceptUserEmail);
            if (user && user.status === TenantUserStatus.PENDING_ACCEPTANCE) {
              acceptUser(user, true);
            }
          }
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), $t(error));
        })
    );

    Promise.all(promises).finally(() => {
      loading = false;
    });
  }
  // function saved(data) {
  //   const idx = items.findIndex((f) => f.id === data.id);
  //   items[idx] = data;
  // }
  // function deleted(data) {
  //   items(items.filter((f) => f.id !== data.id));
  // }
  function yesAcceptUser() {
    if (isOwnerOrAdmin && acceptedUser) {
      services.tenantUserInvitations
        .acceptUser(acceptedUser)
        .then(() => {
          reload();
        })
        .catch((error) => {
          errorModal?.show($t("shared.error"), $t(error));
        });
    }
  }
  function acceptUser(item: TenantUserDto, accept: boolean) {
    item.accepted = accept;
    acceptedUser = item;
    confirmAcceptUser?.show($t("shared.accept?", { values: { p1: item.email } }).toString(), $t("shared.accept").toString(), $t("shared.cancel").toString());
  }
  $: isOwnerOrAdmin = currentRole == TenantUserRole.OWNER || currentRole == TenantUserRole.ADMIN;
  $: currentRole = $tenantState.current?.currentUser.role;
  $: maxUsers = $accountState.user?.type === UserType.Admin ? 0 : $appState.features?.maxUsers ?? 0;
  $: maxUsersReached = maxUsers > 0 && $tenantState.members.length >= maxUsers;
  $: filteredItems = (): TenantUserDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.email?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.phone?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };
  $: sortedItems = () => {
    if (!items) {
      return [];
    }
    const filtered = filteredItems()
      .slice()
      .sort((x, y) => {
        return x.role > y.role ? -1 : 1;
      });
    return filtered.sort((x, y) => {
      return x.role > y.role ? 1 : -1;
    });
  };
</script>

<svelte:head>
  <title>{$t("settings.members.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    {#if loading}
      <Loading />
    {:else}
      <div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <div class="flex items-center justify-between w-full space-x-2">
              <div class="relative flex items-center w-full flex-grow">
                <div class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="buscador"
                  id="buscador"
                  class="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                  placeholder={$t("shared.searchDot")}
                  bind:value={searchInput}
                />
              </div>
              <Link
                to="/app/settings/members/new"
                class="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>

                <div>{$t("shared.new")}</div>
              </Link>
            </div>
          </div>
          <div>
            <MembersListAndTable items={sortedItems()} />

            {#if !loading && maxUsersReached}
              <div>
                <WarningBanner
                  title={$t("app.subscription.errors.limitReached")}
                  text={$t("app.subscription.errors.limitReachedUsers", { values: { p1: maxUsers } })}
                />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
  <ErrorModal bind:this={errorModal} />
  <ConfirmModal bind:this={confirmAcceptUser} on:yes={yesAcceptUser} />
  <slot />
</div>
