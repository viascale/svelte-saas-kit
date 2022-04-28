<script lang="ts">
  import { themeState } from "@/store/modules/themeStore";

  import IconLight from "../../assets/img/icon-light.png";
  import IconDark from "../../assets/img/icon-dark.png";

  import { Theme } from "@/application/enums/shared/Theme";
  import classNames from "@/utils/shared/ClassesUtils";

  export let className = "";
  export let size = "h-9";

  $: theme = $themeState.value;
</script>

<div class={className}>
  {#if theme === Theme.DARK}
    <img class={classNames(size, "w-auto mx-auto")} src={IconDark} alt="Logo" />
  {:else}
    <img class={classNames(size, "w-auto mx-auto")} src={IconLight} alt="Logo" />
  {/if}
</div>
