import * as express from 'express';
import * as bodyParser from 'body-parser'; //use to parse the form data that you pass in the request
import { CreateDid } from "./routes/create-did";
import { DeleteDid } from "./routes/delete-did";
import { RegisterDid } from "./routes/register-did-on-polygon";
import { ResolveDid } from "./routes/resolve-did";
import { UpdateDid } from "./routes/update-did";
import { RegisterTransabilityDid } from "./routes/update-transability";
import * as swaggerDocument from '../swagger.json';
import * as swaggerUi from 'swagger-ui-express';
import * as cors from 'cors';


class App {

    public app: express.Application;

    public createDidRoutes: CreateDid = new CreateDid();
    public deleteDidRoutes: DeleteDid = new DeleteDid();
    public registerDidRoutes: RegisterDid = new RegisterDid();
    public resolveDidRoutes: ResolveDid = new ResolveDid();
    public updateDidRoutes: UpdateDid = new UpdateDid();
    public registerTransabilityDid: RegisterTransabilityDid = new RegisterTransabilityDid();
    constructor() {
        this.app = express(); //TK
        this.config();

        this.createDidRoutes.routes(this.app);
        this.deleteDidRoutes.routes(this.app);
        this.registerDidRoutes.routes(this.app);
        this.resolveDidRoutes.routes(this.app);
        this.updateDidRoutes.routes(this.app);
        this.registerTransabilityDid.routes(this.app);
    }

    private config(): void {

        this.app.use('/index', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.text())
        this.app.use(cors())
    }

}

export default new App().app;
