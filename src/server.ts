import express from 'express';
import { routes as usuarioRoutes } from './modules/Usuario/UsuarioRoute.js';
import { despesaRoutes } from './modules/Despesa/DespesaRoute.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/despesas', despesaRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
