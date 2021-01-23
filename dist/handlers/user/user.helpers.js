"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validEmail = exports.validPassword = exports.validUsername = void 0;
exports.validUsername = (username) => {
    const r = /^([a-zA-Z0-9-_]{3,})$/.test(username);
    return r;
};
exports.validPassword = (password) => {
    if (password.length > 5)
        return true;
    return false;
};
exports.validEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};
//# sourceMappingURL=user.helpers.js.map