var express = require('express');

var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

const app = express();
app.use(cors());
app.enable('trust proxy');
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());



var depay = {};
depay.logger = require('./helpers/logger');



// Helpers
depay.helpers = {};
depay.helpers.errors = require('./helpers/errors');


//Controllers
depay.controllers = {};

//Models
depay.models = {};

//middleware
depay.middlewares = {};

// Configs
depay.configs = {};
depay.configs.rootDir = path.dirname(require.main.filename);

// Modules
depay.modules = {};
depay.modules.api = require('./modules/api');
depay.modules.api(app, depay);

// Database
depay.database = require('./database/db');

// Connect Database
depay.database(depay,process.env.MONGO_URI);

/**.
 * @return 200 status.
 */
app.get('/',function(req, res){
    res.json({	application: 'DePay API',
        version: '1.0'
    });
});

// Error Handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        status: 'error',
        errors: err.body ? err.body.errors : '',
        message: err.message
    });
});

var port = process.env.PORT || 5001;
var httpServer = require('http').createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
httpServer.listen(port, function() {
    console.log('DePay server Running on port ' + port + '.');
});