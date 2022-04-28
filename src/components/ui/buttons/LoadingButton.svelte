<script lang="ts">
  import ButtonPrimary from "./ButtonPrimary.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let className: string = "";
  export let type: "button" | "submit" | "reset" | undefined = "button";
  export let disabled: boolean = false;

  let loading: boolean = false;

  export function start() {
    loading = true;
  }
  export function stop() {
    loading = false;
  }
</script>

<ButtonPrimary
  disabled={disabled || loading}
  className={classNames(className, "relative justify-center", loading && "base-spinner cursor-not-allowed")}
  {type}
  on:click={() => dispatch("click")}
>
  <slot />
</ButtonPrimary>
