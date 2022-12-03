'use strict';

//	Error Handling Helper Block

var errorCollection = {
	throw: {
		httpNotFound : function(msg){
			var err = new Error(msg || 'Not Found');
			err.status = 404;
			return err;
		},
		httpInvalidParameter : function(msg){
			var err = new Error(msg || 'Invalid Parameter');
			err.status = 400;
			return err;
		},
		httpUnauthorized : function(msg){
			var err = new Error(msg || 'Authorization Failed');
			err.status = 401;
			return err;
		},

	}
};

module.exports = errorCollection;