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
                Account = nemLibrary.Account;
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

let transactionHttp = new TransactionHttp();
let account = Account.createWithPrivateKey(config.privateKey);

let bot = new Telegraf(config.botToken);

dataService.loadUsers();

bot.command('start', ctx => {
    dataService.registerUser(ctx);
    ctx.reply("My address is " + config.address);
});

bot.command('addPublicKey', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let pKey = ctx.message.text.split(" ")[1];

    dataService.setUserPublicKey(user, pKey);
});

bot.command('getXEM', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let XEMamount = new XEM(1);

    if(user.activated === true) {
        XEMamount = new XEM(2);
    }
    
    let recipientPublicAccount = PublicAccount.createWithPublicKey(user.publicKey);
    let encryptedMessage = account.encryptMessage("Send a encrypted message 'secret message' to my address (" + config.address + ") to receive even more XEM next time!", recipientPublicAccount)
    let transferTransaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        recipientPublicAccount.address,
        XEMamount,
        encryptedMessage
    );
    
    let signedTransaction = account.signTransaction(transferTransaction);
    
    transactionHttp.announceTransaction(signedTransaction).subscribe( x => console.log(x));
});
let address = new Address(config.address);
let confirmedTransactionListener = new UnconfirmedTransactionListener().given(address);
confirmedTransactionListener.subscribe(x => {
    let recipientPublicAccount = PublicAccount.createWithPublicKey(x.signer.publicKey);
    let decryptedMessage = account.decryptMessage(x.message, recipientPublicAccount);
    if(decryptedMessage.payload == "secret message") {
        dataService.activateUser(x.signer.publicKey);
    }
}, err => {
    console.log(err);
});

bot.startPolling();


module.exports = {
}