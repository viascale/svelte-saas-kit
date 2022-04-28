<script setup lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let file: string;
  export let fileName: string = "";
  export let className: string = "";
  export let editing: boolean = false;

  let pdfDoc: any = "";
  let pdfScale: number = 0.49;

  let currentPage: number = 1;
  let pageCount: number = 0;

  onMount(() => {
    loadFile(file);
  });

  function nextPage() {
    if (currentPage < pdfDoc.numPages) {
      currentPage += 1;
      renderPage(currentPage);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage -= 1;
      renderPage(currentPage);
    }
  }

  function loadFile(url: string) {
    PdfJs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
    const loadingTask = PdfJs.getDocument(url);
    loadingTask.promise
      .then((loadedPdf) => {
        pageCount = loadedPdf.numPages;
        pdfDoc = loadedPdf;
        renderPage(1); // Represents rendering page 1
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  function renderPage(num: any) {
    pdfDoc.getPage(num).then((page: any) => {
      const canvas: any = document.getElementById("pdf-canvas");
      const ctx: any = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      const ratio = dpr / bsr;
      const viewport = page.getViewport({ scale: pdfScale });
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      canvas.style.width = viewport.width + "px";
      canvas.style.height = viewport.height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  }

  function downloadPdf() {
    const downloadLink = document.createElement("a");
    const name = (fileName ?? "document") + ".pdf";
    downloadLink.href = file;
    downloadLink.download = name;
    downloadLink.click();
  }
</script>

<div class={classNames(className, "text-gray-600 overflow-hidden border border-gray-300 rounded-md items-center")}>
  <div class="p-4 flex justify-between items-center">
    <div class="origin-top-left left-0 top-0 mt-1 ml-1 flex items-center space-x-2">
      <span class="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          type="button"
          class={classNames(
            "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500",
            currentPage === 1 && "cursor-not-allowed  bg-gray-50",
            currentPage !== 1 && "hover:bg-gray-50"
          )}
          disabled={currentPage === 1}
          on:click={prevPage}
        >
          <span class="sr-only">{$t("shared.previous")}</span>
          <!-- {/*Heroicon name: solid/chevron-left */} -->
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none"
          >{currentPage} / {pageCount}</span
        >
        <button
          type="button"
          class={classNames(
            "-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500",
            currentPage === pageCount && "cursor-not-allowed bg-gray-50",
            currentPage !== pageCount && "hover:bg-gray-50"
          )}
          disabled={currentPage === pageCount}
          on:click={nextPage}
        >
          <span class="sr-only">{$t("shared.next")}</span>
          <!-- {/*Heroicon name: solid/chevron-right */} -->
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
    </div>
    <div class="flex items-center space-x-2">
      <button
        type="button"
        class="origin-top-right right-0 top-0 mt-1 mr-0 text-gray-600 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
        on:click={downloadPdf}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
      {#if editing}
        <button
          type="button"
          class="origin-top-right right-0 top-0 mt-1 mr-0 text-gray-600 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
          on:click={() => dispatch("removeFile")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>
  <div class="py-4 mx-auto text-center flex items-center justify-center">
    <div class="pdf-container">
      <canvas id="pdf-canvas" />
    </div>
  </div>
</div>
