<script lang="ts">
  import { onMount } from 'svelte';
  import { nanoid } from 'nanoid';
  import { socketStore } from '$lib/services/socketio';
  import { JsonInput } from '$lib/components/json-input';

  let requestList: any[] = $state([]);
  let activeRequest: any = $state(null);
  let response: any = $state({});

  function emitEvent() {
    response = { loading: true };
    $socketStore?.emit(activeRequest.topic.trim(), activeRequest.data, (result: any) => {
      result && (response = result);
    });
  }

  function removeRequest(e: Event, id: string) {
    e.stopPropagation();
    e.preventDefault();
    const activeRequestId = activeRequest?.id;
    const idx = requestList.findIndex((r: any) => r.id === id);
    requestList.splice(idx, 1);
    if (id === activeRequestId) {
      activeRequest = requestList?.[0] || null;
    }
    localStorage.setItem('requests', JSON.stringify(requestList));
  }

  function refreshRequests() {
    const lsRequests = localStorage.getItem('requests');
    requestList = lsRequests ? JSON.parse(lsRequests) : [];
  }

  function saveRequestData() {
    const lsRequests = localStorage.getItem('requests');
    const parsedLsRequests = lsRequests ? JSON.parse(lsRequests) : [];
    const currentRequest = parsedLsRequests.find((r: any) => r.id === activeRequest.id);
    Object.assign(currentRequest, activeRequest);
    localStorage.setItem('requests', JSON.stringify(parsedLsRequests));
  }

  function createRequest() {
    requestList.push({
      id: nanoid(),
      topic: '',
      data: {
        headers: {},
        payload: {}
      }
    });
    localStorage.setItem('requests', JSON.stringify(requestList));
    activeRequest = requestList?.[requestList.length - 1];
  }

  onMount(() => {
    refreshRequests();
    activeRequest = requestList?.[0] || null;
  });
</script>

{#if $socketStore}
  <section class="pt-2">
    <div role="tablist" class="tabs tabs-bordered flex">
      {#each requestList as requestItem}
        <button
          class="tab relative"
          class:tab-active={requestItem.id === activeRequest.id}
          onclick={() => (activeRequest = requestItem)}
        >
          {requestItem.topic || requestItem.id}
          <a href="/" class="flex w-4 justify-end" onclick={(e) => removeRequest(e, requestItem.id)}
            >x</a
          >
        </button>
      {/each}
      <button class="tab" class:tab-active={!requestList.length} onclick={createRequest}>+</button>
    </div>
    {#if activeRequest}
      <section class="pb-2">
        <label for="topic" class="w-full">Topic:</label>
        <input bind:value={activeRequest.topic} class="input input-sm input-bordered w-full" />
      </section>
      <section class="flex flex-col justify-end">
        <label for="request">Request:</label>
        <JsonInput bind:value={activeRequest.data} />
        <section class="flex w-full justify-end">
          <button class="btn btn-sm mr-1 mt-1" onclick={saveRequestData}>Save</button>
          <button class="btn btn-sm mt-1" onclick={emitEvent}>Emit</button>
        </section>
      </section>
      {#if Object.keys(response).length > 0}
        <section>
          <label for="response">Response:</label>
          <JsonInput value={response} disabled={true} />
        </section>
      {/if}
    {/if}
  </section>
{/if}
