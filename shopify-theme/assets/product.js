/* FOAMICO — product page behavior: gallery thumbnails, size-variant chips wired to
   real Shopify variants (updates the hidden variant id input feeding the real
   /cart/add form), layer diagram toggle, FAQ accordion, sticky buy bar.
   Loaded only on templates/product.json via layout/theme.liquid.
   Note: the old "Inquire -> WhatsApp" handler is gone — the size chips now drive a
   real add-to-cart form per the site's move to native Shopify checkout. */
(function () {
    /* ---------- Gallery ---------- */
    var mainImage = document.getElementById('mainImage');
    document.querySelectorAll('.thumb').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.thumb').forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
            btn.setAttribute('aria-selected', 'true');
            if (!mainImage) return;
            mainImage.style.opacity = 0;
            setTimeout(function () {
                mainImage.src = btn.dataset.src;
                mainImage.alt = btn.dataset.alt;
                mainImage.style.opacity = 1;
            }, 150);
        });
    });

    /* ---------- Size selector -> real variant + price + sticky bar ---------- */
    var priceEl = document.getElementById('priceEl');
    var strikeEl = document.getElementById('strikeEl');
    var stickyPrice = document.getElementById('stickyPrice');
    var stickyMeta = document.getElementById('stickyMeta');
    var variantInput = document.getElementById('selectedVariantId');
    document.querySelectorAll('#sizeChips .chip').forEach(function (chip) {
        if (chip.disabled) return;
        chip.addEventListener('click', function () {
            document.querySelectorAll('#sizeChips .chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
            chip.setAttribute('aria-pressed', 'true');
            if (priceEl) priceEl.textContent = chip.dataset.price;
            if (strikeEl) strikeEl.textContent = chip.dataset.comparePrice;
            if (stickyPrice) stickyPrice.textContent = chip.dataset.price;
            if (stickyMeta) stickyMeta.textContent = chip.dataset.size;
            if (variantInput) variantInput.value = chip.dataset.variantId;
        });
    });

    /* ---------- Layer diagram ---------- */
    var layerItems = document.querySelectorAll('.layer-item');
    var slabs = document.querySelectorAll('.layer-svg .slab');
    function activateLayer(id) {
        layerItems.forEach(function (i) { i.classList.toggle('active', i.dataset.layer === id); });
        slabs.forEach(function (s) { s.classList.toggle('dim', s.dataset.layer !== id); });
    }
    layerItems.forEach(function (item) {
        item.addEventListener('click', function () { activateLayer(item.dataset.layer); });
        item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateLayer(item.dataset.layer); } });
    });
    slabs.forEach(function (s) { s.addEventListener('click', function () { activateLayer(s.dataset.layer); }); });
    if (layerItems.length) activateLayer(layerItems[0].dataset.layer);

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-q').forEach(function (q) {
        q.addEventListener('click', function () {
            var item = q.parentElement;
            var answer = item.querySelector('.faq-a');
            var isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (o) {
                o.classList.remove('open');
                o.querySelector('.faq-a').style.maxHeight = null;
                o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                q.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- Sticky buy bar ---------- */
    var stickyBar = document.getElementById('stickyBar');
    var hero = document.querySelector('.hero');
    if (stickyBar && hero) {
        var heroObserver = new IntersectionObserver(function (entries) {
            var entry = entries[0];
            var show = !entry.isIntersecting;
            stickyBar.classList.toggle('show', show);
            stickyBar.setAttribute('aria-hidden', String(!show));
        }, { threshold: 0 });
        heroObserver.observe(hero);
    }
})();
