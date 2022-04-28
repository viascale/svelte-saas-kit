<script lang="ts">
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  import { accountState } from "@/store/modules/accountStore";
  const dispatch = createEventDispatcher();

  export let inputType: string = "";
  export let validateInput: boolean = true;
  export let value: any = undefined;

  let yesButton: HTMLButtonElement;
  let inputEmail: HTMLInputElement;

  let question: string = "";
  let yesTitle: string = "";
  let noTitle: string = "";
  let subtitle: string = "";
  let inputString: string = "";
  let showing = false;

  $: email = $accountState.user?.email ?? "";

  onMount(() => {
    if (inputType === "email") {
      inputString = email;
    }
  });
  export function show(_question: string, _yesTitle?: string, _noTitle?: string, _subtitle?: string, _inputString?: string) {
    question = _question.toString();
    showing = true;
    if (_yesTitle) {
      yesTitle = _yesTitle;
    }
    if (_noTitle) {
      noTitle = _noTitle;
    }
    if (_subtitle) {
      subtitle = _subtitle;
    }
    setTimeout(() => {
      if (yesButton) {
        yesButton.focus();
      }
      if (inputType === "email" && inputEmail) {
        inputEmail.focus();
        inputEmail.select();
      }
    }, 500);
    // window.addEventListener("keyup", keyup);
    if (_inputString) {
      inputString = _inputString;
    }
  }
  function keyup(event: KeyboardEvent) {
    if (event.key === "Escape") {
      no();
    } else if (event.key === "Enter") {
      yes();
    }
  }
  function yes() {
    if (inputType) {
      value = inputString;
      if (validateInput && (!inputString || inputString.toString().trim() === "")) {
        return;
      }
    }
    dispatch("yes", { value });
    value = undefined;
    showing = false;
    window.removeEventListener("keyup", keyup);
  }
  function no() {
    value = undefined;
    showing = false;
    dispatch("no");
    window.removeEventListener("keyup", keyup);
  }
</script>

<div>
  {#if showing}
    <div on:keyup={keyup}>
      <div class="fixed z-50 inset-x-0 px-4 pb-6 inset-0 p-0 flex items-center justify-center">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-50 border border-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">{question}</h3>
              {#if subtitle}
                <p class="text-gray-500 text-sm mt-3">
                  {subtitle}
                </p>
              {/if}

              {#if inputType === "email"}
                <div class="mt-4">
                  <label for="email" class="block text-sm font-medium text-gray-700" />
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <!-- Heroicon name: solid/mail -->
                      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      v-model="inputString"
                      bind:this={inputEmail}
                      type="text"
                      name="email"
                      id="email"
                      class="focus:ring-theme-500 focus:border-theme-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              {/if}
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              bind:this={yesButton}
              on:click={yes}
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm bg-theme-600 hover:bg-theme-700 focus:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              >{yesTitle ? yesTitle : $t("shared.yes")}</button
            >
            <button
              on:click={no}
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >{noTitle ? noTitle : $t("shared.no")}</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
