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
        "inline-flex space-x-2 items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md bg-white border-gray-300",
        disabled && "cursor-not-allowed opacity-75",
        !destructive && "text-theme-800",
        destructive && "text-red-700",
        !disabled && "focus:outline-none focus:ring-2 focus:ring-offset-2",
        !disabled && !destructive && "hover:bg-theme-50 focus:ring-theme-500",
        !disabled && destructive && "hover:bg-red-50 focus:ring-red-500"
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
        "inline-flex space-x-2 items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md bg-white border-gray-300",
        disabled && "cursor-not-allowed opacity-75",
        !destructive && "text-theme-800",
        destructive && "text-red-700",
        !disabled && "focus:outline-none focus:ring-2 focus:ring-offset-2",
        !disabled && !destructive && "hover:bg-theme-50 focus:ring-theme-500",
        !disabled && destructive && "hover:bg-red-50 focus:ring-red-500"
      )}
    >
      <slot />
    </Link>
  {/if}
</span>
