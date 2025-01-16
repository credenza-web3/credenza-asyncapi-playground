<script lang="ts">
  import { ConnectionComponent } from '$lib/components/connection';
  import { EmitterComponent } from '$lib/components/emitter';
  import { EventsComponent } from '$lib/components/events'
  import { socketStore } from '$lib/services/socketio';

  let activeTab = 0
</script>

<main class="p-2">
  <ConnectionComponent />
  {#if $socketStore}
    <section role="tablist" class="tabs tabs-bordered">
      <button class="tab" class:tab-active={activeTab === 0} onclick={() => (activeTab = 0)}>Requests</button>
      <button class="tab" class:tab-active={activeTab === 1} onclick={() => (activeTab = 1)}>Events</button>
    </section>
    <div class:hidden={activeTab !== 0}><EmitterComponent /></div>
    <div class:hidden={activeTab !== 1}><EventsComponent /></div>
  {/if}
</main>
