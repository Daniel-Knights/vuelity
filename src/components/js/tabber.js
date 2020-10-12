const tabber = () => {
    // Tab outline for accessibility
    const handleFirstTab = e => {
        if (e.key === 'Tab') {
            document.body.classList.add('vt__tab-outline');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    };

    // Remove outline on click
    const handleMouseDownOnce = () => {
        document.body.classList.remove('vt__tab-outline');

        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    };

    window.addEventListener('keydown', handleFirstTab);
};

export default tabber;
