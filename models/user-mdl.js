/**
 * Created by DePay on 03/12/22.
 */
var mongoose = require('mongoose');

var PaymentsSchema = new mongoose.Schema({
    walletAddress:  {type :String},
    phoneNumber:  {type :String},
    userId:  {type :String},
    qrCode:  {type :String},
    worldId:  {type :String},
    polygonId:  {type :String},
    createdOn: {type : Date, default: Date.now()},
    updatedOn: {type : Date, default: Date.now()},
},{ versionKey: false });
module.exports = mongoose.model('user', PaymentsSchema, 'users');

