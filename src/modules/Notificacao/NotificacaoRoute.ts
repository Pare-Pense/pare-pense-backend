import { Router, type Request, type Response } from 'express';
import { NotificacaoController } from './NotificacaoController.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const notificacaoController = new NotificacaoController();

routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        notificacaoController.recuperarNotificacoes(req, res),
);

routes.patch(
    '/:idUsuario/:idNotificacao/lida',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        notificacaoController.marcarComoLida(req, res),
);

routes.patch(
    '/:idUsuario/lidas',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        notificacaoController.marcarTodasComoLidas(req, res),
);

export const notificacaoRoutes = routes;
