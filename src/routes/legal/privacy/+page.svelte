<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
</script>

<svelte:head>
  <title>Privacy Policy | SaltGoat</title>
  <meta name="description" content="SaltGoat Privacy Policy - How we collect, use, and protect your data." />
</svelte:head>

<Container class="py-12 sm:py-20">
  <div class="mx-auto max-w-3xl">
    <h1 class="heading-page text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: March 7, 2026</p>

    <div class="prose prose-slate dark:prose-invert max-w-none space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">We collect the following information:</p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong class="text-slate-700 dark:text-slate-300">Account information:</strong> email address, display name, and password (hashed)</li>
          <li><strong class="text-slate-700 dark:text-slate-300">Profile information:</strong> bio, location, social links, profile photos (voluntarily provided)</li>
          <li><strong class="text-slate-700 dark:text-slate-300">Activity data:</strong> summit logs, reviews, trail reports, photos you upload</li>
          <li><strong class="text-slate-700 dark:text-slate-300">Analytics:</strong> anonymous, aggregate usage data (page views, feature usage) with no personal identifiers</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
          <li>To provide and improve the Service</li>
          <li>To display your profile and activity to other users (based on your privacy settings)</li>
          <li>To calculate leaderboard rankings and achievement progress</li>
          <li>To send essential account-related communications (password resets, security alerts)</li>
          <li>To understand aggregate usage patterns and improve the platform</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Data Sharing</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          We do not sell your personal data. We do not share your data with third parties except:
        </p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
          <li>When required by law or legal process</li>
          <li>With service providers who help us operate the platform (hosting, authentication) under strict data processing agreements</li>
          <li>Public profile information and activity that you choose to make visible</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Data Storage & Security</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          Your data is stored securely using Supabase (hosted on AWS). We use row-level security policies to ensure users can only access and modify their own data. All data is transmitted over HTTPS. Passwords are hashed and never stored in plaintext.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Your Rights</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">You have the right to:</p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
          <li>Access your personal data</li>
          <li>Update or correct your information via your profile settings</li>
          <li>Delete your account and associated data by contacting us</li>
          <li>Control your profile visibility (public/private) via privacy settings</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">6. Cookies</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          We use essential cookies for authentication and session management. We use privacy-respecting analytics that do not use cookies or track individual users. We do not use advertising cookies or tracking pixels.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">7. Third-Party Services</h2>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong class="text-slate-700 dark:text-slate-300">Supabase:</strong> database and authentication (<a href="https://supabase.com/privacy" class="text-accent hover:text-accent-warm transition-colors" target="_blank" rel="noopener noreferrer">privacy policy</a>)</li>
          <li><strong class="text-slate-700 dark:text-slate-300">Google OAuth:</strong> optional sign-in method (<a href="https://policies.google.com/privacy" class="text-accent hover:text-accent-warm transition-colors" target="_blank" rel="noopener noreferrer">privacy policy</a>)</li>
          <li><strong class="text-slate-700 dark:text-slate-300">Open-Meteo:</strong> weather data (no personal data shared)</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">8. Children's Privacy</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          SaltGoat is not directed at children under 13. We do not knowingly collect personal data from children under 13. If we become aware of such data, we will delete it promptly.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">9. Changes to This Policy</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          We may update this privacy policy from time to time. We will notify users of material changes via the Service. Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">10. Contact</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          Privacy questions? Contact us at <a href="mailto:hello@saltgoat.co" class="text-accent hover:text-accent-warm transition-colors">hello@saltgoat.co</a>.
        </p>
      </section>
    </div>
  </div>
</Container>
