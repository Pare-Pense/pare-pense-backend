import { Router, type Request, type Response } from 'express';
import { DespesaController } from './DespesaController.js';
import { criarDespesaSchema, atualizarDespesaSchema } from './DespesaSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { validarAuth } from '../../middlewares/validarAuth.js';
import multer from 'multer';

const routes: Router = Router();
const despesaController = new DespesaController();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

routes.get(
    '/media/:idUsuario/:periodo',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarSomaGastosPorCategoria(req, res),
);
routes.post(
    '/importarExtrato',
    upload.single('extrato'),
    despesaController.importarExtrato,
);

routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarDespesasAll(req, res),
);

routes.get(
    '/:idUsuario/:idDespesa',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        despesaController.recuperarDespesa(req, res),
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
