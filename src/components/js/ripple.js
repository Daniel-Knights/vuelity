const rippleHandler = (e, el) => {
    if (e.target.getAttribute('disabled') === 'true') return;

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

    setTimeout(() => rippleEl.remove(), 1000);
};

export default rippleHandler;
