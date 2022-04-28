<script lang="ts">
  import { Link } from "svelte-routing";
  import Dropdown from "./Dropdown.svelte";

  let currentRoute = location.pathname;
</script>

<div class="space-y-2 w-full">
  <div class="flex justify-between">
    <Dropdown right={true}>
      <span slot="button">Dropdown</span>
      <span slot="options">
        <button
          type="button"
          class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          on:click={() => {
            alert("click");
          }}
        >
          <div>Button</div>
        </button>
        <Link
          to={currentRoute}
          class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
          role="menuitem"
          tabindex={-1}
          id="menu-item-1"
        >
          <div>Link</div>
        </Link>
      </span>
    </Dropdown>
    <Dropdown>
      <span slot="button">Dropdown</span>
      <span slot="options">
        <button
          type="button"
          class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          on:click={() => {
            alert("click");
          }}
        >
          <div>Button</div>
        </button>
        <Link
          to={currentRoute}
          class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
          role="menuitem"
          tabindex={-1}
          id="menu-item-1"
        >
          <div>Link</div>
        </Link>
      </span>
    </Dropdown>
  </div>
</div>
