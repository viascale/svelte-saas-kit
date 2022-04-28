<script lang="ts">
  import ConfirmModal from "./ConfirmModal.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import Modal from "./Modal.svelte";
  import SuccessModal from "./SuccessModal.svelte";
  import ButtonSecondary from "../buttons/ButtonSecondary.svelte";

  let successModal: SuccessModal;
  let errorModal: ErrorModal;
  let confirmModal: ConfirmModal;
  let emptyModal: Modal;

  function showSuccessModal() {
    successModal.show("Title", "Description...");
  }
  function showErrorModal() {
    errorModal.show("Title", "Description...");
  }
  let confirmModalValue = {};
  function showConfirmModal() {
    confirmModalValue = { name: "Sample" };
    confirmModal.show("Title", "Confirm", "Cancel", "Description...");
  }
  function showEmptyModal() {
    emptyModal?.show();
  }
  function onYes(event?: any) {
    if (event.detail.value) {
      alert("confirmed with value: " + JSON.stringify(event.detail.value));
    } else {
      alert("yes");
    }
  }
</script>

<div class="space-y-2 w-full">
  <div class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center">
    <ButtonSecondary on:click={() => showSuccessModal()}>Success Modal</ButtonSecondary>
    <ButtonSecondary on:click={() => showErrorModal()}>Error Modal</ButtonSecondary>
    <ButtonSecondary on:click={() => showConfirmModal()}>Confirm Modal</ButtonSecondary>
    <ButtonSecondary on:click={() => showEmptyModal()}>Empty Modal</ButtonSecondary>
  </div>
  <SuccessModal bind:this={successModal} on:closed={() => alert("Closed success modal")} />
  <ErrorModal bind:this={errorModal} on:closed={() => alert("Closed error modal")} />
  <ConfirmModal bind:this={confirmModal} bind:value={confirmModalValue} on:no={() => alert("No")} on:yes={onYes} />
  <Modal bind:this={emptyModal}>
    <div>Your content here...</div>
  </Modal>
</div>
