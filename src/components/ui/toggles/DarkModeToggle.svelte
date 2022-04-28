<script lang="ts">
  import { Theme } from "@/application/enums/shared/Theme";
  import { themeState, themeStore } from "@/store/modules/themeStore";

  $: theme = $themeState.value;

  function toggle() {
    const htmlClasses = document.querySelector("html")?.classList;
    if (theme === Theme.DARK) {
      themeStore.setTheme(Theme.LIGHT);
      htmlClasses?.remove("dark");
    } else {
      themeStore.setTheme(Theme.DARK);
      htmlClasses?.add("dark");
    }
  }
</script>

<button type="button" on:click={toggle} class="flex items-center justify-center space-x-2 w-full focus:outline-none group">
  <span class="text-base font-medium">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  </span>
  <div class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500">
    <div class="w-6 h-3.5 transition bg-gray-500 rounded-full shadow-md outline-none" />
    <div
      class={`absolute inline-flex bg-white items-center justify-center w-1.5 h-1.5 transition-all duration-200 ease-in-out transform rounded-full shadow-sm top-1 left-1
                  ${theme === 1 ? "translate-x-3" : ""}`}
    />
  </div>
  <span class="text-base font-medium">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </span>
</button>
