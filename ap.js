//This module help to listen request
var express = require('express');
var app = express();
var task_code = '';
var ToAddress = '';
var FromAddress = '';
var PrivateKey = '';
var NoToken = '';
var NoEther = '';

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
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
var abiArray = abi;
//Deployed contract address on Ropsten testnet
var contractAddress = "0x6A5A304D8b0675D74665A3162353b1F5440B23d1"; //For mainnet have to deploy new one.
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

    switch (task_code) {
        case 'Create': Create(res); break;
        case 'getEther': getEther(res,ToAddress); break;
        case 'getToken': getToken(res,ToAddress); break;
        case 'TokenTransfer': TokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey); break;
        case 'EtherTransfer': EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey); break;

        default:
            res.contentType('application/json');
            res.end(JSON.stringify("PriorityEx node is ready..."));
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
            res.contentType('application/json');
            res.end(JSON.stringify((Number(result))));
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
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
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