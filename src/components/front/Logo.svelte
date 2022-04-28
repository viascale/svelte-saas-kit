<script lang="ts">
  import { Theme } from "@/application/enums/shared/Theme";
  import LogoLight from "@/assets/img/logo-light.png";
  import LogoDark from "@/assets/img/logo-dark.png";
  import classNames from "@/utils/shared/ClassesUtils";
  import { Link } from "svelte-routing";
  import { themeState } from "@/store/modules/themeStore";

  export let className = "";
  export let size = "h-9";

  $: theme = $themeState.value;
</script>

<Link to="/" class={className}>
  {#if theme === Theme.DARK}
    <img class={classNames(size, "w-auto mx-auto")} src={LogoDark} alt="Logo" />
  {:else}
    <img class={classNames(size, "w-auto mx-auto")} src={LogoLight} alt="Logo" />
  {/if}
</Link>
