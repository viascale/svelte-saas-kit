<script lang="ts">
  import { Link } from "svelte-routing";

  import type { UserDto } from "@/application/dtos/core/users/UserDto";
  import ClientsUsage from "@/components/app/usages/ClientsUsage.svelte";
  import EmployeesUsage from "@/components/app/usages/EmployeesUsage.svelte";
  import ProvidersUsage from "@/components/app/usages/ProvidersUsage.svelte";
  import MySubscriptionProducts from "@/components/core/settings/subscription/MySubscriptionProducts.svelte";
  import UserUtils from "@/utils/store/UserUtils";
  import { _ as t } from "svelte-i18n";
  import { accountState } from "@/store/modules/accountStore";

  $: currentUser = $accountState.user ?? ({} as UserDto);
  $: avatar = $accountState.user?.avatar ?? "";
  $: avatarText = UserUtils.avatarText(currentUser);
</script>

<svelte:head>
  <title>{$t("app.sidebar.dashboard")} | Svelte SaasFrontend</title>
</svelte:head>

<main class="flex-1 relative pb-8 z-0 overflow-y-auto">
  <!--Page header -->
  <div class="hidden md:block bg-white shadow lg:border-t lg:border-gray-200">
    <div class="px-4 sm:px-8 max-w-5xl mx-auto">
      <div class="py-2 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <!--Profile -->
          <div class="flex items-center">
            <Link to="/app/settings/profile"
              >{#if avatar} <img class="hidden h-12 w-12 rounded-full sm:block" src={avatar} alt="Profile" />{/if}</Link
            >
            <div>
              <div class="flex items-center">
                <div>
                  {#if avatar}
                    <img class="h-12 w-12 rounded-sm sm:hidden" src={avatar} alt="Avatar" />
                  {:else}
                    <span class="sm:hidden inline-flex items-center justify-center h-12 w-12 rounded-sm bg-slate-800 shadow-xl">
                      <span class="text-sm font-medium leading-none text-white">{avatarText}</span>
                    </span>
                  {/if}
                </div>
                <h1 class="ml-3 text-lg font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                  {$t("shared.hi")}
                  {#if currentUser.firstName} <span>{currentUser.firstName} 👋!</span>{/if}
                </h1>
              </div>
              <dl class="flex flex-col sm:ml-3 sm:flex-row sm:flex-wrap">
                <dt class="sr-only">{$t("models.user.email")}</dt>
                <dd class="flex items-center text-xs text-gray-500 font-medium lowercase sm:mr-6">
                  <!--Heroicon name: office-building -->
                  <svg
                    class="flex-shrink-0 mr-0.5 h-3.5 w-3.5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {currentUser.email}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="px-4 sm:px-8 max-w-5xl mx-auto py-5 grid gap-5">
    <div class="mt-2 grid sm:grid-cols-1 gap-5">
      <div class="space-y-5">
        <MySubscriptionProducts withCurrentPlan={true} cols="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4" />
        <div>
          <div>
            <div class="flex items-center space-x-2 justify-between">
              <h3 class="leading-5 text-gray-900">{$t("app.dashboard.summary")}</h3>
            </div>

            <dl class="mt-2 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
              <ProvidersUsage />
              <ClientsUsage />
              <EmployeesUsage />
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
