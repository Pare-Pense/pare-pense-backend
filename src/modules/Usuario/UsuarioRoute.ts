import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarSchema.js';
import {
    criarUsuarioSchema,
    atualizaUsuarioSchema,
    atualizaSenhaSchema,
} from './UsuarioSchema.js';
import { UsuarioController } from './UsuarioController.js';

const routes = Router();
const usuarioController = new UsuarioController();

routes.get('/:id', usuarioController.recuperaUsuario);
routes.post(
    '/criarUsuario',
    validarSchema(criarUsuarioSchema),
    usuarioController.criarUsuario,
);
routes.patch(
    '/:id',
    validarSchema(atualizaUsuarioSchema),
    usuarioController.atualizaUsuario,
);
routes.patch(
    '/:id/senha',
    validarSchema(atualizaSenhaSchema),
    usuarioController.atualizaSenhaUsuario,
);
routes.delete('/:id', usuarioController.deletaUsuario);
