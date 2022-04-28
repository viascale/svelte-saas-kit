<script lang="ts">
  import type { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
  import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.svelte";
  import EmptyState from "@/components/ui/emptyState/EmptyState.svelte";
  import Loading from "@/components/ui/loaders/Loading.svelte";
  import services from "@/services";
  import classNames from "@/utils/shared/ClassesUtils";
  import { onMount } from "svelte";
  import { _ as t } from "svelte-i18n";

  let items: EmailTemplateDto[] = [];
  let loading: boolean = false;
  let canCreateEmailTemplates = false;
  const headers = [
    {
      title: $t("admin.emails.created"),
    },
    {
      title: $t("admin.emails.name"),
    },
    {
      title: $t("admin.emails.alias"),
    },
    {
      title: $t("admin.emails.subject"),
    },
    {
      title: $t("shared.actions"),
    },
  ];

  onMount(() => {
    reload();
  });

  function reload() {
    loading = true;
    canCreateEmailTemplates = false;
    services.setup
      .getPostmarkTemplates()
      .then((response) => {
        items = response;
        if (response.filter((f) => !f.created).length > 0) {
          canCreateEmailTemplates = true;
        }
      })
      .finally(() => {
        loading = false;
      });
  }
  function createAll() {
    loading = true;
    services.setup
      .createPostmarkTemplates()
      .then(() => {
        reload();
      })
      .catch((error) => {
        loading = false;
        console.error(error);
      });
  }
  function templateUrl(item: EmailTemplateDto) {
    return `https://account.postmarkapp.com/servers/${item.associatedServerId}/templates/${item.templateId}/edit`;
  }
</script>

<svelte:head>
  <title>{$t("admin.emails.title")} | Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
    <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
      <h1 class="flex-1 font-bold flex items-center truncate">{$t("admin.emails.title")}</h1>
      <div class="flex items-center space-x-2">
        <ButtonSecondary disabled={loading} on:click={reload}>
          {$t("shared.reload")}
        </ButtonSecondary>
        <ButtonSecondary disabled={loading || !canCreateEmailTemplates} on:click={createAll}>
          {$t("admin.emails.createAll")}
        </ButtonSecondary>
      </div>
    </div>
  </div>
  <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
    {#if loading}
      <Loading />
    {:else}
      <div class="flex flex-col">
        {#if items.length === 0}
          <EmptyState
            className="bg-white"
            captions={{
              thereAreNo: $t("admin.emails.noEmails"),
              description: $t("admin.emails.noEmailsDescription"),
            }}
          />
        {:else}
          <div class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
              <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      {#each headers as header}
                        <th scope="col" class="text-xs px-3 py-2 max-w-xs text-left font-medium text-gray-500 tracking-wider select-none truncate">
                          <div class="flex items-center space-x-1 text-gray-500">
                            <div>{header.title}</div>
                          </div>
                        </th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each items as item}
                      <tr>
                        <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                          <div class="flex justify-center">
                            {#if item.created}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-theme-600" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            {:else}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            {/if}
                          </div>
                        </td>
                        <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.name}</td>
                        <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.alias}</td>
                        <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.subject}</td>
                        <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                          <div class="flex items-center space-x-2">
                            {#if item.created}
                              <a
                                href={templateUrl(item)}
                                target="_blank"
                                rel="noreferrer"
                                class={classNames(
                                  item.created && "text-theme-600 hover:text-theme-800 hover:underline",
                                  !item.created && "text-gray-300 cursor-not-allowed"
                                )}
                              >
                                {$t("shared.edit")}
                              </a>
                            {/if}
                          </div>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
