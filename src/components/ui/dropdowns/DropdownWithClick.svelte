<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "@/utils/shared/KeypressUtils";
  const dispatch = createEventDispatcher();

  export let right: boolean = false;

  let opened = false;
  export function close() {
    opened = false;
  }
</script>

<span use:clickOutside on:click_outside={close} class="relative inline-flex shadow-sm rounded-md">
  <button
    type="button"
    class="-mr-1 relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
    on:click={() => dispatch("click")}
  >
    <slot name="button" />
  </button>
  <span class="-ml-px relative block">
    <button
      on:click={() => (opened = !opened)}
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
      {#if opened}
        <div
          class={classNames(
            "z-20 absolute mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
            !right && "origin-top-right right-0",
            right && "origin-top-left left-0"
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <slot name="options" />
          </div>
        </div>
      {/if}
    </transition>
  </span>
</span>
