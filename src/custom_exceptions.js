class CustomException{
    constructor(message, details) {
        this.message = message;
        this.details = details;
        this.name = 'CustomException';
    }
}

export default CustomException;