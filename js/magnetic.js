/**
 * MAGNETIC UI SCRIPT
 * Creates a physical attraction effect between elements and the mouse cursor.
 */
document.addEventListener('DOMContentLoaded', () => {
    // We attach this effect to any element with the data-magnetic attribute
    const magnetics = document.querySelectorAll('[data-magnetic]');

    magnetics.forEach((element) => {
        // Create QuickTo instances for blazing fast performance (better than normal gsap.to for mousemove)
        const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });

        element.addEventListener('mousemove', (e) => {
            const bound = element.getBoundingClientRect();
            // Calculate distance from center of element to mouse
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;

            // Intensity of the magnetic pull
            const intensity = element.getAttribute('data-intensity') || 0.4;

            xTo(x * intensity);
            yTo(y * intensity);
        });

        element.addEventListener('mouseleave', () => {
            // Snap back to center
            xTo(0);
            yTo(0);
        });
    });
});
