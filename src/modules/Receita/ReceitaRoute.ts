import { Router, type Request, type Response } from 'express';
import { ReceitaController } from './ReceitaController.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { atualizarReceitaSchema, criarReceitaSchema } from './ReceitaSchema.js';

const routes: Router = Router();
const receitaController = new ReceitaController();

routes.get('/:idUsuario/:idReceita', (req: Request, res: Response) =>
    receitaController.recuperarReceita(req, res),
);

routes.get('/:idUsuario', (req: Request, res: Response) =>
    receitaController.recuperarReceitasAll(req, res),
);

routes.post(
    '/cadastrarReceita',
    validarSchema(criarReceitaSchema),
    (req: Request, res: Response) =>
        receitaController.cadastrarReceita(req, res),
);

routes.patch(
    '/:idUsuario/:idReceita',
    validarSchema(atualizarReceitaSchema),
    (req: Request, res: Response) =>
        receitaController.atualizarReceita(req,res)
)

routes.delete('/:idUsuario/:idReceita', (req: Request, res: Response) =>
    receitaController.deletarReceita(req, res),
);

export const receitaRoutes = routes;
