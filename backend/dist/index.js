"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const todo_routes_1 = __importDefault(require("./routes/todo.routes"));
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/todos', todo_routes_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});
