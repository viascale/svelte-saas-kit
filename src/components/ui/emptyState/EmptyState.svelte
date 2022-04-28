<script lang="ts">
  import ButtonSecondary from "../buttons/ButtonSecondary.svelte";
  import IconEmptyResults from "@/assets/icons/IconEmptyResults.svelte";
  import classNames from "@/utils/shared/ClassesUtils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  interface Captions {
    description?: string;
    thereAreNo?: string;
    new?: string;
  }

  export let captions: Captions;
  export let className: string = "";
  export let to: string = "";
  export let icon: string = "";
</script>

<div class={classNames(className, "text-center border-2 border-dashed border-gray-200 py-16 px-1.6")}>
  <IconEmptyResults className="mx-auto w-10" />
  <h3 class="mt-2 text-sm font-medium text-gray-900">{captions.thereAreNo}</h3>
  <p class="mt-1 text-sm text-gray-500">{captions.description ?? ""}</p>
  {#if captions.new}
    <div class="mt-6">
      {#if to}
        <ButtonSecondary {to}>
          {#if icon === "plus"}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          {:else if icon === "refresh"}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          {:else}
            <div />
          {/if}
          <div>{captions.new}</div>
        </ButtonSecondary>
      {:else}
        <ButtonSecondary on:click={() => dispatch("click")} type="button">
          <div>
            {#if icon === "plus"}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            {/if}
          </div>
          <div>{captions.new}</div>
        </ButtonSecondary>
      {/if}
    </div>
  {/if}
</div>
