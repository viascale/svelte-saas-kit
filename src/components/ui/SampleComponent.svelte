<script lang="ts">
  import { onMount } from "svelte";
  import ButtonPrimary from "./buttons/ButtonPrimary.svelte";

  let counter: number = 0;

  onMount(() => {
    console.log("mounted");
  });

  function increment(i: number) {
    counter += i;
  }
</script>

<div>
  <ButtonPrimary on:click={() => increment(1)}>Counter: {counter}</ButtonPrimary>
</div>
