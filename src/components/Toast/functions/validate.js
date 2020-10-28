export const validateOptions = options => {
    let valid = true;
    // Invalid position error-handling
    if (options.positionX === 'top' || options.positionX === 'bottom') {
        console.error(
            `Vuelity [Error]: VTToast: positionX must be either "left" or "right", received "${options.positionX}"`
        );
        valid = false;
    }
    if (options.positionY === 'left' || options.positionY === 'right') {
        console.error(
            `Vuelity [Error]: VTToast: positionY must be either "top" or "bottom", received "${options.positionY}"`
        );
        valid = false;
    }

    return valid;
};

export const validateLocalOptions = (text, options) => {
    let valid = true;

    // Required text value
    if (!text && !options.slotLeft && !options.slotRight && !options.slot) {
        console.error('Vuelity [Error]: VTToast: a text/slot value is required');
        valid = false;
    }
    // Slot deprecation warning
    if (options.slot) {
        console.warn('Vuelity [Warn]: VTToast: slot is now deprecated. Use slotRight instead');
        valid = false;
    }

    return valid;
};
