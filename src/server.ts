import express from 'express';
import { routes as usuarioRoutes } from './modules/Usuario/UsuarioRoute.js';
import { despesaRoutes } from './modules/Despesa/DespesaRoute.js';
import { receitaRoutes } from './modules/Receita/ReceitaRoute.js';
import { notificacaoRoutes } from './modules/Notificacao/NotificacaoRoute.js';
import { categoriaRoutes } from './modules/Categoria/CategoriaRoute.js';
import { despesaRecorrenteRoutes } from './modules/DespesaRecorrente/DespesaRecorrenteRoute.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    }),
);

app.use('/usuarios', usuarioRoutes);
app.use('/despesas', despesaRoutes);
app.use('/receitas', receitaRoutes);
app.use('/notificacoes', notificacaoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/despesas-recorrentes', despesaRecorrenteRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
