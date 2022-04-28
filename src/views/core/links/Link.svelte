<script lang="ts">
  import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.svelte";
  import LinkProfile from "@/components/app/links/all/LinkProfile.svelte";
  import { _ as t } from "svelte-i18n";

  export let id: string = "";
</script>

<div>
  <Breadcrumb menu={[{ title: $t("models.link.plural"), routePath: "/app/links/all" }]} />
  <LinkProfile {id} />
</div>
