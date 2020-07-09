const Crypto = require("crypto");
const ENCRYPTION_KEY = "*G-KaPdRgUkXp2s5v8y/B?E(H+MbQeTh";
const IV = Buffer.alloc(16, 0);

// https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

exports.encrypt = function(text) {
    let cipher = Crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let crypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function(text) {
    let decipher = Crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};