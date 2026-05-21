import express, { type Request, type Response } from 'express';

const app = express();
const PORT = 3000;

// Permite que o servidor entenda requisições em JSON
app.use(express.json());

// Rota de teste
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong! O servidor TypeScript está rodando!' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});