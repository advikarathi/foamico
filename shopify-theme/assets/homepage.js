/* FOAMICO — homepage-only behavior: hero video crossfade, lazy category videos,
   motion (Yo-Yo Test) video autoplay-on-scroll, testimonial carousel.
   Loaded only on templates/index.json via layout/theme.liquid. */
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var videoA = document.querySelector('[data-hero-video-a]');
    var videoB = document.querySelector('[data-hero-video-b]');
    if (!videoA || !videoB) return;

    var CROSSFADE = 1; // seconds, must match the CSS opacity transition duration
    var active = videoA;
    var idle = videoB;
    var switching = false;
    var idleReady = false;
    var heroSrc = videoA.getAttribute('data-hero-src') || videoA.currentSrc || videoA.src;

    function ensureIdleLoaded() {
        if (idleReady) return;
        idleReady = true;
        idle.src = heroSrc;
        idle.load();
    }

    // Fetch the crossfade partner once the browser is idle, well before
    // videoA reaches the point where it's actually needed — avoids
    // downloading the same file twice on initial page load.
    if (window.requestIdleCallback) {
        window.requestIdleCallback(ensureIdleLoaded, { timeout: 4000 });
    } else {
        window.setTimeout(ensureIdleLoaded, 2000);
    }

    function watch(video) {
        video.addEventListener('timeupdate', function onTime() {
            if (switching || !video.duration) return;
            if (video.currentTime >= video.duration - CROSSFADE - 3) {
                ensureIdleLoaded();
            }
            if (video.currentTime >= video.duration - CROSSFADE) {
                switching = true;
                video.removeEventListener('timeupdate', onTime);
                crossfade();
            }
        });
    }

    function crossfade() {
        idle.currentTime = 0;
        var playPromise = idle.play();
        if (playPromise && playPromise.catch) playPromise.catch(function () {});
        idle.classList.add('is-live');
        active.classList.remove('is-live');

        window.setTimeout(function () {
            active.pause();
            active.currentTime = 0;
            var prevActive = active;
            active = idle;
            idle = prevActive;
            switching = false;
            watch(active);
        }, CROSSFADE * 1000);
    }

    watch(active);
})();

(function () {
    // Category videos are not fetched until the grid is about to enter
    // view, so the hero + category sections don't compete for bandwidth
    // on initial load.
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var grid = document.querySelector('[data-categories-grid]');
    var videos = Array.prototype.slice.call(document.querySelectorAll('[data-category-video]'));
    if (!grid) return;

    function whenReady(video) {
        return new Promise(function (resolve) {
            if (video.readyState >= 3) {
                resolve();
                return;
            }
            video.addEventListener('canplay', resolve, { once: true });
            video.src = video.getAttribute('data-src');
            video.load();
        });
    }

    function loadAndSyncVideos() {
        if (reduceMotion || videos.length < 1) return;

        Promise.all(videos.map(whenReady)).then(function () {
            if (videos.length < 2) {
                var only = videos[0];
                var p = only.play();
                if (p && p.catch) p.catch(function () {});
                return;
            }

            var master = videos[0];

            videos.forEach(function (video) {
                video.pause();
                video.currentTime = 0;
                video.playbackRate = 1;
            });

            window.requestAnimationFrame(function () {
                videos.forEach(function (video) {
                    var playPromise = video.play();
                    if (playPromise && playPromise.catch) playPromise.catch(function () {});
                });
            });

            function keepInStep() {
                if (!document.hidden && !master.paused) {
                    videos.slice(1).forEach(function (video) {
                        if (Math.abs(video.currentTime - master.currentTime) > 0.06) {
                            video.currentTime = master.currentTime;
                        }
                    });
                }
                window.requestAnimationFrame(keepInStep);
            }

            window.requestAnimationFrame(keepInStep);
        });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                grid.classList.add('is-visible');
                loadAndSyncVideos();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '200px 0px'
    });
    observer.observe(grid);
})();

(function () {
    var video = document.querySelector('[data-motion-video]');
    if (!video) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var playPromise = video.play();
                if (playPromise && playPromise.catch) playPromise.catch(function () {});
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.35
    });
    observer.observe(video);
})();

(function () {
    var track = document.querySelector('[data-testimonial-track]');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);
    var prevBtn = document.querySelector('[data-testimonial-prev]');
    var nextBtn = document.querySelector('[data-testimonial-next]');
    var dotsWrap = document.querySelector('[data-testimonial-dots]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;
    var isPlaying = false;
    var autoTimer = null;

    cards.forEach(function (card) {
        var media = card.querySelector('[data-testimonial-media]');
        var video = card.querySelector('[data-testimonial-video]');
        var playBtn = card.querySelector('[data-testimonial-play]');
        if (!media || !video || !playBtn) return;

        playBtn.addEventListener('click', function () {
            media.classList.add('is-playing');
            video.controls = true;
            video.play();
        });
        video.addEventListener('playing', function () {
            isPlaying = true;
            stopAuto();
        });
        video.addEventListener('pause', function () {
            isPlaying = false;
            startAuto();
        });
        video.addEventListener('ended', function () {
            isPlaying = false;
            video.controls = false;
            video.currentTime = 0;
            media.classList.remove('is-playing');
            startAuto();
        });
    });

    if (cards.length <= 1) {
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
        if (dotsWrap) dotsWrap.hidden = true;
        return;
    }

    cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function () {
            goTo(i);
        });
        dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
        current = (i + cards.length) % cards.length;
        cards[current].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
        dots.forEach(function (d, di) {
            d.classList.toggle('is-active', di === current);
        });
    }

    function startAuto() {
        if (reduceMotion || isPlaying) return;
        stopAuto();
        autoTimer = window.setInterval(function () {
            goTo(current + 1);
        }, 5000);
    }

    function stopAuto() {
        if (autoTimer) {
            window.clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });

    var scrollTimer = null;
    track.addEventListener('scroll', function () {
        if (scrollTimer) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(function () {
            var mid = track.scrollLeft + track.clientWidth / 2;
            var closest = 0;
            var closestDist = Infinity;
            cards.forEach(function (card, i) {
                var dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - mid);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = i;
                }
            });
            current = closest;
            dots.forEach(function (d, di) {
                d.classList.toggle('is-active', di === current);
            });
        }, 120);
    }, { passive: true });

    startAuto();
})();
