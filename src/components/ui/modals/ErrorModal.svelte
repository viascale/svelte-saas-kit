<script lang="ts">
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let className: string = "";

  let closeButton: HTMLButtonElement;

  let title: string = "";
  let description: string = "";
  let showing = false;

  onMount(() => {
    title = $t("shared.error").toString();
  });

  export function show(_title: string, _description?: string) {
    if (_title) {
      title = _title;
    }
    if (_description) {
      description = _description;
    } else if (_title) {
      title = $t("shared.error").toString();
      description = _title;
    }
    showing = true;
    closeButton?.focus();
  }
  function keyup(event: KeyboardEvent) {
    console.log(event);
    if (event.key === "Escape" || event.key === "Enter") {
      close();
    }
  }
  function close() {
    dispatch("closed");
    showing = false;
  }
</script>

<span>
  {#if showing}
    <div on:keyup={keyup} class={className}>
      <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center block p-0">
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
          </transition>

          <span class="inline-block align-middle h-screen" aria-hidden="true" />
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-4 translate-y-0 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 translate-y-0 scale-95"
          >
            <div
              class="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-sm w-full p-6"
            >
              <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <!-- Heroicon name: outline/check -->
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div class="text-center mt-5">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-700">{description}</p>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <button
                  bind:this={closeButton}
                  on:click={close}
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-white font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-0 text-sm"
                  >{$t("shared.close")}</button
                >
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  {/if}
</span>
