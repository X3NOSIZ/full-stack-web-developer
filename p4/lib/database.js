'use strict';

module.exports = {
    getRef: getRef,
    getQuery: getQuery,
    getValue: getValue,
    putValue: putValue,
    pushValue: pushValue
};

/******************************************************************************
 * EXTERNAL DEPENDENCIES
 ******************************************************************************/

var q = require('q');
var firebase = require('firebase');

/******************************************************************************
 * INTERNAL DEPENDENCIES
 ******************************************************************************/

var models = require('./models');

/******************************************************************************
 * INSTANCE VARIABLES
 ******************************************************************************/

var firebaseRef = new firebase(process.env.FIREBASE_URL);

/******************************************************************************
 * PUBLIC METHODS
 ******************************************************************************/

/**
 * Get a reference to the database (singleton).
 * @returns {Object} Database reference.
 */
function getRef() {
    return firebaseRef;
}

/**
 * Get the results of a query.
 * @param {Object} queryRef Query.
 * @returns {Object/String/Number/Boolean} Query result object.
 */
function getQuery(queryRef) {
    return new q.Promise(function (resolve, reject) {
        try {
            queryRef.once('value', function (snapshot) {
                if (snapshot.exists()) {
                    return resolve(snapshot.val());
                } else {
                    return resolve(null);
                }
            }, function (error) {
                return reject(new models.Error(error));
            });
        } catch (error) {
            return reject(new models.Error(error));
        }
    });
}

/**
 * Get a value at a location.
 * @param {String} location Location.
 * @returns {Object/String/Boolean/Number} Value at the location.
 */
function getValue(location) {
    return getQuery(firebaseRef.child(location));
}

/**
 * Update an existing entity.
 * @param {String} location Entity kind.
 * @param {Object/String/Number/Boolean} value New entity values.
 * @returns {Object} New entity values.
 */
function putValue(location, value) {
    return new q.Promise(function (resolve, reject) {
        try {
            firebaseRef.child(location).set(value, function (error) {
                if (error) {
                    return reject(new models.Error(error));
                } else {
                    return resolve(value);
                }
            });
        } catch (error) {
            reject(null);
        }
    });
}

/**
 * Push an entity into a kind.
 * @param {String} location Entity kind.
 * @param {Object} value Entity value.
 * @returns {String} Key of newly generated entity.
 */
function pushValue(location, value) {
    return new q.Promise(function (resolve, reject) {
        try {
            var ref = firebaseRef.child(location).push(value, function (error) {
                if (error) {
                    return reject(new models.Error(error));
                } else {
                    return resolve(ref.key());
                }
            });
        } catch (error) {
            return reject(new models.Error(error));
        }
    });
}
