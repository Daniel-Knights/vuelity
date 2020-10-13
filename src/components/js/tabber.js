const tabber = () => {
    // Append stylesheet
    if (!document.getElementById('vt__tabber')) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'vt__tabber';
        style.innerHTML = 'body:not(.vt__tabber) * {outline: none;}';

        document.head.appendChild(style);
    }

    // Tab outline for accessibility
    const handleFirstTab = e => {
        if (e.key === 'Tab') {
            document.body.classList.add('vt__tabber');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    };

    // Remove outline on click
    const handleMouseDownOnce = () => {
        document.body.classList.remove('vt__tabber');

        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    };

    window.addEventListener('keydown', handleFirstTab);
};

export default tabber;
