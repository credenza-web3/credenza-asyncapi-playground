<script lang="ts">
  import { onMount } from 'svelte';
  import type { SocketOptions } from 'socket.io-client';
  import { connectSocketIO, disconnectSocketIO, socketStore } from '$lib/services/socketio';

  import { JsonInput } from '$lib/components/json-input';

  let optsDialog: HTMLDialogElement;
  let connectionString: string = $state('');
  let connectionOptions: SocketOptions = $state({
    auth: {
      client_id: '',
      client_secret: ''
    }
  });

  async function connect() {
    try {
      if (!connectionString || !connectionOptions) return;
      await connectSocketIO(connectionString, connectionOptions);
      localStorage.setItem('connectionString', connectionString);
    } catch (err) {
      alert('Connection failed: ' + (err as Error).message)
    }
  }

  function saveConnectionOptions() {
    localStorage.setItem('connectionOptions', JSON.stringify(connectionOptions));
    optsDialog.close();
  }

  onMount(() => {
    const lsConnectionOptions = localStorage.getItem('connectionOptions');
    if (lsConnectionOptions) connectionOptions = JSON.parse(lsConnectionOptions);
    const lsConnectionString = localStorage.getItem('connectionString');
    if (lsConnectionString) connectionString = lsConnectionString;
  });
</script>

<section>
  <section>SocketIO Connection:</section>
  <section class="flex">
    <input
      class="input input-bordered w-full"
      placeholder="Type here"
      bind:value={connectionString}
    />
    {#if $socketStore}
      <button class="btn" onclick={disconnectSocketIO}>Disconnect</button>
    {:else}
      <button class="btn ml-1" onclick={() => optsDialog.showModal()}>Options</button>
      <button class="btn ml-1" onclick={() => connect()}>Connect</button>
    {/if}

    <dialog class="modal" bind:this={optsDialog}>
      <div class="modal-box w-11/12 max-w-5xl">
        <JsonInput bind:value={connectionOptions} placeholder="Connection options..." />
        <div class="modal-action">
          <form method="dialog">
            <button class="btn" onclick={saveConnectionOptions}>Save</button>
          </form>
        </div>
      </div>
    </dialog>
  </section>
</section>
