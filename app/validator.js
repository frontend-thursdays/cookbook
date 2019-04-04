class Validator {

    // Rules
    static required(key, value, errors) {
        let meet = typeof value !== 'undefined' && value !== null;
        if (typeof value !== 'number') {
            meet = meet && value;
        }

        if (!meet) {
            errors.push(`${key} is required.`);
        }
    }

    static min(min) {
        return (key, value, errors) => {
            const meet = (typeof value === 'number' ? value >= min : true)
                      && (typeof value === 'string' ? value.length >= min : true);

            if (!meet) {
                errors.push(`${key} value is smaller than ${min}.`);
            }
        }
    }

    static max(max) {
        return (key, value, errors) => {
            const meet = (typeof value === 'number' ? value <= max : true)
                      && (typeof value === 'string' ? value.length <= max : true);

            if (!meet) {
                errors.push(`${key} value is larger than ${max}.`);
            }
        }
    }

    static number(key, value, errors) {
        const meet = typeof value === 'number';

        if (!meet) {
            errors.push(`${key} value type number expected, ${typeof value} given.`);
        }
    }

    static string(key, value, errors) {
        const meet = typeof value === 'string';

        if (!meet) {
            errors.push(`${key} value type string expected, ${typeof value} given.`);
        }
    }

    static exists(collection) {
        return (key, value, errors) => {
            const meet = collection.findIndex(element => element[key] === value) !== -1;

            if (!meet) {
                errors.push(`${key} ${value} not exists in given collection.`);
            }
        }
    }

    static unique(collection) {
        return (key, value, errors) => {
            const meet = collection.findIndex(element => element[key] === value) === -1;

            if (!meet) {
                errors.push(`${key} ${value} already exists in given collection.`);
            }
        }
    }

    static email(key, value, errors) {
        const meet = typeof value === 'string'
                  && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

        if (!meet) {
            errors.push(`${key} ${value} has not proper email format.`);
        }
    }

    // Constructor
    constructor(target) {
        this.target = target;
        this.errors = [];
        this.rules = {};
    }

    // Validate
    validate(rules, errorHandler) {
        this.rules = Object.keys(rules).map(key => ({key, validators: rules[key]}));
        this.errorHandler = errorHandler;

        if (typeof this.target === 'object') {
            return this.next();
        } else {
            this.errors.push('Given target is not an object.');
            this.handleErrors();
            return false;
        }
    }

    next(index = 0) {
        if (typeof this.rules[index] === 'undefined') {
            this.handleErrors();
            return !this.errors.length;
        } else {
            const rule = this.rules[index];
            const errors = this.errors;
            for (const validator of rule.validators) {
                validator(rule.key, this.target[rule.key], errors);
            }
            return this.next(index + 1);
        }
    }

    // Handle errors
    handleErrors() {
        if (this.errorHandler) {
            this.errorHandler(this.errors)
        }
    }
}