<script lang="ts">
  function showChat() {
    // this.$crisp.push(["do", "chat:show"]);
    // this.$crisp.push(["do", "chat:open"]);
  }
</script>

<div class="relative">
  <div class="relative">
    <div class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
      <div class="text-sm relative z-0 inline-flex shadow-none rounded-full">
        <button
          on:click={showChat}
          type="button"
          class="text-gray-800 bg-gray-50 border-gray-100 shadow-inner border relative inline-flex items-center p-2 rounded-full font-medium hover:bg-theme-300 hover:text-theme-800 focus:bg-theme-400 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-100"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="chat-label"
        >
          <span class="sr-only">Chat</span>
          <!--Heroicon name: solid/chevron-down -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
