/* FOAMICO — shared price-quote engine for the site chat widget.
   Mirrors the pricing logic/data from the internal SKU Price Bot (prices.html)
   so customers can get a customised mattress quote directly inside chat. */
(function (global) {
    "use strict";

    var MODELS = ['Ecolite', 'Signature', 'Magic', 'Maxa', 'Duro', 'Luma', 'Resto', 'Sova', 'Ultima', 'Riva', 'Sofa'];

    var COLS = [
        { m: 'Ecolite', v: 'Classic', t: 5, r: 510 },
        { m: 'Signature', v: 'Classic', t: 4, r: 367 },
        { m: 'Signature', v: 'Premium', t: 4, r: 400 },
        { m: 'Signature', v: 'Luxury', t: 4, r: 400 },
        { m: 'Signature', v: 'Classic', t: 5, r: 433 },
        { m: 'Signature', v: 'Premium', t: 5, r: 467 },
        { m: 'Signature', v: 'Luxury', t: 5, r: 467 },
        { m: 'Magic', v: 'Classic', t: 5, r: 467 },
        { m: 'Maxa', v: 'Classic', t: 5, r: 533 },
        { m: 'Duro', v: 'Classic', t: 5, r: 533 },
        { m: 'Duro', v: 'Premium', t: 6, r: 653 },
        { m: 'Duro', v: 'Luxury', t: 6, r: 667 },
        { m: 'Luma', v: 'Classic', t: 6, r: 867 },
        { m: 'Luma', v: 'Premium', t: 8, r: 933 },
        { m: 'Luma', v: 'Luxury', t: 10, r: 1067 },
        { m: 'Resto', v: 'Classic', t: 5, r: 667 },
        { m: 'Resto', v: 'Classic', t: 6, r: 800 },
        { m: 'Resto', v: 'Premium', t: 6.5, r: 933 },
        { m: 'Resto', v: 'Luxury', t: 7, r: 1000 },
        { m: 'Sova', v: 'Classic', t: 5, r: 667 },
        { m: 'Sova', v: 'Classic', t: 6, r: 800 },
        { m: 'Sova', v: 'Premium', t: 6.5, r: 933 },
        { m: 'Sova', v: 'Luxury', t: 7, r: 1000 },
        { m: 'Sova', v: 'Natural', t: 6, r: 1500 },
        { m: 'Ultima', v: 'Classic', t: 5, r: 867 },
        { m: 'Ultima', v: 'Classic', t: 6, r: 1000 },
        { m: 'Ultima', v: 'Premium', t: 6.5, r: 1133 },
        { m: 'Ultima', v: 'Luxury', t: 7, r: 1333 },
        { m: 'Ultima', v: 'Natural', t: 6, r: 2000 },
        { m: 'Riva', v: 'Natural', t: 6, r: 3000 },
        { m: 'Riva', v: 'R1000', t: 8, r: 2000 },
        { m: 'Riva', v: 'R2000', t: 9, r: 2667 },
        { m: 'Riva', v: 'R3000', t: 10, r: 3333 },
        { m: 'Sofa', v: 'Classic', t: 8, r: 800 },
        { m: 'Sofa', v: 'Premium', t: 8, r: 1000 }
    ];

    var PRICES = {
        '72x30': [6565, 4720, 5149, 5149, 5578, 6007, 6007, 6007, 6866, 6866, 8411, 8582, 11157, 12016, 13732, 8582, 10299, 12016, 12874, 8582, 10299, 12016, 12874, 19312, 11157, 12874, 14591, 17166, 25749, 38624, 25749, 34332, 42916, 10299, 12874],
        '72x36': [7649, 5499, 5999, 5999, 6499, 6999, 6999, 6999, 7999, 7999, 9799, 9999, 12999, 13999, 15999, 9999, 11999, 13999, 14999, 9999, 11999, 13999, 14999, 22499, 12999, 14999, 16999, 19999, 29999, 44999, 29999, 39999, 49999, 11999, 14999],
        '72x42': [9192, 6608, 7209, 7209, 7810, 8410, 8410, 8410, 9612, 9612, 11775, 12015, 15620, 16822, 19225, 12015, 14419, 16822, 18024, 12015, 14419, 16822, 18024, 27036, 15620, 18024, 20427, 24032, 36049, 54074, 36049, 48065, 60082, 14419, 18024],
        '72x48': [10199, 7332, 7999, 7999, 8665, 9332, 9332, 9332, 10665, 10665, 13065, 13332, 17332, 18665, 21332, 13332, 15999, 18665, 19999, 13332, 15999, 18665, 19999, 29999, 17332, 19999, 22665, 26665, 39999, 59999, 39999, 53332, 66665, 15999, 19999],
        '72x60': [13131, 9440, 10298, 10298, 11157, 12015, 12015, 12015, 13732, 13732, 16822, 17165, 22315, 24032, 27465, 17165, 20598, 24032, 25748, 17165, 20598, 24032, 25748, 38623, 22315, 25748, 29182, 34332, 51498, 77248, 51498, 68665, 85832, 20598, 25748],
        '72x66': [14444, 10384, 11328, 11328, 12272, 13216, 13216, 13216, 15105, 15105, 18504, 18881, 24546, 26435, 30211, 18881, 22658, 26435, 28323, 18881, 22658, 26435, 28323, 42486, 24546, 28323, 32100, 37765, 56648, 84973, 56648, 75531, 94415, 22658, 28323],
        '72x72': [15298, 10998, 11998, 11998, 12998, 13998, 13998, 13998, 15998, 15998, 19598, 19998, 25998, 27998, 31998, 19998, 23998, 27998, 29998, 19998, 23998, 27998, 29998, 44998, 25998, 29998, 33998, 39998, 59998, 89998, 59998, 79998, 99998, 23998, 29998],
        '75x30': [6839, 4917, 5364, 5364, 5811, 6258, 6258, 6258, 7152, 7152, 8761, 8940, 11622, 12516, 14305, 8940, 10728, 12516, 13411, 8940, 10728, 12516, 13411, 20116, 11622, 13411, 15199, 17881, 26822, 40233, 26822, 35763, 44704, 10728, 13411],
        '75x36': [7968, 5728, 6249, 6249, 6770, 7291, 7291, 7291, 8332, 8332, 10207, 10416, 13541, 14582, 16666, 10416, 12499, 14582, 15624, 10416, 12499, 14582, 15624, 23436, 13541, 15624, 17707, 20832, 31249, 46874, 31249, 41666, 52082, 12499, 15624],
        '75x42': [9575, 6883, 7509, 7509, 8135, 8761, 8761, 8761, 10013, 10013, 12266, 12516, 16271, 17523, 20027, 12516, 15020, 17523, 18775, 12516, 15020, 17523, 18775, 28163, 16271, 18775, 21278, 25033, 37551, 56327, 37551, 50068, 62586, 15020, 18775],
        '75x48': [10624, 7638, 8332, 8332, 9026, 9721, 9721, 9721, 11110, 11110, 13610, 13888, 18054, 19443, 22221, 13888, 16665, 19443, 20832, 13888, 16665, 19443, 20832, 31249, 18054, 20832, 23610, 27776, 41665, 62499, 41665, 55554, 69443, 16665, 20832],
        '75x60': [13678, 9833, 10727, 10727, 11621, 12516, 12516, 12516, 14304, 14304, 17523, 17880, 23245, 25033, 28609, 17880, 21457, 25033, 26821, 17880, 21457, 25033, 26821, 40233, 23245, 26821, 30398, 35762, 53644, 80467, 53644, 71526, 89408, 21457, 26821],
        '75x66': [15046, 10817, 11800, 11800, 12784, 13767, 13767, 13767, 15734, 15734, 19275, 19668, 25569, 27536, 31470, 19668, 23602, 27536, 29503, 19668, 23602, 27536, 29503, 44256, 25569, 29503, 33437, 39338, 59008, 88514, 59008, 78679, 98349, 23602, 29503],
        '75x72': [15936, 11457, 12499, 12499, 13541, 14582, 14582, 14582, 16666, 16666, 20416, 20832, 27082, 29166, 33332, 20832, 24999, 29166, 31249, 20832, 24999, 29166, 31249, 46874, 27082, 31249, 35416, 41666, 62499, 93749, 62499, 83332, 104166, 24999, 31249],
        '78x30': [7113, 5113, 5578, 5578, 6043, 6508, 6508, 6508, 7438, 7438, 9112, 9298, 12087, 13017, 14877, 9298, 11157, 13017, 13947, 9298, 11157, 13017, 13947, 20921, 12087, 13947, 15807, 18596, 27895, 41843, 27895, 37194, 46492, 11157, 13947],
        '78x36': [8286, 5957, 6499, 6499, 7041, 7582, 7582, 7582, 8666, 8666, 10616, 10832, 14082, 15166, 17332, 10832, 12999, 15166, 16249, 10832, 12999, 15166, 16249, 24374, 14082, 16249, 18416, 21666, 32499, 48749, 32499, 43332, 54166, 12999, 16249],
        '78x42': [9958, 7159, 7810, 7810, 8460, 9111, 9111, 9111, 10413, 10413, 12756, 13017, 16922, 18224, 20828, 13017, 15620, 18224, 19526, 13017, 15620, 18224, 19526, 29289, 16922, 19526, 22129, 26035, 39053, 58580, 39053, 52071, 65089, 15620, 19526],
        '78x48': [11049, 7943, 8665, 8665, 9387, 10110, 10110, 10110, 11554, 11554, 14154, 14443, 18776, 20221, 23110, 14443, 17332, 20221, 21665, 14443, 17332, 20221, 21665, 32499, 18776, 21665, 24554, 28887, 43332, 64999, 43332, 57776, 72221, 17332, 21665],
        '78x60': [14225, 10227, 11156, 11156, 12086, 13016, 13016, 13016, 14876, 14876, 18223, 18595, 24175, 26034, 29754, 18595, 22315, 26034, 27894, 18595, 22315, 26034, 27894, 41842, 24175, 27894, 31613, 37193, 55790, 83686, 55790, 74387, 92984, 22315, 27894],
        '78x66': [15648, 11249, 12272, 12272, 13295, 14318, 14318, 14318, 16364, 16364, 20046, 20455, 26592, 28638, 32729, 20455, 24546, 28638, 30683, 20455, 24546, 28638, 30683, 46026, 26592, 30683, 34775, 40912, 61369, 92054, 61369, 81826, 102283, 24546, 30683],
        '78x72': [16572, 11914, 12997, 12997, 14080, 15164, 15164, 15164, 17330, 17330, 21230, 21663, 28163, 30330, 34663, 21663, 25997, 30330, 32497, 21663, 25997, 30330, 32497, 48747, 28163, 32497, 36830, 43330, 64997, 97497, 64997, 86663, 108330, 25997, 32497],
        '84x36': [8924, 6415, 6999, 6999, 7582, 8165, 8165, 8165, 9332, 9332, 11432, 11666, 15166, 16332, 18665, 11666, 13999, 16332, 17499, 11666, 13999, 16332, 17499, 26249, 15166, 17499, 19832, 23332, 34999, 52499, 34999, 46665, 58332, 13999, 17499],
        '84x60': [15319, 11013, 12015, 12015, 13016, 14017, 14017, 14017, 16020, 16020, 19625, 20026, 26034, 28037, 32042, 20026, 24031, 28037, 30040, 20026, 24031, 28037, 30040, 45060, 26034, 30040, 34045, 40054, 60081, 90123, 60081, 80109, 100137, 24031, 30040],
        '84x72': [17848, 12831, 13998, 13998, 15164, 16331, 16331, 16331, 18664, 18664, 22864, 23331, 30331, 32664, 37331, 23331, 27998, 32664, 34998, 23331, 27998, 32664, 34998, 52498, 30331, 34998, 39664, 46664, 69998, 104998, 69998, 93331, 116664, 27998, 34998]
    };

    var PILLOWS = [
        { re: /zero\s*gravity\s*[-–]?\s*natural/i, name: 'Zero Gravity – Natural', cat: 'Natural Latex', mrp: 4999 },
        { re: /zero\s*gravity\s*contour/i, name: 'Zero Gravity Contour', cat: 'Latex', mrp: 1999 },
        { re: /zero\s*gravity/i, name: 'Zero Gravity', cat: 'Latex', mrp: 1999 },
        { re: /memo[-\s]*rest\s*contour\s*[-–]?\s*mini/i, name: 'Memo-Rest Contour – Mini', cat: 'Memory', mrp: 1499 },
        { re: /memo[-\s]*rest\s*contour/i, name: 'Memo-Rest Contour', cat: 'Memory', mrp: 1999 },
        { re: /memo[-\s]*rest\s*slim/i, name: 'Memo-Rest Slim', cat: 'Memory', mrp: 1499 },
        { re: /memo[-\s]*rest/i, name: 'Memo-Rest', cat: 'Memory', mrp: 1999 },
        { re: /memo[-\s]*touch/i, name: 'Memo-Touch', cat: 'Memory', mrp: 1799 },
        { re: /cloud\s*pro/i, name: 'Cloud Pro', cat: 'Microfibre', mrp: 1099 },
        { re: /cloud/i, name: 'Cloud', cat: 'Microfibre', mrp: 899 },
        { re: /air\s*soft/i, name: 'Air Soft', cat: 'HR Foam', mrp: 1499 },
        { re: /(mattress\s*)?protector/i, name: 'Mattress Protector', cat: 'Protector', mrp: 1499 }
    ];

    function inr(n) {
        n = Math.round(n);
        var s = String(n);
        if (s.length <= 3) return s;
        var l = s.slice(-3);
        var r = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        return r + ',' + l;
    }

    function thick(t) { return t + '"'; }

    function parseSize(l) {
        var m = l.match(/(\d{2,3}(?:\.\d+)?)\s*[x×*]\s*(\d{2,3}(?:\.\d+)?)/i);
        if (!m) return null;
        return { a: parseFloat(m[1]), b: parseFloat(m[2]) };
    }

    function stdKey(a, b) {
        var k1 = a + 'x' + b, k2 = b + 'x' + a;
        if (PRICES[k1]) return k1;
        if (PRICES[k2]) return k2;
        return null;
    }

    var STD_SIZES = (function () {
        var set = {};
        Object.keys(PRICES).forEach(function (k) {
            k.split('x').forEach(function (n) { set[Number(n)] = true; });
        });
        return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
    })();

    function findUpgrade(a, b) {
        var aC = STD_SIZES.filter(function (s) { return s >= a; });
        var bC = STD_SIZES.filter(function (s) { return s >= b; });
        var best = null;
        aC.forEach(function (av) {
            bC.forEach(function (bv) {
                var key = stdKey(av, bv);
                if (key && (!best || (av + bv) < best.sum)) best = { key: key, sum: av + bv };
            });
        });
        return best;
    }

    function priceForSize(a, b, col) {
        var key = stdKey(a, b);
        if (key) return { sizeLabel: key.replace('x', '×'), custom: false, upgraded: false, unit: PRICES[key][col.i] };
        var up = findUpgrade(a, b);
        if (up) return { sizeLabel: up.key.replace('x', '×'), custom: false, upgraded: true, origSize: a + '×' + b, unit: PRICES[up.key][col.i] };
        var sqin = a * b, sqft = sqin / 144, unit = Math.round(sqft * col.r);
        return { sizeLabel: a + '×' + b, custom: true, upgraded: false, rate: col.r, sqin: sqin, sqft: sqft, unit: unit };
    }

    /* ---------------- injected styles (once) ---------------- */
    function injectStyles() {
        if (document.getElementById('foamico-price-bot-styles')) return;
        var css = '' +
            '.pb-wrap{font-family:var(--ms-font-body,"Poppins",sans-serif);}' +
            '.pb-row{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}' +
            '.pb-row-2{display:flex;gap:8px;}' +
            '.pb-row-2>*{flex:1;min-width:0;}' +
            '.pb-wrap select,.pb-wrap input{width:100%;font-family:var(--ms-font-body,"Poppins",sans-serif);font-size:12.5px;color:var(--ms-charcoal,#1A1A1A);background:var(--ms-paper,#F6F8F1);border:1px solid var(--ms-line,#DDDDDD);border-radius:8px;padding:8px 10px;box-sizing:border-box;}' +
            '.pb-wrap select:disabled,.pb-wrap input:disabled{opacity:.5;}' +
            '.pb-add-btn{width:100%;background:var(--ms-teal-deep,#3F5E12);color:#FEFEFE;font-family:var(--ms-font-head,"Montserrat",sans-serif);font-weight:700;font-size:12.5px;border:none;border-radius:999px;padding:9px;cursor:pointer;margin-top:2px;}' +
            '.pb-add-btn:hover{filter:brightness(1.1);}' +
            '.pb-err{color:#9d3d27;font-size:11.5px;margin:4px 0 0;min-height:14px;}' +
            '.pb-list{margin-top:10px;display:flex;flex-direction:column;gap:6px;}' +
            '.pb-item{display:flex;justify-content:space-between;align-items:center;gap:8px;background:var(--ms-paper,#F6F8F1);border:1px solid var(--ms-line,#DDDDDD);border-radius:8px;padding:7px 10px;font-size:12px;color:var(--ms-charcoal,#1A1A1A);}' +
            '.pb-item-rm{border:none;background:transparent;color:var(--ms-navy-soft,#6B6B6B);font-size:14px;cursor:pointer;line-height:1;padding:2px 4px;flex-shrink:0;}' +
            '.pb-item-rm:hover{color:var(--ms-charcoal,#1A1A1A);}' +
            '.pb-total{margin-top:10px;background:var(--ms-charcoal,#1A1A1A);color:#FEFEFE;border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-family:var(--ms-font-head,"Montserrat",sans-serif);}' +
            '.pb-total .pb-total-lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--ms-sand,#9D9E9E);}' +
            '.pb-total .pb-total-amt{font-size:17px;font-weight:800;}' +
            '.pb-total .pb-total-amt .pb-k{color:var(--ms-teal,#95C12B);}' +
            '.pb-empty{font-size:12px;color:var(--ms-navy-soft,#6B6B6B);margin-top:8px;}' +
            '.pb-wa-btn{display:block;text-align:center;margin-top:10px;background:var(--ms-teal,#95C12B);color:var(--ms-charcoal,#1A1A1A);font-family:var(--ms-font-head,"Montserrat",sans-serif);font-weight:700;font-size:12.5px;padding:9px;border-radius:999px;text-decoration:none;}' +
            '.pb-wa-btn:hover{filter:brightness(1.05);}' +
            '.pb-note{font-size:10.5px;color:var(--ms-sand,#9D9E9E);margin-top:8px;font-style:italic;}';
        var style = document.createElement('style');
        style.id = 'foamico-price-bot-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ---------------- mount into a container ---------------- */
    function mount(container, opts) {
        injectStyles();
        opts = opts || {};
        var phone = opts.phone || '917496982886';
        var items = [];

        container.innerHTML =
            '<div class="pb-wrap">' +
            '<div class="pb-row">' +
            '<select id="pbModel"><option value="" disabled selected>Select model…</option></select>' +
            '<select id="pbThk" disabled><option value="">Select variant first</option></select>' +
            '<div class="pb-row-2">' +
            '<input id="pbSize" type="text" placeholder="Size, e.g. 72x60" disabled autocomplete="off">' +
            '<input id="pbQty" type="number" min="1" step="1" value="1" style="max-width:64px;">' +
            '</div>' +
            '<button type="button" class="pb-add-btn" id="pbAdd">+ Add to quote</button>' +
            '<p class="pb-err" id="pbErr"></p>' +
            '</div>' +
            '<div id="pbList"></div>' +
            '<div id="pbResult"></div>' +
            '</div>';

        var modelSel = container.querySelector('#pbModel');
        var thkSel = container.querySelector('#pbThk');
        var sizeInput = container.querySelector('#pbSize');
        var qtyInput = container.querySelector('#pbQty');
        var addBtn = container.querySelector('#pbAdd');
        var errEl = container.querySelector('#pbErr');
        var listEl = container.querySelector('#pbList');
        var resultEl = container.querySelector('#pbResult');

        var gMattress = document.createElement('optgroup');
        gMattress.label = 'Mattresses';
        MODELS.forEach(function (m) {
            var o = document.createElement('option');
            o.value = 'm:' + m;
            o.textContent = m;
            gMattress.appendChild(o);
        });
        modelSel.appendChild(gMattress);
        var gPillow = document.createElement('optgroup');
        gPillow.label = 'Pillows & Accessories';
        PILLOWS.forEach(function (p, i) {
            var o = document.createElement('option');
            o.value = 'p:' + i;
            o.textContent = p.name;
            gPillow.appendChild(o);
        });
        modelSel.appendChild(gPillow);

        function err(msg) { errEl.textContent = msg || ''; }

        modelSel.addEventListener('change', function () {
            err('');
            var v = modelSel.value;
            if (v.indexOf('m:') === 0) {
                var modelName = v.slice(2);
                var combos = COLS.map(function (x, i) { return { m: x.m, v: x.v, t: x.t, r: x.r, i: i }; }).filter(function (x) { return x.m === modelName; });
                thkSel.innerHTML = '';
                if (combos.length !== 1) {
                    var ph = document.createElement('option');
                    ph.value = '';
                    ph.textContent = 'Select variant…';
                    ph.disabled = true;
                    ph.selected = true;
                    thkSel.appendChild(ph);
                }
                combos.forEach(function (c) {
                    var o = document.createElement('option');
                    o.value = String(c.i);
                    o.textContent = c.v + ', ' + c.t + '" thick';
                    thkSel.appendChild(o);
                });
                thkSel.disabled = false;
                sizeInput.disabled = false;
            } else if (v.indexOf('p:') === 0) {
                thkSel.innerHTML = '<option>Fixed price</option>';
                thkSel.disabled = true;
                sizeInput.disabled = true;
                sizeInput.value = '';
            }
        });

        function addItem() {
            err('');
            var mv = modelSel.value;
            var qty = Math.max(1, Math.floor(+qtyInput.value || 1));
            if (!mv) { err('Please choose a model or product.'); return; }
            var item;
            if (mv.indexOf('p:') === 0) {
                var p = PILLOWS[+mv.slice(2)];
                item = { kind: 'pillow', name: p.name, cat: p.cat, qty: qty, unit: p.mrp, total: p.mrp * qty };
            } else {
                if (thkSel.value === '') { err('Please choose the variant / thickness.'); return; }
                var sizeStr = sizeInput.value.trim();
                if (!sizeStr) { err('Please enter a size, e.g. 72x60.'); return; }
                var size = parseSize(sizeStr);
                if (!size) { err('Size not understood. Try e.g. 72x60.'); return; }
                var col = COLS[+thkSel.value];
                col = { m: col.m, v: col.v, t: col.t, r: col.r, i: +thkSel.value };
                var p2 = priceForSize(size.a, size.b, col);
                item = {
                    kind: 'mattress', model: col.m, variant: col.v, thickness: col.t,
                    sizeLabel: p2.sizeLabel, custom: p2.custom, upgraded: p2.upgraded, origSize: p2.origSize,
                    rate: p2.rate, sqft: p2.sqft, qty: qty, unit: p2.unit, total: p2.unit * qty
                };
            }
            items.push(item);
            renderList();
            renderResult();
            sizeInput.value = '';
            qtyInput.value = '1';
        }

        function renderList() {
            if (!items.length) { listEl.innerHTML = ''; return; }
            listEl.innerHTML = '<div class="pb-list">' + items.map(function (r, idx) {
                var label = r.kind === 'pillow' ? (r.name + ' (' + r.cat + ')') :
                    (r.model + ' ' + r.variant + ' ' + r.sizeLabel + ', ' + r.thickness + '"' + (r.custom ? ' · custom' : r.upgraded ? ' · upgraded' : ''));
                return '<div class="pb-item"><span>' + r.qty + '× ' + label.replace(/</g, '&lt;') + '</span><button type="button" class="pb-item-rm" data-idx="' + idx + '">✕</button></div>';
            }).join('') + '</div>';
            listEl.querySelectorAll('.pb-item-rm').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    items.splice(+btn.dataset.idx, 1);
                    renderList();
                    renderResult();
                });
            });
        }

        function summaryText() {
            var lines = ['Hi Foamico, I\'d like a quote for:'];
            var grand = 0;
            items.forEach(function (r) {
                var label = r.kind === 'pillow' ? (r.name + ' (' + r.cat + ')') :
                    (r.model + ' ' + r.variant + ' ' + r.sizeLabel + ', ' + r.thickness + '"');
                lines.push(r.qty + 'x ' + label + ' - Rs ' + inr(r.unit) + ' each = Rs ' + inr(r.total));
                grand += r.total;
            });
            lines.push('Grand total: Rs ' + inr(grand));
            return lines.join('\n');
        }

        function renderResult() {
            if (!items.length) {
                resultEl.innerHTML = '<p class="pb-empty">Add a mattress or pillow above to build your quote.</p>';
                return;
            }
            var grand = 0;
            items.forEach(function (r) { grand += r.total; });
            var waText = encodeURIComponent(summaryText());
            resultEl.innerHTML =
                '<div class="pb-total"><span class="pb-total-lbl">Estimated total</span><span class="pb-total-amt"><span class="pb-k">₹</span>' + inr(grand) + '</span></div>' +
                '<a class="pb-wa-btn" href="https://wa.me/' + phone + '?text=' + waText + '" target="_blank" rel="noopener">Send this quote on WhatsApp</a>' +
                '<p class="pb-note">MRP, inclusive of GST. Odd sizes are auto-priced or upgraded to the nearest standard size.</p>';
        }

        addBtn.addEventListener('click', addItem);
        [sizeInput, qtyInput].forEach(function (el) {
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); addItem(); }
            });
        });

        renderResult();
    }

    global.FoamicoPriceBot = { mount: mount };
})(window);
