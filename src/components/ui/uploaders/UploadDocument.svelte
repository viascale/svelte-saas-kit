<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import imageCompression from "browser-image-compression";
  import type { FileBase64 } from "@/application/dtos/shared/FileBase64";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title: string = "";
  export let accept: string = "";
  export let multiple: boolean = false;
  export let description: string = "";
  // export let onDropped?: (base64: string, file: File) => void = "";
  // onDroppedFiles?: (fileBase64: FileBase64[], files: any[]) => void;

  let isDragging = false;
  let loading = false;
  let customClasses = "";

  function dragOver() {
    if (!loading) {
      isDragging = true;
    }
  }
  function dragLeave() {
    isDragging = false;
  }
  async function compressFile(imageFile: File): Promise<any> {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920 / 2,
      useWebWorker: true,
    };
    try {
      const file = await imageCompression(imageFile, options);
      return Promise.resolve(file);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async function compressFileNotImage(imageFile: File): Promise<any> {
    return Promise.resolve(imageFile);
  }
  async function drop(e: any) {
    console.log("e", e);
    let files: File[] = [...e.dataTransfer.files];
    const newImagesPromises: any[] = [];
    files.forEach((element: File) => {
      if (element.type.includes("image")) {
        newImagesPromises.push(compressFile(element));
      } else {
        newImagesPromises.push(compressFileNotImage(element));
      }
    });
    files = await Promise.all(newImagesPromises);
    const filesArray: FileBase64[] = [];
    const promises: any[] = [];

    files.forEach((file) => {
      const promise = getBase64(file);
      promises.push(promise);
      promise
        .then((response: string) => {
          filesArray.push({
            file,
            base64: response,
          });
          dispatch("dropped", { base64: response, file });
        })
        .catch((e) => {
          console.error(e);
        });
    });
    await Promise.all(promises).then(() => {
      dispatch("droppedFiles", { filesBase64: filesArray, files });
    });
    isDragging = false;
  }
  function requestUploadFile() {
    const src = document.querySelector("#uploadmyfile");
    drop({ dataTransfer: src });
  }
  function getBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (ev) => {
        resolve(ev?.target?.result?.toString() ?? "");
      };
      reader.readAsDataURL(file);
    });
  }

  $: customClasses = isDragging && !loading ? "bg-theme-200 border-2 border-dashed border-theme-800" : "";
</script>

<div
  class={classNames(customClasses, "text-gray-600 overflow-hidden drop text-center flex border-2 border-dashed border-gray-300 rounded-md items-center")}
  on:dragover|preventDefault={dragOver}
  on:dragleave={dragLeave}
  on:drop|preventDefault={drop}
>
  {#if loading}
    <div class="mx-auto font-medium text-base">{$t("shared.loading")}...</div>
  {:else}
    <div>
      <h1 class="mx-auto font-bold text-lg text-theme-500">{title}</h1>
      <div class="manual">
        <div class="space-y-1 text-center">
          <slot name="icon" />
          <div class="flex text-sm text-gray-600">
            <label
              for="uploadmyfile"
              class="relative cursor-pointer rounded-md font-medium text-theme-600 hover:text-theme-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-500"
            >
              <span />
              <label for="uploadmyfile">
                <p class="font-semibold text-sm underline cursor-pointer hover:text-theme-500">{$t("app.shared.buttons.uploadDocument")}</p>
              </label>
              <input type="file" id="uploadmyfile" {accept} {multiple} on:change={requestUploadFile} />
            </label>
            <p class="pl-1 lowercase">
              {$t("shared.or")}
              {$t("shared.dragAndDrop")}
            </p>
          </div>
          <p class="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  {/if}
</div>
