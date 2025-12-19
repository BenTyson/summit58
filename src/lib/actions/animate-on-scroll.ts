/**
 * Svelte action for scroll-triggered animations
 * Uses IntersectionObserver to detect when elements enter viewport
 */

interface AnimateOnScrollOptions {
  animation?: string;
  threshold?: number;
  once?: boolean;
}

export function animateOnScroll(
  node: HTMLElement,
  options: AnimateOnScrollOptions = {}
) {
  const { animation = 'animate-fade-in-up', threshold = 0.1, once = true } = options;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation for users who prefer reduced motion
    node.classList.remove('will-animate');
    return {
      destroy() {}
    };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.remove('will-animate');
          node.classList.add(animation);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          node.classList.remove(animation);
          node.classList.add('will-animate');
        }
      });
    },
    { threshold }
  );

  // Set initial state
  node.classList.add('will-animate');
  observer.observe(node);

  return {
    update(newOptions: AnimateOnScrollOptions) {
      // Handle options updates if needed
      if (newOptions.animation && newOptions.animation !== animation) {
        node.classList.remove(animation);
        if (!node.classList.contains('will-animate')) {
          node.classList.add(newOptions.animation);
        }
      }
    },
    destroy() {
      observer.disconnect();
    }
  };
}
