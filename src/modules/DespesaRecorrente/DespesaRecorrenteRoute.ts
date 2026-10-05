import { Router, type Request, type Response } from 'express';
import { DespesaRecorrenteController } from './DespesaRecorrenteController.js';
import {
    atualizarDespesaRecorrenteSchema,
    criarDespesaRecorrenteSchema,
} from './DespesaRecorrenteSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const despesaRecorrenteController = new DespesaRecorrenteController();

routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaRecorrenteController.listarDespesasRecorrentes(req, res),
);

routes.post(
    '/cadastrarDespesaRecorrente',
    validarSchema(criarDespesaRecorrenteSchema),
    validarAuth((req) => req.body.idUsuario),
    (req: Request, res: Response) =>
        despesaRecorrenteController.cadastrarDespesaRecorrente(req, res),
);

routes.patch(
    '/:idUsuario/:idDespesaRecorrente',
    validarSchema(atualizarDespesaRecorrenteSchema),
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaRecorrenteController.atualizarDespesaRecorrente(req, res),
);

routes.patch(
    '/:idUsuario/:idDespesaRecorrente/pausar',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaRecorrenteController.pausarDespesaRecorrente(req, res),
);

routes.patch(
    '/:idUsuario/:idDespesaRecorrente/reativar',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaRecorrenteController.reativarDespesaRecorrente(req, res),
);

routes.delete(
    '/:idUsuario/:idDespesaRecorrente',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaRecorrenteController.deletarDespesaRecorrente(req, res),
);

export const despesaRecorrenteRoutes = routes;
