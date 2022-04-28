<script lang="ts">
  import SlideOver from "../slideOvers/SlideOver.svelte";
  import { useState } from "@/utils/shared/ObjectUtils";
  import UploadDocument from "./UploadDocument.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title: string = "";
  export let initialImage: string = "";

  const [image, setImage] = useState(initialImage);

  function onChange(event: any) {
    const { base64, file } = event.detail;
    setImage(base64);
    dispatch("loaded", { base64, file });
    dispatch("close");
  }
</script>

<div>
  <SlideOver on:close={() => dispatch("close")} {title}>
    <div slot="content" class="space-y-2">
      <UploadDocument accept="image/png, image/jpg, image/jpeg" description={title} on:dropped={onChange} />
      {#if $image}
        <div>
          <img class="w-full h-auto" alt="Upload" src={$image} />
        </div>
      {/if}
    </div>
  </SlideOver>
</div>
