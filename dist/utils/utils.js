"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
function handleError(res, error) {
    if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message });
    }
    res.status(500).json({ error });
}
exports.handleError = handleError;
//# sourceMappingURL=utils.js.map