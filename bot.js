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
let accountAddress = account.address.value;

let bot = new Telegraf(config.botToken);

dataService.loadUsers();

bot.command('start', ctx => {
    dataService.registerUser(ctx);
    ctx.reply("Thank you for registering! Continue with /addPublicKey <YOUR_PUBLIC_KEY> to start getting free XEM!");
});

bot.command('addPublicKey', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let pKey = ctx.message.text.split(" ")[1];

    dataService.setUserPublicKey(user, pKey);
    ctx.reply("Public key set! Now use /getXEM to get your XEM! Be sure the check the encrypted message which comes with the XEM ;)");
});

bot.command('getXEM', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let XEMamount = 1;

    if(user.activated === true) {
        XEMamount = 2;
    }
    
    let recipientPublicAccount = PublicAccount.createWithPublicKey(user.publicKey);
    let encryptedMessage = account.encryptMessage("Send a encrypted message 'secret message' to my address (" + accountAddress + ") to receive even more XEM next time!", recipientPublicAccount)
    let transferTransaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        recipientPublicAccount.address,
        new XEM(XEMamount),
        encryptedMessage
    );
    
    let signedTransaction = account.signTransaction(transferTransaction);
    
    transactionHttp.announceTransaction(signedTransaction).subscribe( x => {
        ctx.reply(XEMamount + " XEM sent!");
    });
});
let address = new Address(accountAddress);
let confirmedTransactionListener = new ConfirmedTransactionListener().given(address);
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