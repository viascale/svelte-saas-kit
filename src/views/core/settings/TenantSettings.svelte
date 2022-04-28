<script lang="ts">
  import { onMount } from "svelte";
  import type { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
  import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
  import ErrorModal from "@/components/ui/modals/ErrorModal.svelte";
  import SuccessModal from "@/components/ui/modals/SuccessModal.svelte";
  import UploadImage from "@/components/ui/uploaders/UploadImage.svelte";
  import services from "@/services";
  import { _ as t } from "svelte-i18n";
  import { tenantState, tenantStore } from "@/store/modules/tenantStore";

  let errorModal: ErrorModal;
  let successModal: SuccessModal;

  let name: string = "";
  let subdomain: string = "";
  let domain: string = "";
  let imageType = "";
  let imageCurrent = "";
  let showUploadImage: boolean = false;
  let uploadingImage: boolean = false;

  onMount(() => {
    getCurrentTenantInForm();
  });

  $: tenant = $tenantState.current;

  function getCurrentTenantInForm() {
    name = tenant?.name ?? "";
    subdomain = tenant?.subdomain ?? "";
    domain = tenant?.domain ?? "";
  }
  function updateTenant() {
    services.tenants
      .update({
        name,
        subdomain,
        domain,
      } as TenantDto)
      .then(() => {
        successModal?.show($t("shared.updated"), $t("settings.tenant.updated"));
      })
      .catch((error) => {
        errorModal?.show($t("shared.error"), $t(error));
      });
  }
  function loadedImage(event: any) {
    const image: string = event.detail.base64;
    const payload: TenantUpdateImageRequest = {
      type: imageType,
      logo: imageType === "logo" ? image : "",
      icon: imageType === "icon" ? image : "",
      logoDarkmode: imageType === "logoDarkmode" ? image : "",
    };
    uploadingImage = true;
    services.tenants
      .updateImage(payload)
      .then(() => {
        tenantStore.setCurrentImage({
          imageType,
          image,
        });
        showUploadImage = false;
      })
      .catch((error) => {
        console.error("Error: " + error);
      })
      .finally(() => {
        uploadingImage = false;
      });
  }
</script>

<svelte:head>
  <title>{$t("app.navbar.tenant")} | Svelte SaasFrontend</title>
</svelte:head>

<div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="md:grid lg:grid-cols-3 md:gap-2">
    <div class="md:col-span-1">
      <div class="sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{$t("settings.tenant.general")}</h3>
        <p class="mt-1 text-xs leading-5 text-gray-600">{$t("settings.tenant.generalDescription")}</p>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <form on:submit|preventDefault={updateTenant} method="POST">
        <div class="shadow overflow-hidden sm:rounded-sm">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-6 gap-2">
              <div class="col-span-6 sm:col-span-6">
                <label for="name" class="block text-sm font-medium leading-5 text-gray-700">
                  {$t("shared.name")}
                </label>
                <input
                  bind:value={name}
                  required
                  id="name"
                  class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
            >
              {$t("shared.save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  {#if showUploadImage && !uploadingImage}
    <UploadImage on:close={() => (showUploadImage = false)} title={$t("shared." + imageType)} initialImage={imageCurrent} on:loaded={loadedImage} />
  {/if}
  <SuccessModal bind:this={successModal} />
  <ErrorModal bind:this={errorModal} />
</div>
