import 'dotenv/config';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set');
}
const secret = process.env.JWT_SECRET!;

export function criarTokenUser(idUsuario: string): string {
    return jwt.sign(
        {
            sub: idUsuario,
        },
        secret,
        {
            expiresIn: '1d',
        },
    );
}

export function verificarTokenUser(token: string, idUsuario: string): boolean {
    try {
        const payload = jwt.verify(token, secret) as jwt.JwtPayload;

        return payload.sub === idUsuario;
    } catch (_) {
        return false;
    }
}
