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
var newBuyPrice = '';
var ParentAddress = '';
var Percent = '';


//This module standard library for Ethereum Network.
const Web3 = require("web3");
const web3 = new Web3();
//This module library for Ethereum Transaction.
const Tx = require("ethereumjs-tx");
//This module library for Ethereum Accounts.
var Web3EthAccounts = require('web3-eth-accounts');
//Set Provider to make able to perform task on ethereum ROPSTEN TEST network. https:
//web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/metamask"));
web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/metamask")); //For mainnet
//ABI of standard ERC20 token contract  from https://www.ethereum.org/token
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleAgent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_crowdsaleAgent","type":"address"}],"name":"setCrowdsaleAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"releaseTokenTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"released","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"}]
var abiArray = abi;
//Deployed contract address on Ropsten testnet
var contractAddress = "0x5E7c65D1422cd29c46735ac71514eC5364cC339e"; //For mainnet have to deploy new one.
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
    newBuyPrice = req.query.newBuyPrice;
    ParentAddress = req.query.ParentAddress;
    Percent = req.query.Percent;

    switch (task_code) {
        case 'Create': Create(res); break;
        case 'getEther': getEther(res,ToAddress); break;
        case 'getToken': getToken(res,ToAddress); break;
        case 'released': released(res); break;
        case 'crowdsaleAgent': crowdsaleAgent(res); break;
        case 'buyPrice': buyPrice(res); break;
        case 'setPrices': setPrices(res,newBuyPrice,FromAddress,PrivateKey); break;
        case 'TokenTransfer': TokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey); break;
        case 'EtherTransfer': EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey); break;
        case 'buy': BuyToken(res,NoEther,FromAddress,PrivateKey); break;
        case 'mintToken': mintToken(res,ToAddress,NoToken,FromAddress,PrivateKey); break;
        case 'transferOwnership': transferOwnership(res,ToAddress,FromAddress,PrivateKey); break;
        case 'setCrowdsaleAgent': setCrowdsaleAgent(res,ToAddress,FromAddress,PrivateKey); break;
        case 'releaseTokenTransfer': releaseTokenTransfer(res,FromAddress,PrivateKey); break;

        default:
            res.contentType('application/json');
            res.end(JSON.stringify("EBanker Token node is ready..."));
    }

});

//Create a acount and return address and private-key.
function Create(res){
    //var account = new Web3EthAccounts('http://ropsten.infura.io/t2utzUdkSyp5DgSxasQX');
    var account = new Web3EthAccounts('https://mainnet.infura.io/t2utzUdkSyp5DgSxasQX');
    res.contentType('application/json');
    res.end(JSON.stringify(account.create()));
}
//Get balance(Ether) on this "ToAddress".
function getEther(res,ToAddress){
    var balance = web3.eth.getBalance(ToAddress);
    res.contentType('application/json');
    res.end(JSON.stringify((balance.toNumber())));
}
//Get number of token on "ToAddress" for the contract address and ABI provided above
function getToken(res,ToAddress){
    contract.balanceOf(ToAddress, (err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
        else{
            //console.log(err);
        }
    });
}
//Get status for token can transfer.
function released(res){
    contract.released((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify(result));
        }
        else{
            //console.log(err);
        }
    });
}
//Get crowdsaleAgent.
function crowdsaleAgent(res){
    contract.crowdsaleAgent((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify(result));
        }
        else{
            //console.log(err);
        }
    });
}
//Get token buy Price for the contract address provided above
function buyPrice(res){
    contract.buyPrice((err, result) => {
        if (!err){
            //console.log(result);
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
        }
        else{
            //console.log(err);
        }
    });
}
//Set token sell and buy Prices for the contract address provided above
function setPrices(res,newBuyPrice,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.setPrices.getData(newBuyPrice);
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
            //console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Transfer "NoToken" token of the contract address provided above form "FromAddress" to "ToAddress" .
function TokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.transfer.getData(ToAddress, NoToken);
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
            //console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Transfer "NoEther" ether form "FromAddress" to "ToAddress" .
function EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.transfer.getData(ToAddress, NoEther);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": ToAddress,
        "value": web3.toHex(NoEther),
        "data": data,
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            //console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Buy token of the contract address provided above by "NoEther" ether form "FromAddress".
function BuyToken(res,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.buy.getData();
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
//mintToken "NoToken" Token and send to "ToAddress".
function mintToken(res,ToAddress,NoToken,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.mintToken.getData(ToAddress, NoToken);
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
            //console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else{
            //console.log(err);
        }
    });
}
//Transfer Ownership to "ToAddress".
function transferOwnership(res,ToAddress,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.transferOwnership.getData(ToAddress);
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
//Set Crowdsale Agent to "ToAddress".
function setCrowdsaleAgent(res,ToAddress,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.setCrowdsaleAgent.getData(ToAddress);
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
//Transfer Ownership to "ToAddress".
function releaseTokenTransfer(res,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.releaseTokenTransfer.getData();
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