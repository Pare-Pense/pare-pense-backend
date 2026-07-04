import { z } from 'zod';

export const idSchema = z.uuid('O ID está em um formato inválido');
