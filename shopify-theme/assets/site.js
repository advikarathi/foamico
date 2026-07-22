/* FOAMICO — global site chrome: nav, modals, chat widget, newsletter, reveal-on-scroll.
   Loaded on every template via layout/theme.liquid. Ported from the static site's
   shared inline <script> block, with the chat widget's hardcoded page links swapped
   for real Shopify routes via window.FoamicoRoutes (set inline in theme.liquid). */
(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-header-nav]');
    if (!toggle || !nav) return;

    var mobileQuery = window.matchMedia('(max-width:900px)');
    var hasDrop = nav.querySelector('[data-has-drop]');
    var dropLink = hasDrop ? hasDrop.querySelector(':scope > a') : null;

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        if (hasDrop) hasDrop.classList.remove('is-open');
    }

    function openMenu() {
        nav.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) closeMenu();
        else openMenu();
    });

    // "Products" has its own dropdown of real links; on mobile there's no
    // hover, so the first tap expands the submenu instead of navigating.
    if (dropLink) {
        dropLink.addEventListener('click', function (e) {
            if (!mobileQuery.matches) return;
            e.preventDefault();
            hasDrop.classList.toggle('is-open');
        });
    }

    nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && e.target !== dropLink) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
    });

    document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-open') && e.composedPath().indexOf(nav) === -1 && e.composedPath().indexOf(toggle) === -1) {
            closeMenu();
        }
    });

    mobileQuery.addEventListener('change', function (e) {
        if (!e.matches) closeMenu();
    });
})();

(function () {
    var overlay = document.querySelector('[data-form-modal-overlay]');
    if (!overlay) return;
    var iframe = overlay.querySelector('[data-form-modal-iframe]');
    var titleEl = overlay.querySelector('[data-form-modal-title]');
    var closeBtn = overlay.querySelector('[data-form-modal-close]');
    var triggers = document.querySelectorAll('[data-form-modal-trigger]');

    var openModal = function (url, title) {
        iframe.src = url;
        titleEl.textContent = title || 'Foamico';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    var closeModal = function () {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        iframe.src = '';
    };

    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(trigger.getAttribute('href'), trigger.getAttribute('data-form-title'));
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var videos = document.querySelectorAll('.product-video, .category-video, .hero-video, .motion-video');
    videos.forEach(function (v) {
        if (reduceMotion) {
            v.removeAttribute('autoplay');
            v.pause();
            v.currentTime = 0;
        }
    });
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !items.length) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    items.forEach(function (el) {
        observer.observe(el);
    });
})();

(function () {
    // Fade lazy images in once they've actually loaded instead of
    // letting them pop in abruptly mid-scroll.
    var images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(function (img) {
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('is-loaded');
            return;
        }
        img.addEventListener('load', function () {
            img.classList.add('is-loaded');
        }, { once: true });
    });
})();

(function () {
    var widget = document.querySelector('[data-chat-widget]');
    if (!widget) return;
    var toggle = widget.querySelector('[data-chat-toggle]');
    var closeBtn = widget.querySelector('[data-chat-close]');
    var body = widget.querySelector('[data-chat-body]');
    var routes = window.FoamicoRoutes || {};
    var waLink = 'https://wa.me/' + (routes.whatsapp || '917496982886') + '?text=Hi%20Foamico%2C%20I%27d%20like%20to%20know%20more';

    var optionSets = {
        followup: [{
            label: '⟵ Back to menu',
            next: 'main'
        }, {
            label: '💬 Talk to a human',
            next: 'human'
        }],
        followupWa: [{
            label: '⟵ Back to menu',
            next: 'main'
        }]
    };

    var nodes = {
        main: {
            bot: "Hi! I'm the Foamico Sleep Assistant. What can I help you with?",
            options: [{
                label: 'Which mattress is right for me?',
                next: 'fit'
            }, {
                label: 'Get a customised price quote',
                next: 'priceQuote'
            }, {
                label: "What's the warranty?",
                next: 'warranty'
            }, {
                label: 'Delivery & returns',
                next: 'delivery'
            }, {
                label: 'EMI & financing',
                next: 'financing'
            }, {
                label: 'Find a store',
                next: 'stores'
            }, {
                label: 'Talk to a human',
                next: 'human'
            }]
        },
        priceQuote: {
            bot: 'Sure — pick a model, size, and thickness below and I\'ll price it out for you instantly.',
            mount: function (el) {
                var host = document.createElement('div');
                el.appendChild(host);
                if (window.FoamicoPriceBot) window.FoamicoPriceBot.mount(host);
            },
            options: optionSets.followup
        },
        fit: {
            bot: 'Tell me a bit about how you sleep:',
            options: [{
                label: 'I sleep on my back',
                next: 'fitBack'
            }, {
                label: 'I sleep on my side',
                next: 'fitSide'
            }, {
                label: 'I have back pain',
                next: 'fitPain'
            }, {
                label: 'I want something plush',
                next: 'fitPlush'
            }, {
                label: '⟵ Back to menu',
                next: 'main'
            }]
        },
        fitBack: {
            bot: 'Sova is a great everyday pick for back sleepers, with balanced comfort. <a href="' + (routes.sova || '/products/sova-luxury-mattress') + '">View Sova</a>',
            options: optionSets.followup
        },
        fitSide: {
            bot: 'Luma is built for side sleepers who want a cooler night’s sleep. <a href="' + (routes.luma || '/products/luma-classic-mattress') + '">View Luma</a>',
            options: optionSets.followup
        },
        fitPain: {
            bot: 'Ultima gives targeted, supportive comfort and is our top pick for back pain relief. <a href="' + (routes.ultima || '/products/ultima-luxury-mattress') + '">View Ultima</a>',
            options: optionSets.followup
        },
        fitPlush: {
            bot: 'Riva is our plushest range with premium support — a cloud-like feel. <a href="' + (routes.riva || '/products/riva-1000-mattress') + '">View Riva</a>',
            options: optionSets.followup
        },
        warranty: {
            bot: 'Warranty varies by range: Sova — 15 years, Ultima — 25 years, Riva — 30 years. <a href="' + (routes.mattresses || '/pages/mattresses') + '#compare">See the full comparison</a>',
            options: optionSets.followup
        },
        delivery: {
            bot: 'We deliver across India through our network of 300+ stores. For exact delivery timelines and return details in your city, our team can help directly.',
            options: optionSets.followupWa,
            showWa: true
        },
        financing: {
            bot: 'We offer easy EMI options through our stores. Our team can share current plans and eligibility for your city.',
            options: optionSets.followupWa,
            showWa: true
        },
        stores: {
            bot: 'We have 300+ stores across 15 cities in India. <a href="' + (routes.root || '/') + '#stores">Find a store near you</a>',
            options: optionSets.followup
        },
        human: {
            bot: 'Sure — tap below to chat with our team on WhatsApp.',
            options: optionSets.followupWa,
            showWa: true
        }
    };

    function addMessage(text, from) {
        var el = document.createElement('div');
        el.className = 'chat-msg ' + from;
        el.innerHTML = text;
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
        return el;
    }

    function addWaButton() {
        var a = document.createElement('a');
        a.className = 'chat-wa-btn';
        a.href = waLink;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.87 11.88L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8.97h.01a7.94 7.94 0 0 0 5.55-13.54zm-5.55 12.2a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.51.66.67-2.45-.16-.25a6.58 6.58 0 0 1 10.24-8.16 6.53 6.53 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.58 6.6z"></path></svg> Chat on WhatsApp';
        body.appendChild(a);
        body.scrollTop = body.scrollHeight;
    }

    function renderOptions(list) {
        if (!list || !list.length) return;
        var wrap = document.createElement('div');
        wrap.className = 'chat-options';
        list.forEach(function (opt) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chat-option-btn';
            btn.textContent = opt.label;
            btn.addEventListener('click', function () {
                goTo(opt.next, opt.label);
            });
            wrap.appendChild(btn);
        });
        body.appendChild(wrap);
        body.scrollTop = body.scrollHeight;
    }

    function goTo(key, userLabel) {
        var oldOptions = body.querySelectorAll('.chat-options');
        oldOptions.forEach(function (o) {
            o.remove();
        });

        var node = nodes[key];
        if (!node) return;

        if (userLabel) addMessage(userLabel, 'user');

        setTimeout(function () {
            var msgEl = addMessage(node.bot, 'bot');
            if (node.showWa) addWaButton();
            if (node.mount) node.mount(msgEl);
            setTimeout(function () {
                renderOptions(node.options);
            }, 250);
        }, userLabel ? 350 : 0);
    }

    var started = false;

    function openChat() {
        widget.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        if (!started) {
            started = true;
            goTo('main');
        }
    }

    function closeChat() {
        widget.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        if (widget.classList.contains('is-open')) closeChat();
        else openChat();
    });
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('click', function (e) {
        if (widget.classList.contains('is-open') && e.composedPath().indexOf(widget) === -1) closeChat();
    });
})();

(function () {
    var overlay = document.querySelector('[data-newsletter-overlay]');
    if (!overlay) return;
    var closeBtn = overlay.querySelector('[data-newsletter-close]');
    var form = overlay.querySelector('[data-newsletter-form]');
    var bodyEl = overlay.querySelector('[data-newsletter-body]');
    var errorEl = overlay.querySelector('[data-newsletter-error]');
    var STORAGE_KEY = 'foamicoNewsletterDismissedAt';
    var SNOOZE_DAYS = 7;

    function shouldShow() {
        try {
            var last = localStorage.getItem(STORAGE_KEY);
            if (!last) return true;
            return Date.now() - parseInt(last, 10) > SNOOZE_DAYS * 24 * 60 * 60 * 1000;
        } catch (e) {
            return true;
        }
    }

    function remember() {
        try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch (e) {}
    }

    function dismiss() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        remember();
    }

    function open() {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    if (shouldShow()) window.setTimeout(open, 4000);

    closeBtn.addEventListener('click', dismiss);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) dismiss();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) dismiss();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorEl.hidden = true;
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        fetch('https://formsubmit.co/ajax/shlok.totla@legendpolyfoams.com', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: new FormData(form)
        }).then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            return res.json();
        }).then(function () {
            bodyEl.innerHTML = '<h3>You’re on the list!</h3><p>Thanks for subscribing — keep an eye on your inbox.</p>';
            remember();
            window.setTimeout(dismiss, 2200);
        }).catch(function () {
            errorEl.hidden = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        });
    });
})();
