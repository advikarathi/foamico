/* FOAMICO — pillows collection filter (by tag-derived category) and sort
   (price asc/desc, newest). Loaded only on the pillows collection template. */
(function () {
    var filterBar = document.getElementById('pillowFilters');
    if (!filterBar) return;
    var buttons = filterBar.querySelectorAll('button');
    var cards = document.querySelectorAll('#pillowGrid .product-card');
    var emptyNote = document.getElementById('pillowEmptyNote');

    function applyFilter(filter) {
        var visibleCount = 0;
        cards.forEach(function (card) {
            var cats = (card.dataset.categories || '').split(' ');
            var show = filter === 'all' || cats.indexOf(filter) !== -1;
            card.classList.toggle('is-hidden', !show);
            if (show) visibleCount++;
        });
        emptyNote.hidden = visibleCount !== 0;
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
            btn.setAttribute('aria-pressed', 'true');
            applyFilter(btn.dataset.filter);
        });
    });
})();

(function () {
    var grid = document.getElementById('pillowGrid');
    var select = document.getElementById('pillowSort');
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
