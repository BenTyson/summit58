<script lang="ts">
  interface Props {
    routeId: string;
    onUpload: (file: File) => Promise<void>;
  }

  let { routeId, onUpload }: Props = $props();

  let fileInput: HTMLInputElement;
  let selectedFile = $state<File | null>(null);
  let isUploading = $state(false);
  let isDragging = $state(false);
  let error = $state<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  function handleFileSelect(file: File | null) {
    error = null;

    if (!file) {
      selectedFile = null;
      return;
    }

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      error = 'Please select a .gpx file.';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      error = 'File size must be less than 5MB.';
      return;
    }

    selectedFile = file;
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    handleFileSelect(target.files?.[0] || null);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    handleFileSelect(e.dataTransfer?.files?.[0] || null);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function clearSelection() {
    selectedFile = null;
    error = null;
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    isUploading = true;
    error = null;

    try {
      await onUpload(selectedFile);
      clearSelection();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Upload failed. Please try again.';
    } finally {
      isUploading = false;
    }
  }
</script>

<div class="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-6">
  <form onsubmit={handleSubmit}>
    {#if !selectedFile}
      <!-- Drop zone -->
      <div
        class="
          flex flex-col items-center justify-center py-6 cursor-pointer rounded-lg transition-colors
          {isDragging ? 'bg-sunrise/10' : ''}
        "
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        onclick={() => fileInput.click()}
        onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
        role="button"
        tabindex="0"
      >
        <div class="h-12 w-12 rounded-full bg-mountain-blue/10 dark:bg-mountain-blue/20 flex items-center justify-center mb-3">
          <svg class="h-6 w-6 text-mountain-blue dark:text-mountain-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="text-slate-700 dark:text-slate-200 font-medium mb-1">
          Upload a GPX trace
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Drag and drop or click to browse
        </p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">
          .gpx files up to 5MB
        </p>
      </div>

      <input
        bind:this={fileInput}
        type="file"
        accept=".gpx"
        class="hidden"
        onchange={handleInputChange}
      />
    {:else}
      <!-- File selected -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <div class="h-10 w-10 rounded-lg bg-mountain-blue/10 dark:bg-mountain-blue/20 flex items-center justify-center flex-shrink-0">
            <svg class="h-5 w-5 text-mountain-blue dark:text-mountain-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onclick={clearSelection}
            class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Remove file"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="submit"
            disabled={isUploading}
            class="
              px-5 py-2 rounded-lg
              bg-gradient-to-r from-mountain-blue to-mountain-navy
              text-white font-medium text-sm
              hover:from-mountain-navy hover:to-mountain-blue
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
          >
            {#if isUploading}
              <span class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </span>
            {:else}
              Upload Trace
            {/if}
          </button>
        </div>
      </div>
    {/if}

    {#if error}
      <p class="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
    {/if}
  </form>
</div>
