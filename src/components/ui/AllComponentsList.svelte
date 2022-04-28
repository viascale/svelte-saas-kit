<script lang="ts">
  import classNames from "@/utils/shared/ClassesUtils";
  import ButtonSecondary from "./buttons/ButtonSecondary.svelte";
  import SlideOver from "./slideOvers/SlideOver.svelte";
  import PreviewTabsAsButtons from "./tabs/PreviewTabsAsButtons.svelte";
  import PreviewTabsAsLinks from "./tabs/PreviewTabsAsLinks.svelte";
  import PreviewButtonsAsLinks from "./buttons/PreviewButtonsAsLinks.svelte";
  import PreviewButtonsDestructive from "./buttons/PreviewButtonsDestructive.svelte";
  import PreviewDropdownsSimple from "./dropdowns/PreviewDropdownsSimple.svelte";
  import PreviewDropdownsWithClick from "./dropdowns/PreviewDropdownsWithClick.svelte";
  import PreviewModals from "./modals/PreviewModals.svelte";
  import PreviewBanners from "./banners/PreviewBanners.svelte";
  import PreviewEmptyStates from "./emptyState/PreviewEmptyStates.svelte";
  import PreviewUploadersDocument from "./uploaders/PreviewUploadersDocument.svelte";
  import PreviewLoaders from "./loaders/PreviewLoaders.svelte";
  import PreviewBreadcrumbs from "./breadcrumbs/PreviewBreadcrumbs.svelte";
  import PreviewButtons from "./buttons/PreviewButtons.svelte";
  import PreviewPdfViewers from "./pdf/PreviewPdfViewers.svelte";

  export let className: string = "";
  export let withSlideOvers: boolean = false;

  let showRightSlideOver: boolean = false;
</script>

<div>
  <div class={classNames(className, "space-y-6 pb-12 p-4 mx-auto max-w-2xl text-slate-900")}>
    <div class="space-y-1">
      <h3 class="font-medium text-sm">Breadcrumbs</h3>
      <div class="flex items-center space-x-2 p-2 border-dashed border-gray-300 border">
        <PreviewBreadcrumbs />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Tab - as Links</h3>
      <div class="flex items-center space-x-2 p-2 border-dashed border-gray-300 border">
        <PreviewTabsAsLinks />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Tab - as Buttons</h3>
      <div class="p-2 border-dashed border-gray-300 border">
        <PreviewTabsAsButtons />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Buttons</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtons />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Links</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtonsAsLinks />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Destructive Buttons</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtonsDestructive />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Dropdowns - Simple</h3>
      <div class="space-x-2 bg-white p-6 border-dashed border-gray-300 border">
        <PreviewDropdownsSimple />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Dropdowns - with Click</h3>
      <div class="space-x-2 bg-white p-6 border-dashed border-gray-300 border">
        <PreviewDropdownsWithClick />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Modals</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewModals />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Banners</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewBanners />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Empty States</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewEmptyStates />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Uploaders</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewUploadersDocument />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Pdf Viewer</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewPdfViewers />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Loaders</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewLoaders />
      </div>
    </div>

    {#if withSlideOvers}
      <div class="space-y-1">
        <h3 class="font-medium text-sm">Slide-overs</h3>
        <div class="bg-white p-6 border-dashed border-gray-300 border">
          <ButtonSecondary on:click={() => (showRightSlideOver = !showRightSlideOver)}>Right slide-over</ButtonSecondary>
        </div>
      </div>
    {/if}

    {#if showRightSlideOver}
      <SlideOver on:close={() => (showRightSlideOver = false)}>
        <span slot="content">Content here...</span>
      </SlideOver>{/if}
  </div>
</div>
