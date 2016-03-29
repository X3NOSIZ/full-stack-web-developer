'use strict';

module.exports = Error;

/**
 * Constructor.
 */
function Error(data) {
    data = data || {};

    this.type = data.type || 'UnknownException';
    this.code = data.code || 400;

    if (this.type !== 'UnknownException') {
        this.message = data.message;
    } else {
        this.message = 'There was an error while performing the requested operation.';
    }
}

/**
 * Instance methods.
 */
Error.prototype = {
    getData: getData
};

/**
 * Get the key/value pairs that make up the entity.
 */
function getData() {
    return {
        type: this.type,
        code: this.code,
        message: this.message
    };
}
