"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterDB = exports.Mixed = exports.ObjectId = exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.Schema = mongoose_1.default.Schema;
exports.ObjectId = mongoose_1.default.SchemaTypes.ObjectId;
exports.Mixed = mongoose_1.default.SchemaTypes.Mixed;
const schema = new exports.Schema({
    "name": {
        "type": String
    },
    "banner": String,
    "dexNumber": Number,
    "released": Boolean,
    "facepic": {
        "type": String
    },
    "type": [],
    "energyGain": [],
    "hitPoints": {
        "type": Number
    },
    "description": {
        "type": String
    },
    "skills": {
        "type": [
            exports.Schema.Types.Mixed
        ]
    }
});
exports.CharacterDB = mongoose_1.default.model('character', schema);
//# sourceMappingURL=character.js.map