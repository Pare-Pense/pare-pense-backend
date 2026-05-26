# pare-pense-backend

## Requisitos

Para esse projeto é necessário ter instalado o pnpm na versão 11.3.0 e o docker.

## Instalação

```
pnpm install
```

## Execução

Para a execução correta do projeto é necessário executar os passos abaixo:

### 1. Instalação da imagem do docker

Preencha as variáveis do .env baseado no [.env.example](.env.example)

```
docker compose up -d
```

### 2. Estruturação do banco de dados

Considerando que você já preencheu o .env corretamente com a url do banco de dados, execute o código abaixo:

```
pnpm exec prisma db push
```

### 3. Gerar o Prisma Client

```
pnpm exec prisma generate
```

Após esses passos, basta se basear nos scripts do package.json para execução do projeto.
