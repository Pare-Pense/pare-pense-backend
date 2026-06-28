import { Router, type Request, type Response } from 'express';
import { DespesaController } from './DespesaController.js';
import { criarDespesaSchema, atualizarDespesaSchema } from './DespesaSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const despesaController = new DespesaController();

routes.get(
    '/media/:idUsuario/:periodo',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarSomaGastosPorCategoria(req, res),
);

routes.get(
    '/:idUsuario/:periodo',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarDespesasPorPeriodoECategoria(req, res),
);

routes.get(
    '/:idUsuario/:idDespesa',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarDespesa(req, res),
);
routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarDespesasAll(req, res),
);
routes.post(
    '/cadastrarDespesa',
    validarSchema(criarDespesaSchema),
    validarAuth((req) => req.body.idUsuario),
    (req: Request, res: Response) =>
        despesaController.cadastrarDespesa(req, res),
);
routes.patch(
    '/:idUsuario/:idDespesa',
    validarSchema(atualizarDespesaSchema),
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.atualizarDespesa(req, res),
);
routes.delete(
    '/:idUsuario/:idDespesa',
    validarAuth('idUsuario'),
    (req: Request, res: Response) => despesaController.deletarDespesa(req, res),
);

export const despesaRoutes = routes;
