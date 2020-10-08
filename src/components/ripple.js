const rippleHandler = (e, el) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let rippleEl = document.createElement('div');
    rippleEl.setAttribute('class', 'vt__ripple');
    rippleEl.style.left = `${x}px`;
    rippleEl.style.top = `${y}px`;

    el.appendChild(rippleEl);

    setTimeout(() => rippleEl.remove(), 1000);
};

export default rippleHandler;
