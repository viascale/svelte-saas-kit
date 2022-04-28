<script setup lang="ts">
  import _supportedLocales from "../../../locale/supportedLocales";
  import { _ as t, locale } from "svelte-i18n";
  import classNames from "@/utils/shared/ClassesUtils";
  import { clickOutside } from "@/utils/shared/KeypressUtils";

  export let className = "";
  let open = false;
  const supportedLocales = _supportedLocales;

  function closeDropDown() {
    open = false;
  }
  function changedLocale(value: string) {
    closeDropDown();
    localStorage.setItem("locale", value);
    locale.set(value);
    window.location.reload();
  }
</script>

<div class={classNames(className, "relative")} use:clickOutside on:click_outside={closeDropDown}>
  <button
    type="button"
    on:click={() => (open = !open)}
    class="cursor-pointer select-none leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-900 dark:focus:text-white"
  >
    <span>{$t("settings.preferences.language")}</span>
  </button>
  {#if open}
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-class="transition ease-in duration-75"
      leaveFrleave-to-classom="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div class="z-40 origin-top-right absolute right-0 mt-2 w-44 rounded-sm">
        <div class="rounded-sm bg-white dark:bg-slate-900 border border-primary shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
          {#each supportedLocales as language}
            <button
              type="button"
              on:click={() => changedLocale(language.lang)}
              class="w-full h-10 space-x-2 cursor-pointer truncate group flex items-center px-2 text-sm text-gray-900 dark:text-slate-300 hover:bg-slate-100 dark:bg-gray-900 transition ease-in-out duration-150 border-b border-primary"
              role="menuitem"
            >
              <div class="pl-1">{$t("shared.locales." + language.lang)}</div>
            </button>
          {/each}
        </div>
      </div>
    </transition>
  {/if}
</div>
