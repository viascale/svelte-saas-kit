<script lang="ts">
  import { Link } from "svelte-routing";
  import classNames from "@/utils/shared/ClassesUtils";
  import { clickOutside } from "@/utils/shared/KeypressUtils";
  import UserUtils from "@/utils/store/UserUtils";

  import { _ as t } from "svelte-i18n";
  import { accountState } from "@/store/modules/accountStore";
  import { authStore } from "@/store/modules/authStore";

  let opened: boolean = false;

  function closeDropDownUser() {
    opened = false;
  }
  function signOut() {
    authStore.logout();
    UserUtils.loggedOut();
  }
  $: user = $accountState.user;
  $: email = $accountState.user?.email ?? "";
  $: avatar = $accountState.user?.avatar ?? "";
  $: profileName = () => {
    if (user) {
      if (user.firstName && user.lastName) {
        return user.firstName + " " + user.lastName;
      } else {
        return user.email;
      }
    } else {
      return "--";
    }
  };
</script>

<div use:clickOutside on:click_outside={() => (opened = false)} class="relative">
  <div class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
    <button
      on:click={() => (opened = !opened)}
      class={classNames(
        "bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-theme-100 focus:ring-offset-2 focus:ring-offset-theme-50 focus:text-theme-900 focus:z-10 font-medium hover:text-theme-800 inline-flex items-center relative rounded-full shadow-inner text-slate-400",
        !avatar && "p-2 focus:bg-theme-400 hover:bg-theme-300",
        avatar && "p-1 hover:bg-gray-200"
      )}
      id="user-menu"
      aria-label="User menu"
      aria-haspopup="true"
    >
      {#if avatar}
        <img class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-800" src={avatar} alt="Avatar" />
      {:else}
        <span class="inline-block h-5 w-5 rounded-full overflow-hidden">
          <svg class="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      {/if}
    </button>
  </div>

  <transition
    enter-active-class="transition ease-out duration-100"
    enter-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    {#if opened}
      <div
        class="z-40 origin-top-right absolute right-0 mt-2 w-64 rounded-sm shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1 rounded-sm bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
          <span class="truncate group flex items-center px-4 py-2 text-sm text-gray-700 transition ease-in-out duration-150" role="menuitem">
            <div class="flex flex-col space-y-1 truncate">
              <div class="font-medium">{profileName()}</div>
              <div class="font-bold truncate">{email}</div>
            </div>
          </span>
          <div class="border-t border-gray-200" />

          <Link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            on:click={closeDropDownUser}
            to="/app/settings/profile"
          >
            {$t("app.navbar.profile")}
          </Link>
          <Link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            on:click={closeDropDownUser}
            to="/app/settings/workspaces"
          >
            {$t("app.navbar.workspaces")}
          </Link>

          <Link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            on:click={closeDropDownUser}
            to="/app/settings/members"
          >
            {$t("app.navbar.members")}
          </Link>
          <Link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            on:click={closeDropDownUser}
            to="/app/settings/subscription"
          >
            {$t("app.navbar.subscription")}
          </Link>
          <Link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            on:click={closeDropDownUser}
            to="/app/settings/tenant"
          >
            {$t("app.navbar.tenant")}
          </Link>
          <div class="border-t border-gray-200 mt-1" />

          <button
            on:click={signOut}
            class="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150 focus:outline-none"
            role="menuitem"
          >
            {$t("app.navbar.signOut")}
          </button>
        </div>
      </div>
    {/if}
  </transition>
</div>
