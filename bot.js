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
    dataService.registerUser(ctx);
    ctx.reply("Thank you for registering! Continue with /addAddress <YOUR_ADDRESS> to start getting free XEM!");
});

bot.command('addAddress', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let address = ctx.message.text.split(" ")[1];

    dataService.setUserAddress(user, address);
    ctx.reply("Address set! Now use /getXEM to get your XEM! Be sure the check the encrypted message which comes with the XEM ;)");
});

bot.command('getXEM', ctx => {
    let user = dataService.getUser(ctx.from.id);
    let XEMamount = 1;
    if(user.activated === true) {
        XEMamount = 2;
    }
    let transferTransaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        new Address(user.address),
        new XEM(XEMamount),
        PlainMessage.create("Send a encrypted message 'secret message' to my address (" + accountAddress + ") to receive even more XEM next time!")
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
        dataService.activateUser(x.signer.address.value);
    }
}, err => {
    console.log(err);
});

bot.startPolling();


module.exports = {
}