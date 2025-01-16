<script lang="ts">
  import { onMount } from 'svelte'
  import { socketStore } from '$lib/services/socketio'
  import { nanoid } from 'nanoid'
  import { JsonInput } from '$lib/components/json-input'

  let subscriptions: any = $state([])
  let events:any = $state([])

  function saveSubscriptions() {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }

  function subscribe(id: string) {
    const subscription = subscriptions.find((s: any) => s.id === id)
    if (!subscription.active) return;

    $socketStore?.[subscription.once ? 'once' : 'on'](subscription.topic, (data: any) => {
      events.push({ topic: subscription.topic, data })
      console.log('Received event:', subscription.topic, data)
    })
  }

  function reSubscribe(id: string) {
    const current = subscriptions.find((s: any) => s.id === id)
    $socketStore?.off(current.topic)
    saveSubscriptions()
    subscribe(id)
  }

  function addSubscription() {
    subscriptions.push({ id: nanoid(), topic: '', active: false, once: false })
    saveSubscriptions()
  }

  function removeSubscription(id: string) {
    const current = subscriptions.find((s: any) => s.id === id)
    if (current.active) {
      $socketStore?.off(current.topic)
    }
    subscriptions = subscriptions.filter((s: any) => s.id !== id)
    saveSubscriptions()
  }

  onMount(() => {
    const lsSubscriptions = localStorage.getItem('subscriptions')
    if (lsSubscriptions) {
      subscriptions = JSON.parse(lsSubscriptions)
    }
    for (const subscription of subscriptions) {
      subscribe(subscription.id)
    }
  })
</script>


<section>
  {#if subscriptions.length}
  <section class="overflow-x-auto">
    <table class="table table-xs">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Once</th>
          <th>Active</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each subscriptions as subscription}
        <tr>
          <td>
            <input 
              bind:value={subscription.topic} 
              oninput={() => reSubscribe(subscription.id)} 
              class="input input-bordered input-sm w-full" 
            />
          </td>
          <td>
            <input bind:checked={subscription.once} onchange={() => reSubscribe(subscription.id)} type="checkbox" />
          </td>
          <td>
            <input bind:checked={subscription.active} onchange={() => reSubscribe(subscription.id)} type="checkbox" />
          </td>
          <td>
            <button onclick={() => removeSubscription(subscription.id)}>X</button>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </section>
  {/if}
  <section class="flex w-full justify-end pt-1">
    <button class="btn w-full" class:btn-sm={subscriptions.length} onclick={addSubscription}>Add Event listener</button>
  </section>
  <section class="overflow-y-scroll pt-1">
    <JsonInput value={events} disabled={true} rows={30} />
  </section>  
</section>
