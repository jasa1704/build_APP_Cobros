"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const creditRoutes_1 = __importDefault(require("./routes/creditRoutes"));
const catalogRoutes_1 = __importDefault(require("./routes/catalogRoutes"));
const entryRoutes_1 = __importDefault(require("./routes/entryRoutes"));
const config_1 = __importDefault(require("./config"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', config_1.default.PORT); //se configura el puerto del servidor por popiedad o por defecto
        this.app.use(morgan_1.default('dev')); // se utiliza morgan para validar las peticiones en desarrollo
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json()); //definir el formato de los datos
        this.app.use(express_1.default.urlencoded({ extended: false })); //hanilitar llamados desde formularios
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/user', userRoutes_1.default);
        this.app.use('/api/agent', agentRoutes_1.default);
        this.app.use('/api/client/', clientRoutes_1.default);
        this.app.use('/api/login/', loginRoutes_1.default);
        this.app.use('/api/credit/', creditRoutes_1.default);
        this.app.use('/api/catalog/', catalogRoutes_1.default);
        this.app.use('/api/entry/', entryRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('server started on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
