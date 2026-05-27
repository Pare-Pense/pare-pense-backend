import { Router } from 'express';
import { DespesaController } from './DespesaController.js';
import { criarDespesaSchema, atualizarDespesaSchema } from './DespesaSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';

const routes: Router = Router();
const despesaController = new DespesaController();

routes.get('/:idUsuario/:idDespesa', despesaController.recuperarDespesa);
routes.post(
    '/cadastrarDespesa',
    validarSchema(criarDespesaSchema),
    despesaController.cadastrarDespesa,
);
routes.patch(
    '/:idUsuario/:idDespesa',
    validarSchema(atualizarDespesaSchema),
    despesaController.atualizarDespesa,
);
routes.delete('/:idUsuario/:idDespesa', despesaController.deletarDespesa);

export const despesaRoutes = routes;
