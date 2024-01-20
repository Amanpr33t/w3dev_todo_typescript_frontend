//Function is used to capitalize first letter of a string
function capitalizeFirstLetter(inputString: string): string {
    if (!inputString) {
        return inputString;
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export { capitalizeFirstLetter }