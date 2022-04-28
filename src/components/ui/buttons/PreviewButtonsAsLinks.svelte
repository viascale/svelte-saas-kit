<script lang="ts">
  import ButtonPrimary from "./ButtonPrimary.svelte";
  import ButtonSecondary from "./ButtonSecondary.svelte";
  import ButtonTertiary from "./ButtonTertiary.svelte";

  const currentRoute = location.pathname;
</script>

<div class="space-y-2 w-full">
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary to={currentRoute}>Primary</ButtonPrimary>
    <ButtonSecondary to={currentRoute}>Secondary</ButtonSecondary>
    <ButtonTertiary to={currentRoute}>Tertiary</ButtonTertiary>
  </div>
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonPrimary disabled={true} to={currentRoute}>Primary</ButtonPrimary>
    <ButtonSecondary disabled={true} to={currentRoute}>Secondary</ButtonSecondary>
    <ButtonTertiary disabled={true} to={currentRoute}>Tertiary</ButtonTertiary>
  </div>
</div>
