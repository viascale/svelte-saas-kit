<script lang="ts">
  import Footer from "@/components/front/Footer.svelte";
  import Header from "@/components/front/Header.svelte";
  import WarningBanner from "@/components/ui/banners/WarningBanner.svelte";
  import { onMount } from "svelte";

  import { _ as t } from "svelte-i18n";

  const usersOptions = ["1", "2 - 3", "4 - 10", "11 - 25", "26 - 50", "51 - 100", "+100"];
  let firstName = "";
  let lastName = "";
  let email = "";
  let organization = "";
  let users = "1";
  let comments = "";
  let actionURL = "";

  onMount(() => {
    actionURL = import.meta.env.VITE_SVELTE_APP_INTEGRATIONS_CONTACT_FORMSPREE?.toString() ?? "";
  });
</script>

<svelte:head>
  <title>{$t("front.contact.title")} | Svelte SaasFrontend</title>
</svelte:head>
<div>
  <div>
    <Header />
    <div class="bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:flex-col sm:align-center">
          <div class="relative max-w-xl mx-auto py-12 sm:py-6 w-full overflow-hidden">
            <svg class="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
              <defs>
                <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" class="text-gray-200 dark:text-black" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
            </svg>
            <svg class="absolute right-full bottom-0 transform -translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
              <defs>
                <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" class="text-gray-200 dark:text-black" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
            </svg>
            <div class="text-center">
              <h2 class="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl">{$t("front.contact.title")}</h2>
              <p class="mt-4 text-lg leading-6 text-gray-500">{$t("front.contact.headline")}</p>
            </div>
            <div class="mt-12">
              {#if !actionURL}
                <WarningBanner title={$t("shared.notSet")} text={$t("front.contact.setup")} />
              {/if}
              <form action={actionURL} method="POST" class="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="first_name" class="block text-sm font-medium text-gray-900 dark:text-slate-300">
                    {$t("front.contact.firstName")}
                  </label>
                  <div class="mt-1">
                    <input
                      required
                      bind:value={firstName}
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label for="last_name" class="block text-sm font-medium text-gray-900 dark:text-slate-300">
                    {$t("front.contact.lastName")}
                  </label>
                  <div class="mt-1">
                    <input
                      bind:value={lastName}
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm font-medium text-gray-900 dark:text-slate-300">
                    {$t("front.contact.email")}
                  </label>
                  <div class="mt-1">
                    <input
                      required
                      bind:value={email}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <div class="flex justify-between">
                    <label for="company" class="block text-sm font-medium text-gray-900 dark:text-slate-300">
                      {$t("front.contact.organization")}
                    </label>
                    <span id="company_description" class="text-sm text-gray-500">
                      {$t("shared.optional")}
                    </span>
                  </div>
                  <div class="mt-1">
                    <input
                      bind:value={organization}
                      type="text"
                      name="company"
                      id="company"
                      autoComplete="organization"
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>

                <fieldset class="sm:col-span-2">
                  <legend class="block text-sm font-medium text-gray-900 dark:text-slate-300">{$t("front.contact.users")}</legend>
                  <div class="mt-4 grid grid-cols-1 gap-y-4">
                    <select
                      id="users"
                      required
                      bind:value={users}
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    >
                      {#each usersOptions as option}
                        <option value={option}>
                          {option}
                        </option>
                      {/each}
                    </select>
                  </div>
                </fieldset>

                <div class="sm:col-span-2">
                  <div class="flex justify-between">
                    <label for="comments" class="block text-sm font-medium text-gray-900 dark:text-slate-300">
                      {$t("front.contact.comments")}
                    </label>
                  </div>
                  <div class="mt-1">
                    <textarea
                      required
                      bind:value={comments}
                      id="comments"
                      name="comments"
                      aria-describedby="comments_description"
                      rows={4}
                      class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="text-right sm:col-span-2">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-theme-500 hover:bg-theme-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  >
                    {$t("front.contact.send")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</div>
