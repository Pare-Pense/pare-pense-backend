import type { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validarSchema = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map((iss) => ({
                        campo: iss.path.join('.'),
                        mensagem: iss.message,
                    })),
                });
                return;
            }
            res.status(500).json({ erro: 'Erro interno de validação' });
        }
    };
};
