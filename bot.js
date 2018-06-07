let Telegraf = require('telegraf');
let config = require('./config');

let dataService = require('./dataService');

let nemLibrary = require('nem-library');
let NEMLibrary = nemLibrary.NEMLibrary,
                Address = nemLibrary.Address,
                NetworkTypes = nemLibrary.NetworkTypes,
                TimeWindow = nemLibrary.TimeWindow,
                TransferTransaction = nemLibrary.TransferTransaction,
                TransactionHttp = nemLibrary.TransactionHttp,
                XEM = nemLibrary.XEM,
                EmptyMessage = nemLibrary.EmptyMessage,
                PlainMessage = nemLibrary.PlainMessage,
                PublicAccount = nemLibrary.PublicAccount,
                ConfirmedTransactionListener = nemLibrary.ConfirmedTransactionListener,
                UnconfirmedTransactionListener = nemLibrary.UnconfirmedTransactionListener,
                AccountHttp = nemLibrary.AccountHttp,
                Account = nemLibrary.Account;
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

let transactionHttp = new TransactionHttp();
let account = Account.createWithPrivateKey(config.privateKey);
let accountAddress = account.address.value;

let bot = new Telegraf(config.botToken);

dataService.loadUsers();

bot.command('start', ctx => {
    ctx.reply(dataService.registerUser(ctx));
});

bot.command('addAddress', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let address = ctx.message.text.split(" ")[1];
    ctx.reply(dataService.setUserAddress(user, address));
});

bot.command('getXEM', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let XEMamount = 1;
    if(user == undefined) {
        return ctx.reply("Register and set address before using this command.");
    }
    if(user.activated === true) {
        XEMamount = 2;
    }
    if(user.address[0] != 'T' || user.address.length != 40) {
        return ctx.reply("Make sure you've set correct address before using this command.")
    }
    try {
        let transferTransaction = TransferTransaction.create(
            TimeWindow.createWithDeadline(),
            new Address(user.address),
            new XEM(XEMamount),
            PlainMessage.create("Send a encrypted message 'secret message' to my address (" + accountAddress + ") to receive even more XEM next time!")
        );
        let signedTransaction = account.signTransaction(transferTransaction);

        transactionHttp.announceTransaction(signedTransaction).subscribe( x => {
            console.log(x);
            ctx.reply(XEMamount + " XEM sent!");
        });  
    } 
    catch(err) {
        console.log(err);
        return ctx.reply("Invalid address!")
    }
    
    

});
let address = new Address(accountAddress);
let confirmedTransactionListener = new ConfirmedTransactionListener().given(address);
confirmedTransactionListener.subscribe(x => {
    let recipientPublicAccount = PublicAccount.createWithPublicKey(x.signer.publicKey);
    let decryptedMessage = account.decryptMessage(x.message, recipientPublicAccount);
    if(decryptedMessage.payload == "secret message") {
        dataService.activateUser(x.signer.address.value);
    }
}, err => {
    console.log(err);
});

bot.startPolling();


module.exports = {
}