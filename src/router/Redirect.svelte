<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let to: any;

  onMount(() => {
    navigate(to);
  });
</script>
