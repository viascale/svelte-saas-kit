<script lang="ts">
  import InfoBanner from "./InfoBanner.svelte";
  import WarningBanner from "./WarningBanner.svelte";
</script>

<div class="space-y-2 w-full">
  <InfoBanner title="InfoBanner" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..." />
  <WarningBanner title="WarningBanner" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..." />
  <WarningBanner
    title="WarningBanner with Redirect"
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
    redirect="https://saasfrontends.com"
  />
</div>
