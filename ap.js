//This module help to listen request
var express = require('express');
var app = express();
var task_code = '';
var ToAddress = '';
var FromAddress = '';
var PrivateKey = '';
var NoEther = '';

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
app.get('/', function (req, res) {
//To specify what to do and run that function.
    task_code = req.query.task;
    ToAddress = req.query.ToAddress;
    FromAddress = req.query.FromAddress;
    PrivateKey = req.query.PrivateKey;
    NoEther = req.query.NoEther;

    switch (task_code) {
        case 'Create': Create(res); break;
        case 'getEther': getEther(res,ToAddress); break;
        case 'EtherTransfer': EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey); break;

        default:
            res.contentType('application/json');
            res.end(JSON.stringify("Crypto Exchange node is ready..."));
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

//Transfer "NoEther" ether form "FromAddress" to "ToAddress" .
function EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 300000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": ToAddress,
        "value": web3.toHex(NoEther),
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