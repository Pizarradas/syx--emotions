document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lenis for Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 0);


  // Initialize GSAP & ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Mobile Header Toggle Logic
  const menuToggle = document.querySelector('.org-site-header__menu-toggle');
  const siteNav = document.querySelector('.org-site-header__nav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('is-active');
      if (isOpen) {
        menuToggle.classList.remove('is-active');
        siteNav.classList.remove('is-open');
        lenis.start(); // Re-enable scroll
      } else {
        menuToggle.classList.add('is-active');
        siteNav.classList.add('is-open');
        lenis.stop(); // Disable scroll while menu is open
      }
    });

    // Close menu when a link is clicked
    const navLinks = siteNav.querySelectorAll('.org-site-header__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        siteNav.classList.remove('is-open');
        lenis.start();
      });
    });
  }

  // Hide header on scroll down, show on scroll up (Desktop mainly)
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.org-site-header');
  lenis.on('scroll', (e) => {
    if (window.innerWidth >= 1024 && header) {
      if (e.animatedScroll > lastScrollY && e.animatedScroll > 100) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastScrollY = e.animatedScroll;
    }
  });


  const switchers = document.querySelectorAll('.molecule-emotion-switcher__btn');
  const htmlEl = document.documentElement;
  // Marquee Infinite Loop Logic
  const marqueeText = document.querySelectorAll('.org-marquee__text');
  if (marqueeText.length > 0) {
    gsap.to(marqueeText, {
      xPercent: -100,
      repeat: -1,
      duration: 10,
      ease: "linear"
    }).totalProgress(0.5); // Start halfway through
  }

  // Stats Counter Logic
  const statNumbers = document.querySelectorAll('.org-stats__number');
  statNumbers.forEach(stat => {
    let target = stat.getAttribute('data-target');
    let suffix = stat.getAttribute('data-suffix') || '';

    // Create a proxy object to animate the number
    let cont = { val: 0 };

    const trigger = gsap.to(cont, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        stat.innerHTML = Math.round(cont.val) + suffix;
      },
      scrollTrigger: {
        trigger: stat,
        start: "top 85%", // Start when stats are in view
        toggleActions: "play none none reverse"
      }
    });
  });

  // We store all our active custom block scroll triggers to manage state
  let currentScrollTriggers = [];

  // Init Theme Flow
  function initTheme(initialTheme) {
    // If there's a preloader, we wait for it to finish before animating in
    const preloader = document.querySelector('.org-preloader');
    if (preloader) {
      window.addEventListener('preloaderComplete', () => {
        playTransitionAnimation(initialTheme);
        createScrollAnimations(initialTheme);
      });
    } else {
      playTransitionAnimation(initialTheme);
      createScrollAnimations(initialTheme);
    }

    // Phase 14: Mood-aware Newsletter Copy
    updateNewsletterCopy(initialTheme);
  }

  // Phase 14: Mood-aware Newsletter logic
  function updateNewsletterCopy(theme) {
    const newsletterTitle = document.querySelector('.org-newsletter__title');
    const newsletterDesc = document.querySelector('.org-newsletter__desc');
    const newsletterBtn = document.querySelector('.org-newsletter__btn');

    if (!newsletterTitle || !newsletterDesc || !newsletterBtn) return;

    switch (theme) {
      case 'joy':
        newsletterTitle.textContent = "Keep Smiling!";
        newsletterDesc.textContent = "Subscribe to our weekly dose of good news and positive vibes. No doomscrolling allowed.";
        newsletterBtn.textContent = "Send me joy";
        break;
      case 'sadness':
        newsletterTitle.textContent = "We feel you.";
        newsletterDesc.textContent = "Join our community. Sometimes a quiet read is all you need on a rainy day.";
        newsletterBtn.textContent = "Subscribe quietly";
        break;
      case 'anger':
        newsletterTitle.textContent = "Tired of the BS?";
        newsletterDesc.textContent = "Get the raw, unfiltered truth delivered straight to your inbox. No fluff.";
        newsletterBtn.textContent = "Demand the truth";
        break;
      case 'fear':
        newsletterTitle.textContent = "Stay Alert.";
        newsletterDesc.textContent = "The world is changing fast. Subscribe to survive the information overload.";
        newsletterBtn.textContent = "Trust no one";
        break;
      case 'disgust':
        newsletterTitle.textContent = "Fed up?";
        newsletterDesc.textContent = "We digest the gross reality of the world so you don't have to.";
        newsletterBtn.textContent = "Cleanse my feed";
        break;
      case 'surprise':
        newsletterTitle.textContent = "Expect the Unexpected";
        newsletterDesc.textContent = "Sign up and we might just blow your mind every Tuesday.";
        newsletterBtn.textContent = "Surprise me";
        break;
      default:
        newsletterTitle.textContent = "Stay Informed";
        newsletterDesc.textContent = "Subscribe to our daily briefing and never miss a crucial headline again.";
        newsletterBtn.textContent = "Subscribe Now";
    }
  }

  // Handle Switcher Clicks
  switchers.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active UI state
      switchers.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const newTheme = btn.getAttribute('data-emotion');

      // Phase 19: Persist chosen theme to localStorage
      localStorage.setItem('syx-theme', newTheme);

      // Dispatch event for other scripts (like glow-tracker.js) to react to
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));

      // Swap Theme at root Level
      htmlEl.setAttribute('data-theme', newTheme);

      // Tell Three.js (WebGL bg) to alter geometry and colors
      if (window.ThemeScene) {
        window.ThemeScene.changeEmotion(newTheme);
      }

      // Play immediate transition anim
      playTransitionAnimation(newTheme);

      // Rebuild ScrollTriggers for the new emotional context
      createScrollAnimations(newTheme);
    });
  });

  // Global Immediate Transition Animation
  function playTransitionAnimation(theme) {
    const mainGridCards = document.querySelectorAll('.molecule-news-card');
    const heroContent = document.querySelector('.org-news-hero__content');
    const articleContent = document.querySelector('.org-article-content__container');

    // Default GSAP values
    let easeType = "power2.out";
    let staggerTime = 0.1;
    let yOffset = 20;
    let scaleStart = 0.95;
    let rotationStart = 0;

    // Emotion specific animation adjustments for the load/transition
    switch (theme) {
      case 'joy':
        easeType = "back.out(1.7)"; // Bouncy
        yOffset = 40;
        scaleStart = 0.8;
        break;
      case 'sadness':
        easeType = "power4.inOut"; // Slow, dramatic
        staggerTime = 0.3;
        yOffset = 10;
        break;
      case 'anger':
        easeType = "rough({ strength: 1, points: 20, template: linear, taper: none, randomize: true, clamp: false})"; // Shaky
        yOffset = 0;
        scaleStart = 1.05;
        rotationStart = (Math.random() - 0.5) * 5; // Slight erratic rotation
        break;
      case 'fear':
        easeType = "steps(3)"; // Stuttering, unnatural
        yOffset = -20;
        break;
      case 'surprise':
        easeType = "elastic.out(1, 0.3)"; // Snap and vibrate
        scaleStart = 0.5;
        yOffset = 60;
        staggerTime = 0.05;
        break;
      case 'disgust':
        easeType = "slow(0.7, 0.7, false)"; // Sluggish, uncomfortable
        yOffset = 15;
        rotationStart = -2;
        break;
    }

    // Kill concurrent tweens to prevent weird overlapping states
    gsap.killTweensOf([mainGridCards, heroContent, articleContent]);

    if (heroContent) {
      gsap.fromTo(heroContent,
        { opacity: 0, y: yOffset, scale: scaleStart, rotation: rotationStart },
        { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1, ease: easeType }
      );
    }

    if (articleContent) {
      gsap.fromTo(articleContent,
        { opacity: 0, y: yOffset },
        { opacity: 1, y: 0, duration: 1.2, ease: easeType }
      );
    }

    if (mainGridCards.length > 0) {
      gsap.fromTo(mainGridCards,
        { opacity: 0, y: yOffset, scale: scaleStart, rotation: rotationStart },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: staggerTime,
          ease: easeType
        }
      );
    }
  }

  // Scroll Animations based on Active Emotion
  function createScrollAnimations(theme) {
    // 1. Clean up old ScrollTriggers
    currentScrollTriggers.forEach(trigger => trigger.kill());
    currentScrollTriggers = [];

    // 2. Setup the new emotional rules
    const cards = document.querySelectorAll('.molecule-news-card');
    const paragraphs = document.querySelectorAll('.org-article-content__container p, .org-article-content__container h2');

    // Setup logic variables
    let yStart = 50;
    let opacityStart = 0;
    let scaleStart = 0.9;
    let rotationStart = 0;
    let easeType = "power2.out";
    let scrubValue = false; // By default no scrub

    switch (theme) {
      case 'joy':
        // Happy, floaty, bouncy elements popping up
        yStart = 100;
        scaleStart = 0.5;
        easeType = "back.out(1.5)";
        break;
      case 'sadness':
        // Melancholic, elements fade in incredibly slowly, almost dragging 
        yStart = 20;
        scaleStart = 1;
        easeType = "power1.inOut";
        scrubValue = 1; // Scrubs lazily to mouse scroll
        break;
      case 'anger':
        // Aggressive, elements slam into place from odd angles
        yStart = 0;
        scaleStart = 1.2;
        rotationStart = 5; // Slant
        easeType = "power4.out";
        scrubValue = false;
        break;
      case 'fear':
        // Paralyzing, creeps out of the shadows with a ghostly blur
        yStart = -30; // Drops down from above slowly
        scaleStart = 1;
        easeType = "steps(5)"; // Stuttering appearance
        break;
      case 'surprise':
        // Electric, elements snap into place instantly
        yStart = 200;
        scaleStart = 0.1;
        easeType = "elastic.out(1, 0.3)";
        break;
      case 'disgust':
        // Muddy, elements slide in slowly and uncomfortably from the side
        yStart = 0;
        scaleStart = 0.9;
        rotationStart = -3;
        easeType = "power1.in";
        scrubValue = 0.5;
        break;
    }

    // Apply ScrollTriggers to Home Cards
    cards.forEach((card, index) => {
      // Disgust comes from the side alternatively
      let extraX = 0;
      if (theme === 'disgust') extraX = index % 2 === 0 ? 50 : -50;
      if (theme === 'fear') opacityStart = 0.2; // Doesn't fully disappear
      else opacityStart = 0;

      const trigger = gsap.fromTo(card,
        {
          opacity: opacityStart,
          y: yStart,
          x: extraX,
          scale: scaleStart,
          rotation: rotationStart
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          ease: easeType,
          duration: theme === 'surprise' ? 1.5 : 1, // Surprise needs longer to snap
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Trigger when top of card hits 85% of viewport
            toggleActions: scrubValue ? "play none none reverse" : "play none none reverse", // Play going down, reverse going up (if not rubbing)
            scrub: scrubValue
          }
        }
      );
      currentScrollTriggers.push(trigger.scrollTrigger);

      // Clip Path Image Reveal for the Wow factor
      const img = card.querySelector('.molecule-news-card__img');
      if (img) {
        let clipStart = "inset(0 0 100% 0)"; // Default: wipe from top
        if (theme === 'joy') clipStart = "circle(0% at 50% 50%)"; // Expand from center
        if (theme === 'anger') clipStart = "polygon(0 0, 0 100%, 0 100%, 0 0)"; // Hard wipe left to right
        if (theme === 'surprise') clipStart = "inset(0 50% 0 50%)"; // Wipe from center horizontally

        const imgTrigger = gsap.fromTo(img,
          { clipPath: clipStart },
          {
            clipPath: theme === 'joy' ? "circle(150% at 50% 50%)" : "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: scrubValue ? "play none none reverse" : "play none none reverse",
              scrub: scrubValue
            }
          }
        );
        // Anger exception for polygon end state
        if (theme === 'anger') {
          gsap.to(img, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 85%", scrub: scrubValue }
          });
        }

        if (theme !== 'anger') currentScrollTriggers.push(imgTrigger.scrollTrigger);
      }
    });

    // Bento Grid Cell Stagger Reveal
    const bentoCells = document.querySelectorAll('.org-bento-grid__cell');
    if (bentoCells.length > 0) {
      const bentoTrigger = gsap.fromTo(bentoCells,
        {
          y: yStart * 2,
          opacity: 0,
          scale: scaleStart
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: easeType,
          stagger: 0.2, // Waterfall effect
          scrollTrigger: {
            trigger: '.org-bento-grid',
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
      currentScrollTriggers.push(bentoTrigger.scrollTrigger);
    }

    // Sticky Horizontal Scroll Section
    const stickySection = document.querySelector('.org-sticky-scroll');
    const stickyWrapper = document.querySelector('.org-sticky-scroll__wrapper');
    if (stickySection && stickyWrapper) {
      const getScrollAmount = () => -(stickyWrapper.scrollWidth - window.innerWidth);

      const tween = gsap.to(stickyWrapper, {
        x: getScrollAmount,
        ease: "none"
      });

      const stickyTrigger = ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1, // Smooth scrubbing
        invalidateOnRefresh: true
      });
      currentScrollTriggers.push(stickyTrigger);
    }

    // Parallax Gallery Reveal & data-speed logic
    const parallaxItems = document.querySelectorAll('.org-parallax-gallery__item');
    if (parallaxItems.length > 0) {
      // 1. Initial fade-up reveal for the gallery container
      const galleryReveal = gsap.from(parallaxItems, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.org-parallax-gallery',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      currentScrollTriggers.push(galleryReveal.scrollTrigger);

      // 2. Continuous parallax scrolling using data-speed attribute
      parallaxItems.forEach(item => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 1;
        // The slower the speed, the less it moves from its original position compared to the scroll
        // The faster the speed, the more y distance it covers.
        const yMovement = (1 - speed) * 300;

        const pxTween = gsap.to(item, {
          y: yMovement,
          ease: "none",
          scrollTrigger: {
            trigger: '.org-parallax-gallery',
            start: "top bottom", // Start as soon as gallery parent enters screen
            end: "bottom top",
            scrub: true
          }
        });
        currentScrollTriggers.push(pxTween.scrollTrigger);
      });
    }

    // Global Scroll Tied to Three.js Position (3D Parallax)
    // We attach a master scroll trigger to the body to move the 3D scene up and down or rotate it
    if (window.ThemeScene && window.ThemeScene.mesh) {
      const threeParallaxTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          // self.progress goes from 0 to 1
          // We move the mesh slightly up as we scroll down
          gsap.to(window.ThemeScene.mesh.position, {
            y: self.progress * 5, // Move up 5 units
            duration: 0.2,
            ease: "power1.out"
          });
          // Add extra rotation based on scroll speed
          if (Math.abs(self.getVelocity()) > 100) {
            window.ThemeScene.mesh.rotation.x += self.direction * 0.05;
          }
        }
      });
      currentScrollTriggers.push(threeParallaxTrigger);
    }

    // Article Reading Progress Ring (Awwwards Trend)
    const progressRing = document.querySelector('.org-progress-ring__circle-progress');
    const progressText = document.querySelector('.org-progress-ring__percent');

    if (progressRing && progressText) {
      // Create tween object to track progress
      const progressTracker = { val: 0 };

      const ringTrigger = gsap.to(progressTracker, {
        val: 100,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, // very tight scrub for exact progress
          onUpdate: (self) => {
            // stroke-dasharray is 100, so 100 offset is empty, 0 offset is full
            const offset = 100 - (self.progress * 100);
            progressRing.style.strokeDashoffset = offset;
            progressText.textContent = `${Math.round(self.progress * 100)}%`;
          }
        }
      });
      currentScrollTriggers.push(ringTrigger.scrollTrigger);
    }

    // Phase 18: Marquee Infinite Scroll & Acceleration
    const marqueeTrack = document.querySelector('.org-marquee__track');
    if (marqueeTrack) {
      // Since we duplicated content 4x, moving to -50% ensures a seamless loop 
      const marqueeTween = gsap.to(marqueeTrack, {
        xPercent: -50,
        ease: "none",
        duration: 20, // Base speed
        repeat: -1
      });

      const marqueeSpeedTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Accelerate when scrolling fast
          gsap.to(marqueeTween, { timeScale: 1 + Math.abs(self.getVelocity() / 100), duration: 0.1 });
        }
      });
      currentScrollTriggers.push(marqueeSpeedTrigger);
    }

    // Phase 18: GSAP Scrubbed Text Reveal
    const textRevealContainers = document.querySelectorAll('.org-text-reveal');
    textRevealContainers.forEach(container => {
      const words = container.querySelectorAll('.word');
      if (words.length) {
        const trigger = gsap.to(words, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1
          }
        });
        currentScrollTriggers.push(trigger.scrollTrigger);
      }
    });

    // Phase 23: The Masonry Maze (Infinite Vertical Columns)
    const masonrySection = document.querySelector('.org-masonry-grid');
    if (masonrySection) {
      const columns = masonrySection.querySelectorAll('.org-masonry-column');

      // Store the active infinite tweens to pause them on hover
      let mazeTweens = [];

      columns.forEach(col => {
        const track = col.querySelector('.js-masonry-track');
        if (!track) return;

        // Clone contents for seamless looping
        const content = track.innerHTML;
        track.innerHTML = content + content;

        const direction = col.getAttribute('data-direction'); // "up" or "down"
        const duration = parseFloat(col.getAttribute('data-duration')) || 30;

        // The track height is now exactly double from cloning. 
        // We move it from 0 to -50% to seamlessly loop back to 0.
        let fromY = direction === "up" ? 0 : -50;
        let toY = direction === "up" ? -50 : 0;

        const tween = gsap.fromTo(track,
          { yPercent: fromY },
          {
            yPercent: toY,
            ease: "none",
            duration: duration,
            repeat: -1
          }
        );
        mazeTweens.push(tween);
      });

      // Pause the entire maze on hover to allow the user to read/interact
      masonrySection.addEventListener('mouseenter', () => {
        mazeTweens.forEach(t => t.pause());
      });

      masonrySection.addEventListener('mouseleave', () => {
        mazeTweens.forEach(t => t.play());
      });
    }

    // Phase 18: GSAP Counter Stats
    const statsSection = document.querySelector('.org-stats');
    if (statsSection) {
      const counters = statsSection.querySelectorAll('.js-counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const obj = { val: 0 };

        const trigger = gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsSection,
            start: "top 80%",
            once: true // Only count up once when scrolled into view
          },
          onUpdate: () => {
            // Update text, adding commas or suffixes if needed, though here just simple rounded integers
            counter.innerText = Math.floor(obj.val);
          }
        });
        currentScrollTriggers.push(trigger.scrollTrigger);
      });
    }

    // Phase 20: Universal Parallax Engine
    const parallaxElements = document.querySelectorAll('[data-speed]');
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed'));
      if (isNaN(speed)) return;

      const yOffset = (1 - speed) * 100;

      const trigger = gsap.fromTo(el,
        { yPercent: -yOffset },
        {
          yPercent: yOffset,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement, // Trigger based on parent bounds
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
      currentScrollTriggers.push(trigger.scrollTrigger);
    });

    // Phase 22: Typography Divider Scale Effect
    const typeDividerScalingText = document.querySelectorAll('.js-scale-text');
    typeDividerScalingText.forEach(textEl => {
      const trigger = gsap.fromTo(textEl,
        { scale: 0.8, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: textEl.parentElement,
            start: "top bottom",
            end: "center center",
            scrub: true
          }
        }
      );
      currentScrollTriggers.push(trigger.scrollTrigger);
    });

    // Apply ScrollTriggers to Article Paragraphs & Old Home Modules
    const otherElements = document.querySelectorAll(
      '.org-article-content__container p, .org-article-content__container h2, .org-featured-quote, .org-newsletter'
    );

    otherElements.forEach((el, index) => {
      let extraX = 0;
      if (theme === 'disgust') extraX = index % 2 === 0 ? 20 : -20;
      if (theme === 'anger') extraX = (Math.random() - 0.5) * 40; // Erratic horizontal jumps

      const trigger = gsap.fromTo(el,
        {
          opacity: 0,
          y: yStart / 2, // Less movement for general blocks
          x: extraX, // Angry texts come in from side
          scale: 1, // Don't scale text usually
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          ease: easeType,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            scrub: scrubValue
          }
        }
      );
      currentScrollTriggers.push(trigger.scrollTrigger);
    });
  }

  // Phase 18: DOM Setup for new tech portal features (run once)
  // Marquee string cloning for seamless infinite scroll
  const marqueeContent = document.querySelector('.org-marquee__content');
  if (marqueeContent) {
    const contentHtml = marqueeContent.innerHTML;
    marqueeContent.innerHTML = contentHtml + contentHtml + contentHtml + contentHtml;
  }

  // Text Reveal string splitting into DOM nodes
  const revealTexts = document.querySelectorAll('.js-reveal-text');
  revealTexts.forEach(textEl => {
    const words = textEl.innerText.split(' '); // simple space split
    textEl.innerHTML = '';
    words.forEach(word => {
      const span = document.createElement('span');
      span.className = 'word';
      span.innerText = word + ' ';
      textEl.appendChild(span);
    });
  });

  // Phase 18: Hover Image Gallery Logic
  const hoverGallery = document.querySelector('.org-hover-gallery');
  if (hoverGallery) {
    const images = hoverGallery.querySelectorAll('.js-hover-img');
    const items = hoverGallery.querySelectorAll('.org-hover-gallery__item');

    // QuickTo setters for smooth, performant cursor tracking
    const xSet = gsap.quickTo(images, "x", { duration: 0.6, ease: "power3", xPercent: -50 });
    const ySet = gsap.quickTo(images, "y", { duration: 0.6, ease: "power3", yPercent: -50 });

    // Listen to mouse move on the whole gallery section
    hoverGallery.addEventListener("mousemove", (e) => {
      const rect = hoverGallery.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      xSet(relX);
      ySet(relY);
    });

    // Bind each list item to an image index
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        images.forEach((img, i) => {
          if (i === index) img.classList.add('is-active');
          else img.classList.remove('is-active');
        });
      });

      item.addEventListener('mouseleave', () => {
        if (images[index]) images[index].classList.remove('is-active');
      });
    });
  }

  // Phase 19: Restore theme from localStorage or fallback to HTML default / 'joy'
  const savedTheme = localStorage.getItem('syx-theme') || htmlEl.getAttribute('data-theme') || 'joy';

  // Set root attribute and update UI toggles to match saved state
  htmlEl.setAttribute('data-theme', savedTheme);
  switchers.forEach(b => b.classList.remove('is-active'));
  const activeSwitcher = document.querySelector(`[data-emotion="${savedTheme}"]`);
  if (activeSwitcher) activeSwitcher.classList.add('is-active');

  // Trigger initial flow on load based on current theme
  initTheme(savedTheme);

  // Phase 14: Article Zen Mode Toggle
  const zenToggle = document.querySelector('.org-zen-toggle');
  if (zenToggle) {
    zenToggle.addEventListener('click', () => {
      document.body.classList.toggle('is-zen-mode');
      if (document.body.classList.contains('is-zen-mode')) {
        zenToggle.textContent = "Exit Zen Mode";
      } else {
        zenToggle.textContent = "Zen Mode";
      }
    });
  }

  // Phase 14: Easter Egg "SYX" Chaos Mode
  let keySequence = [];
  const secretCode = ['s', 'y', 'x'];
  let chaosInterval = null;

  window.addEventListener('keydown', (e) => {
    keySequence.push(e.key.toLowerCase());

    // Keep array at max length 3
    if (keySequence.length > secretCode.length) {
      keySequence.shift();
    }

    if (JSON.stringify(keySequence) === JSON.stringify(secretCode)) {
      triggerChaosMode();
    }
  });

  function triggerChaosMode() {
    if (chaosInterval) return; // already active

    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust'];

    // Glitch the screen really fast for 3 seconds
    chaosInterval = setInterval(() => {
      const randomTheme = emotions[Math.floor(Math.random() * emotions.length)];
      htmlEl.setAttribute('data-theme', randomTheme);
      if (window.ThemeScene) window.ThemeScene.changeEmotion(randomTheme);
    }, 150); // Swap every 150ms

    // Stop after 3 seconds and return to Joy
    setTimeout(() => {
      clearInterval(chaosInterval);
      chaosInterval = null;
      htmlEl.setAttribute('data-theme', 'joy');
      if (window.ThemeScene) window.ThemeScene.changeEmotion('joy');
      initTheme('joy');

      // Clean up active states on switcher
      switchers.forEach(b => b.classList.remove('is-active'));
      const defaultJoy = document.querySelector('[data-emotion="joy"]');
      if (defaultJoy) defaultJoy.classList.add('is-active');
    }, 3000);
  }

});
