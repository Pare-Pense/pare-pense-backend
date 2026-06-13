import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarSchema.js';
import {
    criarUsuarioSchema,
    atualizaUsuarioSchema,
    atualizaSenhaSchema,
    loginUsuarioSchema,
} from './UsuarioSchema.js';
import { UsuarioController } from './UsuarioController.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const usuarioController = new UsuarioController();

routes.get('/:id', validarAuth('id'), usuarioController.recuperaUsuario);
routes.post(
    '/criarUsuario',
    validarSchema(criarUsuarioSchema),
    usuarioController.criarUsuario,
);
routes.patch(
    '/:id',
    validarAuth('id'),
    validarSchema(atualizaUsuarioSchema),
    usuarioController.atualizaUsuario,
);
routes.patch(
    '/:id/senha',
    validarAuth('id'),
    validarSchema(atualizaSenhaSchema),
    usuarioController.atualizaSenhaUsuario,
);
routes.delete('/:id', validarAuth('id'), usuarioController.deletaUsuario);
routes.post(
    '/login',
    validarSchema(loginUsuarioSchema),
    usuarioController.loginUsuario,
);

export { routes };
