<script lang="ts">
  import UploadDocument from "./UploadDocument.svelte";
  import type { FileBase64 } from "@/application/dtos/shared/FileBase64";

  function droppedDocuments(event: any) {
    const filesBase64: FileBase64[] = event.detail.filesBase64;
    console.log("droppedDocument: files", filesBase64);
    alert(`@droppedDocuments ${filesBase64.length} files: ` + filesBase64.map((f) => f.base64.substr(0, 30) + "..."));
  }
  function droppedDocument(event: any) {
    const base64: string = event.detail.base64;
    const file: File = event.detail.file;
    console.log("droppedDocument: base64", base64);
    alert(`@droppedDocument: base64 [${base64.substr(0, 30)}...], file [name (${file.name}), size (${file.size})]`);
  }
</script>

<div class="space-y-2 w-full">
  <UploadDocument multiple={true} on:droppedFiles={droppedDocuments} on:dropped={droppedDocument} />
</div>
