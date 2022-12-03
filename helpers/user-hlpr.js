'use strict';

var _ = require('lodash');
var axios = require('axios');
const moment = require("moment/moment");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});
var  PushAPI = require ("@pushprotocol/restapi");
var ethers = require("ethers");
var Web3 = require('web3');
const DePayGateway_ABI =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"senderId","type":"uint256"},{"indexed":true,"internalType":"address","name":"destinationAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimFundTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"senderId","type":"uint256"},{"indexed":true,"internalType":"address","name":"destinationAddress","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimTokenTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"senderId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"destinationId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiresOn","type":"uint256"}],"name":"FundAddedToEscrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"address","name":"destinationAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"destinationId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RefundFundTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"destinationId","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RefundTokenTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"senderId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"destinationId","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiresOn","type":"uint256"}],"name":"TokenAddedToEscrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"address","name":"destinationAddress","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenTransfered","type":"event"},{"inputs":[],"name":"_acceptAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"address payable","name":"destinationAddress","type":"address"}],"name":"claimFundAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"address payable","name":"destinationAddress","type":"address"},{"internalType":"address","name":"token","type":"address"}],"name":"claimToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"escrowFundPayments","outputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"address payable","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"expiryTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"escrowTokenPayments","outputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"address payable","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"expiryTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"getId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"}],"name":"refundFundAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"address","name":"token","type":"address"}],"name":"refundToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"}],"name":"sendFundAmountToEscorw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"destinationAddress","type":"address"}],"name":"sendFundAmountToWallet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"senderId","type":"uint256"},{"internalType":"uint256","name":"destinationId","type":"uint256"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendTokenToEscorw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"destinationAddress","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendTokenToWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentExpiryPeriod","type":"uint256"}],"name":"setPaymentExpiryPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"}]
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));

var UserHelper = function (depay) {
    return {

        userStatus: async function (args, callback) {
            try {
                var user = await depay.models.api.user.findOne({walletAddress: args.body.walletAddress.toLowerCase()});
                 if(user){
                     const result = await axios.get(
                         'https://api.covalenthq.com/v1/80001/address/'+args.body.walletAddress+'/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key='+process.env.COVALENT_API,
                         {
                             headers: {},
                         }
                     );
                     const isPushProtocolSubscribed = await PushAPI.user.getSubscriptions({
                         user: 'eip155:+'+process.env.CHAIN_ID+':'+args.body.walletAddress,
                         env: process.env.BUILD
                     });
                     var isPushProtocolEnabled =_.filter(isPushProtocolSubscribed, {channel:process.env.PUSH_CHANNEL_ADDRESS });
                     isPushProtocolEnabled = isPushProtocolEnabled.length > 0 ? true :false;
                     callback(null, {status:true,data:{balance:result.data,user:user,isPushProtocolEnabled:isPushProtocolEnabled}});
                 }else{
                     callback(null, {status:false});
                 }
            } catch (e) {
                console.log(e)
                callback(null,  {status:false});
            }
        },
        phoneNumberStatus: async function (args, callback) {
            try {
                var user = await depay.models.api.user.findOne({phoneNumber: args.body.phoneNumber});
                if(user){
                    callback(null, {status:true,data:user});
                }else{
                    callback(null, {status:false});
                }
            } catch (e) {
                console.log(e)
                callback(null,  {status:false});
            }
        },
        sendOtp: async function (args, callback) {
            try{
                await client.verify
                    .services(process.env.TWILIO_VERIFICATION_TOKEN)
                    .verifications.create({
                        to:  args.body.phoneNumber,
                        channel: 'sms',
                        locale: 'en',
                    }).then(verification => console.log(verification.status))
                    .catch(error => {
                        return callback(null, {status:true,message :'Invalid PhoneNumber'});
                    });
                callback(null, {status:true,message :'OTP has been sent'});
            }catch (e) {
                 callback(null, {status:true,message :'Invalid PhoneNumber'});
            }
        },
        verifyOtp: async function (args, callback) {
            await client.verify.services(process.env.TWILIO_VERIFICATION_TOKEN)
                .verificationChecks
                .create({
                    to: args.body.phoneNumber,
                    code: args.body.code
                })
                .then(async check => {
                    if(check.status == "approved"){
                        this.verifyPolygonId(args,callback);
                    }else{
                        callback(null, {status:false,message :'Verification failed'});
                    }
                })
                .catch(error => {
                    console.log(error);
                    callback(null, {status:false,message :'Verification failed'});
                });
        },
        verifyPolygonId: async function (args, callback) {
            try{
                const authToken = await axios.post(
                    'https://api-staging.polygonid.com/v1/orgs/sign-in',
                    {email: process.env.POLYGONID_EMAIL ,password:process.env.POLYGONID_PASSWORD},
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                var expireDate = moment().add(1, 'year').format("YYYY/MM/DD");
                const claimOffer = await axios.post(
                    'https://api-staging.polygonid.com/v1/issuers/5415e816-7be8-4891-9551-6708016e3e13/schemas/9b55517b-4d28-4c01-91c3-05da64b2230e/offers',
                    {
                        "attributes": [
                            {
                                "attributeKey": "phone",
                                "attributeValue": Number(args.body.phoneNumber.replace('+',''))
                            }
                        ],
                        "expirationDate": expireDate,
                        "limitedClaims": 1
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":"Bearer "+authToken.data.token
                        },
                    });

                const createQr = await axios.post(
                    'https://api-staging.polygonid.com/v1/offers-qrcode/'+claimOffer.data.id,
                    {

                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":"Bearer "+authToken.data.token
                        },
                    });

                const downloadQr = await axios.get(
                    'https://api-staging.polygonid.com/v1/offers-qrcode/'+claimOffer.data.id+'/download?sessionID='+createQr.data.sessionID,
                    {
                        responseType: 'arraybuffer'
                    },

                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":"Bearer "+authToken.data.token
                        }
                    });
                var base64str = Buffer.from(downloadQr.data, 'binary').toString('base64');
                var user = await depay.models.api.user.findOne({phoneNumber: args.body.phoneNumber});
                if(user){
                    await depay.models.api.user.updateOne(
                        {phoneNumber: args.body.phoneNumber},
                        {$set: {qrCode: base64str}});
                }else{
                    let contract = new web3.eth.Contract(DePayGateway_ABI,process.env.DePayGatewayAddress);
                    let itemId =  contract.methods.getId(args.body.phoneNumber.replace('+','')).call();
                    itemId.then(async response => {
                        let user = await depay.models.api.user.create({
                            phoneNumber: args.body.phoneNumber,
                            walletAddress: args.body.walletAddress.toLowerCase(),
                            qrCode: base64str,
                            userId :response
                        });
                    }).catch((error) => {
                        console.log(response)
                    });

                }
                args.title ="Wallet Associated";
                args.message ="Wallet Associated Successfully";
                this.sendPushProtocalNotification(args);
                callback(null, {status:true,data:base64str});
            }catch (e) {
                console.log(e)
            }
        },
        sendPushProtocalNotification: async function (args) {
            const PK = process.env.PUSH_CHANNEL_SECRET_KEY; // channel private key
            const Pkey = `0x${PK}`;
            const signer = new ethers.Wallet(Pkey);
            try {
                const apiResponse = await PushAPI.payloads.sendNotification({
                    signer,
                    type: 3, // target
                    identityType: 2, // direct payload
                    notification: {
                        title: `Depay`,
                        body: `Depay`
                    },
                    payload: {
                        title: args.title,
                        body: args.message
                    },
                    recipients: 'eip155:'+process.env.CHAIN_ID+':'+args.body.walletAddress, // recipient address
                    channel: 'eip155:'+process.env.CHAIN_ID+':'+process.env.PUSH_CHANNEL_ADDRESS,
                    env: process.env.BUILD
                });

            } catch (err) {
                console.error('Error: ', err);
            }
        }
    };
};


module.exports = UserHelper;