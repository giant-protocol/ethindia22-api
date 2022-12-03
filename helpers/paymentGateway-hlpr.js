

var PaymentHelper = function (depay) {
    return {
        createPaymentTransaction: async function (args, callback) {
            let userTxn = await depay.models.api.paymentGateway.create({
                type: args.body.type,
                status: args.body.status,
                user: args.user._id,
                txHash: args.body.txHash,
                from: args.user.userId,
                to: args.body.to,
                cryptoSymbol: args.body.cryptoSymbol,
                amount: args.body.amount,
                notes: args.body.notes,
                isSendToDPN: args.body.isSendToDPN,
                isEscrow: args.body.isEscrow,
                isToken: args.body.isToken,
                usdAmount: args.body.usdAmount,
            });
            callback(null, {status : true,message :'Transaction has been created'});
        },
        sendNotification: async function (args, callback) {
            var txn = await depay.models.api.paymentGateway.findOne({txHash: args.txHash});
            if(txn){
                var user = await depay.models.api.user.findOne({userId: txn.to});
                if(user){
                    if(args.toUser){
                        args.body.walletAddress = user.walletAddress;
                        args.title ="DEPAY Received";
                        args.message ='You received '+txn.amount.toFixed(4) + ' '+txn.cryptoSymbol +'in your account and will be available for use the Depay app.'
                        depay.helpers.api.user(depay).sendPushProtocalNotification(args);
                    }
                }
            }
            callback(null, {status : true});
        },
        getTransaction: async function (args, callback) {
            var txns = await depay.models.api.paymentGateway.find({$or:[{"from":args.user.userId},{"to":args.user.userId}]},
                ['_id','fromDPN','type', 'status', 'userId', 'txHash', 'from', 'to', 'cryptoSymbol', 'createdOn','amount','isToken','isSendToDPN','isEscrow','notes','isExpired','usdAmount','_updated_at'],
                {

                    sort: {
                        createdOn: -1 //Sort by Date Created DESC
                    }
                });

            callback(null,txns);

        }
    }
}
module.exports = PaymentHelper;