const stylesheet = () => {
    const style = document.createElement('style');

    style.type = 'text/css';
    style.id = 'vt__ripple';
    style.innerHTML = `.vt__ripple{pointer-events:none!important;position:absolute!important;margin:0!important;padding:0!important;background-color:#fff;transform:translate(-50%,-50%)!important;border-radius:50%!important;height:55rem!important;width:15rem!important;animation:vt__ripple-out .5s cubic-bezier(.4,.2,.6,1) forwards!important}@keyframes vt__ripple-out{0%{opacity:0;max-height:0;max-width:0}50%{opacity:.3}70%{opacity:.1}100%{opacity:0;max-height:10rem;max-width:10rem}}`;

    document.head.appendChild(style);
};

const rippleHandler = (e, el) => {
    if (e.target.getAttribute('disabled') === 'true') return;
    if (!document.getElementById('vt__ripple')) stylesheet();

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let rippleEl = document.createElement('div');
    rippleEl.setAttribute('class', 'vt__ripple');
    rippleEl.setAttribute('aria-hidden', 'true');

    // Position ripple
    if (e.key !== 'Enter') {
        rippleEl.style.left = `${x}px`;
        rippleEl.style.top = `${y}px`;
    } else {
        // Center if key is enter
        rippleEl.style.left = `50%`;
        rippleEl.style.top = `50%`;
        rippleEl.style.transform = `translate(-50%, -50%)`;
    }

    el.appendChild(rippleEl);
    setTimeout(() => rippleEl.remove(), 100000);
};

export default rippleHandler;
