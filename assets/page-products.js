/* FOAMICO — "shop all mattresses" page: lazy-load 3D-view videos on scroll,
   and sort the grid by price/newest. Loaded only on templates/page.products.json. */
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var videos = Array.prototype.slice.call(document.querySelectorAll('.product-video[data-src]'));
    if (!videos.length) return;

    function loadAndPlay(video) {
        video.src = video.dataset.src;
        video.load();
        if (reduceMotion) return;
        video.addEventListener('canplay', function () {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
        }, { once: true });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                loadAndPlay(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '200px 0px' });

    videos.forEach(function (video) {
        observer.observe(video);
    });
})();

(function () {
    var grid = document.getElementById('mattressGrid');
    var select = document.getElementById('mattressSort');
    if (!grid || !select) return;
    var originalOrder = Array.prototype.slice.call(grid.children);

    function sortBy(mode) {
        var cards = Array.prototype.slice.call(grid.children);
        var sorted;
        if (mode === 'price-asc') {
            sorted = cards.sort(function (a, b) { return Number(a.dataset.price) - Number(b.dataset.price); });
        } else if (mode === 'price-desc') {
            sorted = cards.sort(function (a, b) { return Number(b.dataset.price) - Number(a.dataset.price); });
        } else if (mode === 'new') {
            sorted = cards.sort(function (a, b) { return Number(b.dataset.launched) - Number(a.dataset.launched); });
        } else {
            sorted = originalOrder;
        }
        sorted.forEach(function (card) { grid.appendChild(card); });
    }

    select.addEventListener('change', function () {
        sortBy(select.value);
    });
})();
