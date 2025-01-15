<script lang="ts">
  let {
    value = $bindable(),
    placeholder,
    rows,
    disabled
  }: {
    value: any;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
  } = $props();
  let error = $state('');
  let strInput = $state('');

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    try {
      const json = JSON.parse(target.value);
      error = '';
      value = json;
    } catch (e) {
      error = (e as Error).message;
    }
  }

  $effect(() => {
    if (value) {
      try {
        const strJson = JSON.stringify(value, null, 2);
        if (strJson !== $state.snapshot(strInput)) {
          strInput = JSON.stringify(value, null, 2);
        }
      } catch {}
    }
  });
</script>

<textarea
  {disabled}
  class="h-auto w-full cursor-text resize-none p-3 text-sm {error ? 'border-red-500' : ''}"
  rows={rows || 15}
  value={strInput}
  oninput={handleInput}
  placeholder={placeholder || 'Enter JSON here...'}
></textarea>
{#if error}
  <div class="error">Invalid JSON: {error}</div>
{/if}
