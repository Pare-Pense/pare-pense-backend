import express from 'express';
import { routes as usuarioRoutes } from './modules/Usuario/UsuarioRoute.js';
import { despesaRoutes } from './modules/Despesa/DespesaRoute.js';
import { receitaRoutes } from './modules/Receita/ReceitaRoute.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use('/usuarios', usuarioRoutes);
app.use('/despesas', despesaRoutes);
app.use('/receitas', receitaRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
