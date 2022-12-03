/**
 * Created by Depay on 03/12/22.
 */
'use strict';

// REST API Module
var express = require('express');

module.exports = init;
function init(app, depay, router) {
    depay.logger.debug('Api Module Loaded!');

    if (!router) {
        router = express.Router();
    }

    depay.controllers.api = {};
    depay.helpers.api = {};
    depay.models.api = {};

    depay.configs.api = require(depay.configs.rootDir +'/configs/api');

    //model init
    depay.models.api.user = require(depay.configs.rootDir +'/models/user-mdl');
    depay.models.api.paymentGateway = require(depay.configs.rootDir +'/models/paymentGateway-mdl');




    //hlpr init
    depay.helpers.api.user = require(depay.configs.rootDir +'/helpers/user-hlpr');
    depay.helpers.api.paymentGateway = require(depay.configs.rootDir +'/helpers/paymentGateway-hlpr');





    //ctrl init
    depay.controllers.api.user = require(depay.configs.rootDir +'/controllers/user-ctrl');
    depay.controllers.api.paymentGateway = require(depay.configs.rootDir +'/controllers/paymentGateway-ctrl');




    depay.controllers.api.user(app, depay, router);
    depay.controllers.api.paymentGateway(app, depay, router);


    if (depay.configs.api.urlWithVersionNumber) {
        app.use(depay.configs.api.apiUrl + '/' + depay.configs.api.version, router);
    } else {
        app.use(depay.configs.api.apiUrl, router);
    }

}
