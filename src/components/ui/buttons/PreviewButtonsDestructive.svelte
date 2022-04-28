<script lang="ts">
  import ButtonPrimary from "./ButtonPrimary.svelte";
  import ButtonSecondary from "./ButtonSecondary.svelte";
  import ButtonTertiary from "./ButtonTertiary.svelte";
</script>

<div class="space-y-2 w-full">
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary on:click={() => alert("Clicked primary destructive button")} destructive={true}>Primary</ButtonPrimary>
    <ButtonSecondary on:click={() => alert("Clicked secondary destructive button")} destructive={true}>Secondary</ButtonSecondary>
    <ButtonTertiary on:click={() => alert("Clicked tertiary destructive button")} destructive={true}>Tertiary</ButtonTertiary>
  </div>
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary disabled={true} destructive={true}>Primary</ButtonPrimary>
    <ButtonSecondary disabled={true} destructive={true}>Secondary</ButtonSecondary>
    <ButtonTertiary disabled={true} destructive={true}>Tertiary</ButtonTertiary>
  </div>
</div>
