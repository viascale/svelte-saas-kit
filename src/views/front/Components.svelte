<script lang="ts">
  import Footer from "@/components/front/Footer.svelte";
  import Header from "@/components/front/Header.svelte";
  import AllComponentsList from "@/components/ui/AllComponentsList.svelte";

  import { _ as t } from "svelte-i18n";
</script>

<svelte:head>
  <title>{$t("admin.components.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <Header />
  <div class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div class="sm:flex sm:flex-col sm:align-center">
        <div class="relative mx-auto py-12 sm:py-6 w-full">
          <svg class="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg class="absolute right-full bottom-0 transform -translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <div class="text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">{$t("admin.components.title")}</h2>
            <p class="mt-4 text-lg leading-6 text-gray-500">{$t("admin.components.headline")}</p>
          </div>
          <div class="mt-12">
            <AllComponentsList />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</div>
