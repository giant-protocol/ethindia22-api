
var moment = require('moment');
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
            if(args.toUser){
                args.body.walletAddress = args.user.walletAddress;
                args.title ="DEPAY Received";
                args.message ='You received '+args.body.amount.toFixed(4) + ' '+args.body.cryptoSymbol +'  in your account and will be available for use the Depay app.'
                this.sendPushProtocalNotification(args);
            }
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
            var response = {};
            var received = [];
            var send = [];
            var all = [];

            var escrow = [];
            var txns = await depay.models.api.paymentGateway.find({$or:[{"from":args.user.userId},{"to":args.user.userId}]},
                ['_id','fromDPN','type', 'status', 'userId', 'txHash', 'from', 'to', 'cryptoSymbol', 'createdOn','amount','isToken','isSendToDPN','isEscrow','notes','isExpired','usdAmount','_updated_at'],
                {
                    sort: {
                        createdOn: -1 //Sort by Date Created DESC
                    }
                });
            txns.map(val =>{
                var json = {};
                json.status = val.status;
                json.usdAmount = val.usdAmount;
                json.id = val._id;
                json.user = val.user;
                json.txHash = val.txHash !== undefined ? val.txHash :'none';
                json.isExpired =  val.isExpired;
                json.from = val.from;
                json.to = val.to;
                json.cryptoSymbol = val.cryptoSymbol;
                json.createdOn = val.createdOn;
                json.amount = val.amount;
                json.isToken = val.isToken;
                json.isSendToDPN = val.isSendToDPN;
                json.isEscrow = val.isEscrow;
                json.notes = val.notes;
                json.type = val.type;
                json.fromDPN = val.fromDPN;
                if(val.isEscrow === true){
                    if(val.status === 'success' && val.type === 'sent' && val.isExpired === false){
                        var end = moment();
                        var startTime = moment(val._updated_at);
                        var mins = end.diff(startTime, 'minutes');
                        if(mins > 10080){
                            json.isExpired =  true;
                        }
                    }
                    escrow.push(json);
                    all.push(json);
                }else if((val.type === 'sent') && val.from === args.user.userId){
                    all.push(json);
                    send.push(json);
                }else if(val.type !== 'request' && val.to === args.user.userId ){
                    received.push(json);
                    all.push(json);
                }
            });
            response.send = send;
            response.received = received;
            response.all = all;
            response.escrow = escrow;
            callback(null, response);
        }
    }
}
module.exports = PaymentHelper;