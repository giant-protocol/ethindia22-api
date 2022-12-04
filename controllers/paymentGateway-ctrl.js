
// PaymentGateway Controller
module.exports = init;
function init(app, depay, router) {

    /**
     * Function that helps to  store transaction
     * @param    {user} user info
     * @return   {status}
     */
    router.route('/paymentGateway/createTransaction')
        .post(async function (req, res, next) {
            var user = await depay.models.api.user.findOne({userId: req.body.from});
            req.user = user
            if(req.body.isEscrow === false && req.body.isSendToDPN === true){
                req.toUser = await depay.models.api.user.findOne({userId: req.body.to});
            }
            depay.helpers.api.paymentGateway(depay).createPaymentTransaction(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });
    /**
     * Function that helps to retrieve transaction
     * @param    {user} user info
     * @return   {status}
     */
    router.route('/paymentGateway/getTransactions')
        .post(async function (req, res, next) {
            var user = await depay.models.api.user.findOne({walletAddress: req.body.walletAddress.toLowerCase()});
            req.user = user;
            depay.helpers.api.paymentGateway(depay).getTransaction(req, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });
    /**
     * Function that helps to send notification to recevier
     * @param    {txhash} transaction hash
     * @return   {status}
     */
    router.route('/paymentGateway/event')
        .post(async function (req, res, next) {
            var args = {};
            args.txHash = req.body.txs[0].hash;
            depay.helpers.api.paymentGateway(depay).sendNotification(args, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });
    /**
     * Function that helps to send notification to recevier
     * @param    {txhash} transaction hash
     * @return   {status}
     */
    router.route('/paymentGateway/claim')
        .post(async function (req, res, next) {
            var args = {};
            args.txHash = req.body.txHash;
            depay.helpers.api.user(depay).claimToken(args, function (err, response) {
                if (err) {
                    return next(err);
                }
                res.json(response);
            });
        });
}