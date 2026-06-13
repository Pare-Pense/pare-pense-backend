import { verificarTokenUser } from '../lib/auth.js';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function validarAuth(paramIdUsuario: string): RequestHandler;
export function validarAuth(getter: (req: Request) => string): RequestHandler;

export function validarAuth(arg: string | ((req: Request) => string)) {
    const getIdUsuario =
        typeof arg === 'string'
            ? (req: Request) => req.params[arg] as string
            : arg;
    return (req: Request, res: Response, next: NextFunction) => {
        const idUsuario = getIdUsuario(req);
        const token = req.headers.authorization?.split(' ')?.[1];

        if (idUsuario === undefined || idUsuario === '') {
            return res.status(400).json({ erro: 'ID de usuário inválido' });
        }

        if (token === undefined || token === '') {
            return res.status(401).json({ erro: 'Token não está presente' });
        }

        if (!verificarTokenUser(token, idUsuario)) {
            return res.status(401).json({ erro: 'Token inválido' });
        }

        next();
    };
}
