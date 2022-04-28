<script lang="ts">
  import { Link } from "svelte-routing";
  import classNames from "@/utils/shared/ClassesUtils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let className: string = "";
  export let type: "button" | "submit" | "reset" | undefined = "button";
  export let to: string = "";
  export let target: string = "";
  export let disabled: boolean = false;
  export let destructive: boolean = false;
</script>

<span>
  {#if !to}
    <button
      on:click={() => dispatch("click")}
      {type}
      {disabled}
      class={classNames(
        className,
        "underline inline-flex space-x-2 items-center px-1 py-2 text-sm font-medium focus:outline-none",
        disabled && "cursor-not-allowed opacity-75",
        !destructive && "text-theme-600",
        destructive && "text-gray-600",
        !disabled && !destructive && "hover:text-theme-800 focus:text-theme-900",
        !disabled && destructive && "hover:text-gray-800 focus:text-gray-900"
      )}
    >
      <slot />
    </button>
  {:else}
    <Link
      {to}
      {target}
      class={classNames(
        className,
        "underline inline-flex space-x-2 items-center px-1 py-2 text-sm font-medium focus:outline-none",
        disabled && "cursor-not-allowed opacity-75",
        !destructive && "text-theme-600",
        destructive && "text-gray-600",
        !disabled && !destructive && "hover:text-theme-800 focus:text-theme-900",
        !disabled && destructive && "hover:text-gray-800 focus:text-gray-900"
      )}
    >
      <slot />
    </Link>
  {/if}
</span>
