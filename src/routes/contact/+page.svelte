<script lang="ts">
  import { enhance } from '$app/forms';
  import Container from '$lib/components/ui/Container.svelte';
  import type { PageData, ActionData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Contact | SaltGoat</title>
  <meta name="description" content="Get in touch with the SaltGoat team." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container size="narrow" class="py-16 sm:py-20">
    <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
      Contact
    </h1>
    <p class="mt-3 text-slate-500 dark:text-slate-400">
      Questions, feedback, or bug reports — send them here.
    </p>

    {#if data.sent}
      <div class="mt-10 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-6 py-8 text-center">
        <p class="text-lg font-semibold text-green-800 dark:text-green-300">Message sent</p>
        <p class="mt-1 text-sm text-green-700 dark:text-green-400">Thanks for reaching out. I'll get back to you soon.</p>
        <a
          href="/"
          class="mt-6 inline-block text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
        >
          Back to home
        </a>
      </div>
    {:else}
      <div class="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card p-6 sm:p-8">
        {#if form?.error}
          <div class="mb-5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {form.error}
          </div>
        {/if}

        <form
          method="POST"
          use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
              await update();
              submitting = false;
            };
          }}
          class="space-y-5"
        >
          <!-- Honeypot -->
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true" />

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Name <span class="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autocomplete="name"
              class="
                w-full rounded-lg border border-slate-200 dark:border-slate-600
                bg-white dark:bg-slate-900/50
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                px-3 py-2.5 text-base
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                transition-colors
              "
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              class="
                w-full rounded-lg border border-slate-200 dark:border-slate-600
                bg-white dark:bg-slate-900/50
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                px-3 py-2.5 text-base
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                transition-colors
              "
            />
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              required
              class="
                w-full rounded-lg border border-slate-200 dark:border-slate-600
                bg-white dark:bg-slate-900/50
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                px-3 py-2.5 text-base
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                transition-colors
              "
            />
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="6"
              class="
                w-full rounded-lg border border-slate-200 dark:border-slate-600
                bg-white dark:bg-slate-900/50
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                px-3 py-2.5 text-base
                focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                resize-y min-h-[140px]
                transition-colors
              "
            ></textarea>
          </div>

          <div class="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              class="
                inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                text-sm font-medium transition-all
                {submitting
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent-warm'}
              "
            >
              {#if submitting}
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              {:else}
                Send message
              {/if}
            </button>
          </div>
        </form>
      </div>
    {/if}
  </Container>
</div>
