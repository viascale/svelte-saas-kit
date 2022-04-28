<script lang="ts">
  import FakePdfBase64 from "./FakePdfBase64";
  import PdfViewer from "./PdfViewer.svelte";
</script>

<div class="space-y-2 w-full">
  <PdfViewer className="w-full" file={FakePdfBase64} />
</div>
