let fs = require('fs');
let usernamesFile = "./users.json";

let users = {};
let fileLocked = false;

function loadUsers() {
    fs.readFile(usernamesFile, (err, data) => {
        if(err) throw err;
        users = JSON.parse(data);
    });
}

function saveUsers () {
    if(!fileLocked) {
        fileLocked = true;
        let json = JSON.stringify(users);
        fs.writeFile(usernamesFile, json, 'utf8', function(err) {
            if(err) throw err;
            fileLocked = false;
        });
    }
}

function registerUser(msg) {
    let userID = msg.chat.id;
    if(userID in users) {
        return "You are already registered!";
    }
    let user = msg.from  
    users[userID] = user;
    user.address = "";
    user.activated = false;
    saveUsers();
    return "Thank you for registering! Continue with /addAddress <YOUR_ADDRESS> to start getting free XEM!";
}

function setUserAddress(user, address) {
    if(user == undefined) {
        return "Register first to set your address.";
    }
    if(address == undefined) {
        return "No address found. Insert you address with the command /addAddress <YOUR_ADDRESS>";
    }
    let strippedAddress = address.replace(/-/g, "");
    if(strippedAddress[0] != 'T' || strippedAddress.length != 40) {
        return "Invalid address! Make sure to insert your TestNet ADDRESS (starts with 'T')!";
    }
    user.address = strippedAddress;
    saveUsers();
    return "Address set! Now use /getXEM to get your XEM! Be sure the check the encrypted message which comes with the XEM ;)"
}

function getUser(userID) {
    return users[userID];
}

function activateUser(address) {
    Object.keys(users).forEach( function (x) {
        let strippedAddress = users[x].address.replace(/-/g, "");
        if(strippedAddress == address) {
            users[x].activated = true;
            saveUsers();
            return users[x];
        }
    });
    return 0;
}

function getUserList() {
    return Object.keys(users);
}

module.exports = {
    getUserList,
    registerUser,
    setUserAddress,
    loadUsers,
    getUser,
    activateUser
}