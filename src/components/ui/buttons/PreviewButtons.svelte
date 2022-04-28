<script lang="ts">
  import ButtonPrimary from "./ButtonPrimary.svelte";
  import ButtonSecondary from "./ButtonSecondary.svelte";
  import ButtonTertiary from "./ButtonTertiary.svelte";
  import LoadingButton from "./LoadingButton.svelte";

  let loadingButton: LoadingButton;

  function startLoading() {
    loadingButton.start();
    setTimeout(() => {
      loadingButton.stop();
    }, 2000);
  }
</script>

<div class="space-y-2 w-full">
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary on:click={() => alert("Clicked primary button")}>Primary</ButtonPrimary>
    <ButtonSecondary on:click={() => alert("Clicked secondary button")}>Secondary</ButtonSecondary>
    <ButtonTertiary on:click={() => alert("Clicked tertiary button")}>Tertiary</ButtonTertiary>
    <LoadingButton bind:this={loadingButton} on:click={() => startLoading()}>Loading</LoadingButton>
  </div>
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary disabled={true}>Primary</ButtonPrimary>
    <ButtonSecondary disabled={true}>Secondary</ButtonSecondary>
    <ButtonTertiary disabled={true}>Tertiary</ButtonTertiary>
    <LoadingButton disabled={true}>Loading</LoadingButton>
  </div>
</div>
