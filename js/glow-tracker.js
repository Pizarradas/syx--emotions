/**
 * GLOW TRACKER SCRIPT (Awwwards 2025 Trend)
 * Follows the mouse with an ambient radial gradient, but uses pointer-events: none
 * so it never blocks native UI clicks or interactions.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Create the Glow Element dynamically
    const glow = document.createElement('div');
    glow.classList.add('ambient-cursor-glow');
    document.body.appendChild(glow);

    // Dynamic styles for the glow
    // We use a CSS class so that it can be themed via SCSS if needed, 
    // but the core mechanics are set here to guarantee it works flawlessly.
    Object.assign(glow.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        pointerEvents: 'none', // CRITICAL: Allows clicks to pass through
        zIndex: '9998', // Just below the fixed Header and Progress Ring
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen', // Adds light to the page
        opacity: '0', // Start hidden
        transition: 'opacity 0.6s ease',
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)'
    });

    // Handle mouse movement with GSAP QuickTo for 60fps performance
    // Move the div to center exactly on the cursor
    const xTo = gsap.quickTo(glow, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.1, ease: "power3" });

    let isMouseInWindow = false;

    document.addEventListener('mousemove', (e) => {
        if (!isMouseInWindow) {
            glow.style.opacity = '1';
            isMouseInWindow = true;
        }
        xTo(e.clientX);
        yTo(e.clientY);
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        isMouseInWindow = false;
    });

    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
        isMouseInWindow = true;
    });

    // Connect the glow color/blend mode to the active Theme
    // We listen for the custom theme change event we'll dispatch in emotions.js
    window.addEventListener('themeChanged', (e) => {
        const theme = e.detail.theme;

        switch (theme) {
            case 'joy':
                glow.style.background = 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0) 70%)';
                glow.style.mixBlendMode = 'screen';
                glow.style.width = '600px';
                glow.style.height = '600px';
                break;
            case 'sadness':
                glow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 80%)';
                glow.style.mixBlendMode = 'screen';
                glow.style.width = '500px';
                glow.style.height = '500px';
                break;
            case 'anger':
                glow.style.background = 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, rgba(220, 38, 38, 0) 60%)';
                glow.style.mixBlendMode = 'multiply'; // Makes things darker/redder
                glow.style.width = '300px';
                glow.style.height = '300px';
                break;
            case 'fear':
                glow.style.background = 'radial-gradient(circle, rgba(0,0,0, 0.9) 0%, rgba(0,0,0,0) 80%)';
                glow.style.mixBlendMode = 'normal'; // Creates a dark vignette around the mouse
                glow.style.width = '350px';
                glow.style.height = '350px';
                break;
            case 'surprise':
                glow.style.background = 'radial-gradient(circle, rgba(217, 70, 239, 0.3) 0%, rgba(217, 70, 239, 0) 70%)';
                glow.style.mixBlendMode = 'screen';
                glow.style.width = '400px';
                glow.style.height = '400px';
                break;
            case 'disgust':
                glow.style.background = 'radial-gradient(circle, rgba(163, 230, 53, 0.2) 0%, rgba(163, 230, 53, 0) 70%)';
                glow.style.mixBlendMode = 'screen';
                glow.style.width = '400px';
                glow.style.height = '400px';
                break;
            default:
                glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)';
                glow.style.mixBlendMode = 'screen';
                break;
        }
    });

});
