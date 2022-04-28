<script lang="ts">
  import Logo from "@/components/front/Logo.svelte";
  import IconLight from "@/assets/img/icon-light.png";
  import IconDark from "@/assets/img/icon-dark.png";
  import DarkModeToggle from "@/components/ui/toggles/DarkModeToggle.svelte";
  import LocaleSelector from "@/components/ui/selectors/LocaleSelector.svelte";

  import classNames from "@/utils/shared/ClassesUtils";
  import { Theme } from "@/application/enums/shared/Theme";
  import Icon from "./Icon.svelte";

  import { _ as t } from "svelte-i18n";
  import { Link } from "svelte-routing";
  import { themeState } from "@/store/modules/themeStore";
  import { authState } from "@/store/modules/authStore";

  let open = false;
  const links = [
    { path: "/", title: $t("front.navbar.product") },
    { path: "/pricing", title: $t("front.navbar.pricing") },
    { path: "/contact", title: $t("front.navbar.contact") },
    { path: "/components", title: $t("admin.components.title") },
  ];
  function isCurrent(path: string): boolean {
    return location.pathname === path;
  }
  $: theme = $themeState.value;
  $: authenticated = $authState.authenticated;
</script>

<div>
  <div class="bg-white dark:bg-gray-900 pb-6">
    <div class="relative pt-6 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <nav class="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
          <div class="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
            <div class="flex items-center justify-between w-full md:w-auto">
              <Logo className="hidden lg:block" size="h-9" />
              <Icon className="lg:hidden" size="h-9" />
              <div class="-mr-1 flex items-center md:hidden">
                <div class="flex">
                  <div class="inline-flex rounded-md space-x-2">
                    <LocaleSelector
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-gray-900 dark:text-slate-300"
                    />
                    <Link
                      to={authenticated ? "/app" : "/login"}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-gray-900 dark:text-slate-300"
                    >
                      {#if !authenticated}
                        <div>{$t("account.shared.signIn")}</div>
                      {:else}
                        <div>{$t("shared.enter")}</div>
                      {/if}
                    </Link>
                  </div>
                </div>
                <button
                  on:click={() => (open = !open)}
                  type="button"
                  class="bg-white dark:bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                  id="main-menu"
                  aria-haspopup="true"
                >
                  <span class="sr-only">{$t("shared.close")}</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="hidden md:flex space-x-2 sm:space-x-4 md:space-x-6">
            {#each links as link}
              <Link
                to={link.path}
                class={classNames(
                  "text-base leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm",
                  !isCurrent(link.path) && "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                  isCurrent(link.path) && "text-gray-900 dark:text-white"
                )}
              >
                {link.title}
              </Link>
            {/each}
            <LocaleSelector className="hidden lg:block" />
            <DarkModeToggle />
          </div>
          <div class="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0 z-40">
            <span class="inline-flex rounded-md shadow">
              <Link
                to={authenticated ? "/app" : "/login"}
                class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-sm text-theme-600 dark:text-white bg-white dark:bg-slate-800 hover:bg-gray-50"
              >
                {#if !authenticated}
                  <div>{$t("account.shared.signIn")}</div>
                {:else}
                  <div>{$t("shared.enter")}</div>
                {/if}
              </Link>
            </span>
          </div>
        </nav>
      </div>

      <!-- Mobile menu -->
      <transition
        enter-active-class="duration-150 ease-out"
        enter-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-100 ease-in"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        {#if open}
          <div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-40">
            <div
              class="rounded-lg bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"
            >
              <div class="px-5 pt-4 flex items-center justify-between">
                <div>
                  {#if theme === Theme.DARK}
                    <img alt="Icon" class="h-8 w-auto sm:h-10" src={IconDark} />
                  {:else}
                    <img alt="Icon" class="h-8 w-auto sm:h-10" src={IconLight} />
                  {/if}
                </div>
                <div class="-mr-2">
                  <button
                    on:click={() => (open = !open)}
                    type="button"
                    class="rounded-md p-2 inline-flex items-center justify-center text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                  >
                    <span class="sr-only">{$t("shared.close")}</span>
                    <!-- Heroicon name: x -->
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                <div class="px-2 pt-2 pb-3" role="none">
                  {#each links as link}
                    <Link
                      to={link.path}
                      role="menuitem"
                      class={classNames(
                        "block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-slate-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-800",
                        isCurrent(link.path) ? "bg-slate-100 dark:bg-gray-900" : ""
                      )}
                    >
                      {link.title}
                    </Link>
                  {/each}
                </div>
                <div role="none" class="flex space-x-2 items-center">
                  <Link
                    to="/register"
                    class="block w-full px-5 py-3 text-center font-medium text-gray-900 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                    role="menuitem"
                  >
                    <div>{$t("account.shared.signUp")}</div>
                  </Link>
                  <Link
                    to="/login"
                    class="block w-full px-5 py-3 text-center font-medium text-gray-900 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                    role="menuitem"
                  >
                    <div>{$t("account.shared.signIn")}</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </transition>
    </div>
  </div>
</div>
