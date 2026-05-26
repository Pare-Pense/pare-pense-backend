import { z } from 'zod';

export const idSchema = z.object({
    id: z.uuid('O ID está em um formato inválido'),
});
