//This module help to listen request
var express = require('express');
var app = express();
var task_code = '';
var ToAddress = '';
var FromAddress = '';
var ContractAddress = '';
var PrivateKey = '';
var NoToken = '';
var NoEther = '';
var newSellPrice = '';
var newBuyPrice = '';
var Value = '';

//This module standard library for Ethereum Network.
const Web3 = require("web3");
const web3 = new Web3();
//This module library for Ethereum Transaction.
const Tx = require("ethereumjs-tx");
//This module library for Ethereum Accounts.
var Web3EthAccounts = require('web3-eth-accounts');
//Set Provider to make able to perform task on ethereum ROPSTEN TEST network. https:
web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/metamask"));
//web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/metamask")); //For mainnet
//ABI of standard ERC20 token contract  from https://www.ethereum.org/token
var abi = [{"constant":true,"inputs":[],"name":"endsAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investedAmountOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TokenPerETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokensSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRefunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"time","type":"uint256"}],"name":"setEndsAt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reFunding","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"startsAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"finalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"time","type":"uint256"}],"name":"setStartsAt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"investorCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"},{"indexed":false,"name":"tokenAmount","type":"uint256"}],"name":"Invested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"startsAt","type":"uint256"}],"name":"StartsAtChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"endsAt","type":"uint256"}],"name":"EndsAtChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldValue","type":"uint256"},{"indexed":false,"name":"newValue","type":"uint256"}],"name":"RateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Refund","type":"event"}];
var abiArray = abi;
//Deployed contract address on Ropsten testnet
var contractAddress = "0xe644293110d0661f2900AE0e13b523B67FfEEEf6"; //For mainnet have to deploy new one.
//Make a variable to access contract's function
var contract =  web3.eth.contract(abiArray).at(contractAddress);
app.get('/', function (req, res) {
//To specify what to do and run that function.
    task_code = req.query.task;
    ToAddress = req.query.ToAddress;
    FromAddress = req.query.FromAddress;
    PrivateKey = req.query.PrivateKey;
    NoToken = req.query.NoToken;
    NoEther = req.query.NoEther;
    newSellPrice = req.query.newSellPrice;
    newBuyPrice = req.query.newBuyPrice;
    Value = req.query.Value;

    switch (task_code) {
        case 'TokenPerETH': TokenPerETH(res); break;
        case 'tokensSold': tokensSold(res); break;
        case 'weiRaised': weiRaised(res); break;
        case 'weiRefunded': weiRefunded(res); break;
        case 'startsAt': startsAt(res); break;
        case 'endsAt': endsAt(res); break;
        case 'finalized': finalized(res); break;
        case 'investorCount': investorCount(res); break;
        case 'investedAmountOf': investedAmountOf(res,ToAddress); break;
        case 'buy': BuyToken(res,ToAddress,NoEther,FromAddress,PrivateKey); break;
        case 'setStartsAt': setStartsAt(res,Value,FromAddress,PrivateKey); break;
        case 'setEndsAt': setEndsAt(res,Value,FromAddress,PrivateKey); break;
        case 'setRate': setRate(res,Value,FromAddress,PrivateKey); break;
        case 'finalize': finalize(res,ToAddress,FromAddress,PrivateKey); break;
        case 'kill': kill(res,FromAddress,PrivateKey); break;

        default:
            res.contentType('application/json');
            res.end(JSON.stringify("Trabet Coin ICO node is ready..."));
    }
});
//Get token Price per Ethereum.
function TokenPerETH(res){
    contract.TokenPerETH((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
    });
}
//Get number of tokens sold.
function tokensSold(res){
    contract.tokensSold((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
    });
}
//Get number of wei Raised.
function weiRaised(res){
    contract.weiRaised((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
    });
}
//Get amount that refunded.
function weiRefunded(res){
    contract.weiRefunded((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
    });
}

//Get Crowdsale Start time.
function startsAt(res){
    contract.startsAt((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
  });
}
//Get Crowdsale Start time.
function endsAt(res){
    contract.endsAt((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
  });
}

//Get MIN_GOAL_EBC.
function finalized(res){
    contract.finalized((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
  });
}
//Get nomber of Investor.
function investorCount(res){
    contract.investorCount((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
  });
}

//Get number of Ether invested by "ToAddress".
function investedAmountOf(res,ToAddress){
    contract.investedAmountOf(ToAddress, (err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
    });
}
//Buy token of the contract address provided above by "NoEther" ether form "FromAddress".
function BuyToken(res,ToAddress,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.buy.getData(ToAddress);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": web3.toHex(NoEther),
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Set Crowdsale Start time.
function setStartsAt(res,Value,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.setStartsAt.getData(Value);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": web3.toHex(NoEther),
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Set Crowdsale end Price for token.
function setRate(res,Value,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.setRate.getData(Value);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": web3.toHex(NoEther),
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//finalize Crowdsale.
function finalize(res,ToAddress,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.finalize.getData(ToAddress);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": web3.toHex(NoEther),
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Kill Crowdsale Contract.
function kill(res,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.kill.getData();
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
if (module === require.main) {
    // Start the server
    var server = app.listen(process.env.PORT || 8085, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });
}
module.exports = app;
