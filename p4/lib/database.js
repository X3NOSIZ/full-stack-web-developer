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
 * @return Database reference.
 */
function getRef() {
    return firebaseRef;
}

/**
 * Get the results of a query.
 * @param queryRef Query.
 * @return Query result object.
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
 * @param location Location.
 * @return Value at the location.
 */
function getValue(location) {
    return getQuery(firebaseRef.child(location));
}

/**
 * Update an existing entity.
 * @param location Entity kind.
 * @param value New entity values.
 * @return New entity values.
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
 * @param location Entity kind.
 * @param value Entity value.
 * @return Key of newly generated entity.
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
