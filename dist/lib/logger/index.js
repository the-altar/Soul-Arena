"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
exports.log = bunyan_1.default.createLogger({
    name: "SA",
    src: process.env.NODE_ENV === "dev" ? true : false,
});
//# sourceMappingURL=index.js.map