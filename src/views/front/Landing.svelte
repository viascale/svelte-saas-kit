<script lang="ts">
  import Hero from "@/components/front/Hero.svelte";
  import Features from "@/components/front/Features.svelte";
  import JoinNow from "@/components/front/JoinNow.svelte";
  import Faq from "@/components/front/Faq.svelte";
  import Footer from "@/components/front/Footer.svelte";
</script>

<svelte:head>
  <title>Svelte SaasFrontend</title>
</svelte:head>

<div>
  <div class="relative overflow-hidden bg-white dark:bg-gray-900 text-coolGray-800 dark:text-slate-200">
    <Hero />
    <Features className="relative z-10" />
    <JoinNow />
    <Faq />
    <Footer />
  </div>
</div>
