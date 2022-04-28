<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { loadStripe } from "@stripe/stripe-js";
  import { Container, CardNumber, CardExpiry, CardCvc } from "svelte-stripe-js";
  const dispatch = createEventDispatcher();

  let stripe = null;
  let cardElement: any;

  onMount(async () => {
    stripe = await loadStripe(import.meta.env.VITE_SVELTE_APP_SUBSCRIPTION_PUBLIC_KEY.toString());
  });

  // TODO: submit, payed, payError
  async function submit() {
    await stripe
      .createToken(cardElement)
      .then((response: any) => {
        dispatch("payed", { data: response });
      })
      .catch((error: any) => {
        dispatch("error", { error: error });
      });
  }
</script>

{#if stripe}
  <Container {stripe}>
    <form class="space-y-3 text-lg" on:submit|preventDefault={submit}>
      <div class="grid grid-cols-12">
        <div class="col-span-6">
          <CardNumber bind:element={cardElement} />
        </div>
        <div class="col-span-3">
          <CardExpiry />
        </div>
        <div class="col-span-3">
          <CardCvc />
        </div>
      </div>

      <div class="mt-2">
        <slot />
      </div>
    </form>
  </Container>
{/if}
