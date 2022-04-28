<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";

  import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  type size = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";

  export let title: string = "";
  export let size: size = "md";
  export let paddingContent: string = "px-4 sm:px-6";
  export let paddingY: string = "py-6";

  let open: boolean = true;

  useEscapeKeypress(() => dispatch("close"));
</script>

<div>
  {#if open}
    <div class="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />

    <div class="fixed inset-0 overflow-hidden z-10">
      <div class="absolute inset-0 overflow-hidden">
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div
            class={classNames(
              "w-screen max-w-sm",
              size === "md" && "md:max-w-md",
              size === "lg" && "md:max-w-lg",
              size === "2xl" && "md:max-w-2xl",
              size === "3xl" && "md:max-w-3xl",
              size === "4xl" && "md:max-w-4xl",
              size === "full" && "md:max-w-full"
            )}
          >
            <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
              <div class={classNames(paddingY, "h-0 flex-1 space-y-6 overflow-y-scroll")}>
                {#if title}
                  <header class="px-4 sm:px-6">
                    <div class="flex items-start justify-between space-x-3">
                      <h2 class="text-lg leading-7 font-medium text-gray-900">{title}</h2>
                      <div class="h-7 flex items-center">
                        <button
                          on:click={() => dispatch("close")}
                          aria-label="Close panel"
                          class="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150"
                        >
                          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </header>
                {/if}
                <div class={classNames(paddingContent, "relative flex-1")}>
                  <!--Replace with your content -->
                  <slot name="content" />
                  <slot name="footer" class="flex-shrink-0 px-1 py-4 space-x-4 flex justify-end border-t border-gray-200" />
                  <!--/End replace -->
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="absolute top-4 right-10">
        {#if !title}
          <button
            on:click={() => dispatch("close")}
            class="flex items-center space-x-1 py-1 px-2 text-xs uppercase hover:bg-gray-200 rounded-md shadow-lg bg-white border border-gray-300 text-gray-800 font-extrabold"
          >
            <div>Close</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
