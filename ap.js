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
web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/metamask"));
//web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/metamask")); //For mainnet
//ABI of standard ERC20 token contract  from https://www.ethereum.org/token
var abi = [{"constant":false,"inputs":[{"name":"receiver","type":"address"}],"name":"invest","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"MIN_GOAL","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endsAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investedAmountOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"fundTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_GOAL","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TokenPerETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokensSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"weiRefunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"time","type":"uint256"}],"name":"setEndsAt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reFunding","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokenAmountOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"startsAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"finalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_state","type":"string"},{"name":"_startsAt","type":"uint256"},{"name":"_endsAt","type":"uint256"},{"name":"_TokenPerETH","type":"uint256"}],"name":"setCrowdsaleData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"investorCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"},{"indexed":false,"name":"tokenAmount","type":"uint256"}],"name":"Invested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"endsAt","type":"uint256"}],"name":"EndsAtChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldValue","type":"uint256"},{"indexed":false,"name":"newValue","type":"uint256"}],"name":"RateChanged","type":"event"}]
var abiArray = abi;
//Deployed contract address on Ropsten testnet
var contractAddress = "0xE5F865Bf1bf57fbA7Fe6df2946afD16610b75218"; //For mainnet have to deploy new one.
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
    ParentAddress = req.query.ParentAddress;
    Percent = req.query.Percent;

    if(task_code == "TokenPerETH"){
        TokenPerETH(res);
    }else{
        if(task_code == "tokensSold"){
            tokensSold(res);
        }else{
            if(task_code == "weiRefunded"){
                weiRefunded(res);
            }else{
                if(task_code == "state"){
                    state(res);
                }else{
                    if(task_code == "investorCount"){
                        investorCount(res);
                    }else{
                        if(task_code == "tokenAmountOf"){
                            tokenAmountOf(res,ToAddress);
                        }else{
                            if(task_code == "investedAmountOf"){
                                investedAmountOf(res,ToAddress);
                            }else{
                                if(task_code == "buy"){
                                    BuyToken(res,NoEther,FromAddress,PrivateKey);
                                }else{
                                            res.contentType('application/json');
                                            res.end(JSON.stringify("EBanker_ICO node is ready..."));
                                        }                                
                                    
                            }
                        }
                    }
                }
            }
        }
    }
});
//Get token sell Price for the contract address provided above
function TokenPerETH(res){
    contract.TokenPerETH((err, result) => {
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
//Get token sell Price for the contract address provided above
function tokensSold(res){
    contract.tokensSold((err, result) => {
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
//Get token sell Price for the contract address provided above
function weiRefunded(res){
    contract.weiRefunded((err, result) => {
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
//Get token buy Price for the contract address provided above
function state(res){
    contract.state((err, result) => {
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
function investorCount(res){
    contract.investorCount((err, result) => {
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
//Get number of token on "ToAddress" for the contract address and ABI provided above
function tokenAmountOf(res,ToAddress){
    contract.tokenAmountOf(ToAddress, (err, result) => {
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
function investedAmountOf(res,ToAddress){
    contract.investedAmountOf(ToAddress, (err, result) => {
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
//Buy token of the contract address provided above by "NoEther" ether form "FromAddress".
function BuyToken(res,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.buy.getData();
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 90000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": web3.toHex(NoEther),
        "data": data,
        "chainId": 0x03
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
        }
    );
}
if (module === require.main) {
    // Start the server
    var server = app.listen(process.env.PORT || 8085, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });
}
module.exports = app;