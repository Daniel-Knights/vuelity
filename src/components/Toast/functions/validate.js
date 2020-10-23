const validateOptions = options => {
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

export default validateOptions;
