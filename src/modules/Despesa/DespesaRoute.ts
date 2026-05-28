import { Router, type Request, type Response } from 'express';
import { DespesaController } from './DespesaController.js';
import { criarDespesaSchema, atualizarDespesaSchema } from './DespesaSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';

const routes: Router = Router();
const despesaController = new DespesaController();

routes.get('/:idUsuario/:idDespesa', (req: Request, res: Response) =>
    despesaController.recuperarDespesa(req, res),
);
routes.get('/:idUsuario', (req: Request, res: Response) =>
    despesaController.recuperarDespesasAll(req, res),
);
routes.post(
    '/cadastrarDespesa',
    validarSchema(criarDespesaSchema),
    (req: Request, res: Response) =>
        despesaController.cadastrarDespesa(req, res),
);
routes.patch(
    '/:idUsuario/:idDespesa',
    validarSchema(atualizarDespesaSchema),
    (req: Request, res: Response) =>
        despesaController.atualizarDespesa(req, res),
);
routes.delete('/:idUsuario/:idDespesa', (req: Request, res: Response) =>
    despesaController.deletarDespesa(req, res),
);

export const despesaRoutes = routes;
