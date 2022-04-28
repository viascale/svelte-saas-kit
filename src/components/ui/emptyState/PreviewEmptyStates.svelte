<script lang="ts">
  import EmptyState from "./EmptyState.svelte";

  let currentRoute = location.pathname;
</script>

<div class="space-y-2 w-full">
  <EmptyState
    on:click={() => alert("Clicked")}
    captions={{
      new: "Button",
      thereAreNo: "There are no...",
      description: "Description...",
    }}
    icon="plus"
  />
  <EmptyState
    to={currentRoute}
    captions={{
      new: "Link",
      thereAreNo: "There are no...",
      description: "Description...",
    }}
  />
</div>
