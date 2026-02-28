/**
 * EXPERIENTIAL PRELOADER SCRIPT (Phase 14)
 * Simulates a complex asset loading sequence with a massive typography counter,
 * then reveals the page using a smooth GSAP clip-path wipe.
 */
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.org-preloader');
    const percentEl = document.querySelector('.org-preloader__percent');

    if (!preloader || !percentEl) return;

    // We disable Lenis scrolling while preloader is active to prevent cheating
    const tempDisableScroll = (e) => e.preventDefault();
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', tempDisableScroll, { passive: false });
    window.addEventListener('touchmove', tempDisableScroll, { passive: false });

    let progress = { val: 0 };

    gsap.to(progress, {
        val: 100,
        duration: 2.5, // The fake "loading" time
        ease: "power2.inOut",
        onUpdate: () => {
            percentEl.textContent = Math.floor(progress.val) + '%';
        },
        onComplete: () => {
            // Unbind scroll restraints
            document.body.style.overflow = '';
            window.removeEventListener('wheel', tempDisableScroll);
            window.removeEventListener('touchmove', tempDisableScroll);

            // The 'Wow' reveal animation
            gsap.to(preloader, {
                // Wipe up animation using clip-path
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1.2,
                ease: "power4.inOut",
                onComplete: () => {
                    preloader.remove(); // Delete from DOM to save memory

                    // Trigger an event so emotions.js knows it's safe to start its staggered entrance animations
                    window.dispatchEvent(new Event('preloaderComplete'));
                }
            });
        }
    });
});
