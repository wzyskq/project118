

function SiteLoaderFunction() {
    const sl = new SiteLoader();
    const load_num = document.querySelector('.loader-num');
    const load_container = document.querySelector('.loader-container');

    sl.addEventListener('progress', (e) => { })

    sl.addEventListener('countComplete', () => {
        document.body.style.overflow = 'auto';
        load_container.classList.add('loader-disappear');
    })

    load_container.addEventListener('transitionend', () => {
        load_container.style.display = 'none';
    })

    sl.setTargetTextDom('.loader-num');
    sl.needSpeedUp = true;
    sl.startLoad();
}
window.SiteLoaderFunction();