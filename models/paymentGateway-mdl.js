
/**
 * Created by DePay on 03/12/22.
 */
var mongoose = require('mongoose');
var PaymentGateWaySchema = new mongoose.Schema({
    type :{type : String},//Type =Send || Received || request || Review
    status :{type : String},//Status Hash
    userId :{type : String},//deviceId Created device
    txHash :{type : String},//TXn Hash
    from :{type : String},//From Phone Number id
    to :{type : String},//To Phone Number id
    fromDPN :{type : String},//fromDPN number
    cryptoSymbol :{type : String},//cryptoSymbol // ETH || token like USDT || USDC
    createdOn: {type: Date, default: Date.now},
    _updated_at: {type: Date ,default: Date.now},
    usdAmount: {type: Number, default: 0},
    amount: {type: Number, default: 0},
    isToken: {type: Boolean, default: false},
    isEscrow: {type: Boolean, default: false},
    isSendToDPN: {type: Boolean, default: false},
    isExpired: {type: Boolean, default: false},
},  { versionKey: false });
module.exports = mongoose.model('PaymentGateway', PaymentGateWaySchema);