'use strict';

// User Controller

module.exports = init;

function init(app, depay, router) {

    /**
     * Function that helps to retrieve user register with polygon id and worldid
     * @param    {walletAddress} user wallet address
     * @return   {status}
     */
    router.route('/user/status')
        .post(function (req, res, next) {
            depay.helpers.api.user(depay).userStatus(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });

    /**
     * Function that helps to send otp to given number
     * @param    {phoneNumber} user mobile number
     * @return   {status}
     */
    router.route('/user/send_otp')
        .post(function (req, res, next) {
            depay.helpers.api.user(depay).sendOtp(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });
    /**
     * Function that helps to send otp to given number
     * @param    {phoneNumber} user mobile number
     * @return   {status}
     */
    router.route('/user/send_verify')
        .post(function (req, res, next) {
            depay.helpers.api.user(depay).verifyOtp(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.send(response);
            });
        });

    /**
     * Function that helps to retrieve check register with phone number
     * @param    {phoneNumber} user phone number
     * @return   {status}
     */
    router.route('/user/isRegister')
        .post(function (req, res, next) {
            depay.helpers.api.user(depay).phoneNumberStatus(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });

}