'use strict';


var apiMiddleware = {
    authenticate: function (depay) {
        return async function (req, res, next) {
            next();
        };

    }
};

module.exports = apiMiddleware;
