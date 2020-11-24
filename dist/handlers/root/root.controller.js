"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = exports.baseController = void 0;
exports.baseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile('index.html', { root: './public/main' });
});
exports.uploadController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json([{ "url": "/absolute/path/to/filename.png" }]);
});
//# sourceMappingURL=root.controller.js.map