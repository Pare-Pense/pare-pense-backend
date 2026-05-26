import express from 'express';
import { routes as usuarioRoutes } from './modules/Usuario/UsuarioRoute.js';

const app = express();
const PORT = 3000;

// Permite que o servidor entenda requisições em JSON
app.use(express.json());

app.use('/usuarios', usuarioRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
