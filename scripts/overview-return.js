// Do NOT rename this to a generic "back to top" name: ad blockers' cosmetic
// filters hide back-to-top, jump-to-top, and scroll-to-top.
(function () {
    var btn = document.getElementById('overview-return');
    if (!btn) return;

    var threshold = 400;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function update() {
        if (window.scrollY > threshold) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
})();
