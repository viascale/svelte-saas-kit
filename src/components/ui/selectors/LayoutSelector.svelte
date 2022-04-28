<script lang="ts">
  import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
  import { appStore } from "@/store/modules/appStore";
  import classNames from "@/utils/shared/ClassesUtils";
  import { clickOutside } from "@/utils/shared/KeypressUtils";
  import { _ as t } from "svelte-i18n";

  export let className: string = "";

  let open = false;
  const layouts = [
    {
      name: $t("shared.layouts.sidebar"),
      value: ApplicationLayout.SIDEBAR,
    },
    {
      name: $t("shared.layouts.stacked"),
      value: ApplicationLayout.STACKED,
    },
  ];

  function closeDropDown() {
    open = false;
  }
  function select(value: ApplicationLayout) {
    closeDropDown();
    appStore.setLayout(value);
  }
</script>

<div class={classNames(className, "relative")} use:clickOutside on:click_outside={closeDropDown}>
  <button
    type="button"
    on:click={() => (open = !open)}
    class="cursor-pointer select-none leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-900 dark:focus:text-white"
  >
    <span>{$t("settings.preferences.layouts")}</span>
  </button>
  <transition
    enter-active-class="transition ease-out duration-100"
    enter-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    {#if open}
      <div class={!open ? "z-40 origin-top-right absolute right-0 mt-2 w-44 rounded-sm " : "z-40 mt-2 w-44 rounded-sm "}>
        <div class="rounded-sm bg-white dark:bg-slate-900 border border-primary shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
          {#each layouts as layout}
            <button
              type="button"
              on:click={() => select(layout.value)}
              class="w-full h-10 space-x-2 cursor-pointer truncate group flex items-center px-2 text-sm text-gray-900 dark:text-slate-300 hover:bg-slate-100 dark:bg-gray-900 transition ease-in-out duration-150 border-b border-primary"
              role="menuitem"
            >
              <div class="pl-1">{layout.name}</div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </transition>
</div>
