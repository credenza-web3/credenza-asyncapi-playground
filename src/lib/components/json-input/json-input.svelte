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

  function handleTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const value = textarea.value;
    textarea.value = value.slice(0, start) + '  ' + value.slice(end);

    textarea.selectionStart = textarea.selectionEnd = start + 2;
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
  placeholder={placeholder || 'Enter JSON here...'}
  oninput={handleInput}
  onkeydown={handleTab}
></textarea>
{#if error}
  <div class="error">Invalid JSON: {error}</div>
{/if}
