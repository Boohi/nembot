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
    if(users[userID].first_name === msg.from.first_name) {
        return 0;
    }
    let user = msg.from  
    users[userID] = user;
    user.publicKey = "";
    user.activated = false;
    saveUsers();
}

function setUserPublicKey(user, pKey) {
    user.publicKey = pKey;
    saveUsers();
}

function getUser(userID) {
    return users[userID];
}

function activateUser(pKey) {
    Object.keys(users).forEach( function (x) {
        if(users[x].publicKey == pKey) {
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
    setUserPublicKey,
    loadUsers,
    getUser,
    activateUser
}