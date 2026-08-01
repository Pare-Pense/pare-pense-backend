# Pare&Pense

## 📋 Introdução

O projeto Pare&Pense foi desenvolvido para a disciplina de Projeto 1 do curso de Ciências da Computação da Universidade Federal de Campina Grande. Trata de um sistema de controle financeiro para pessoas que possuem hábitos de gastos compulsivos, podendo organizar suas finanças e receber alertas sobre possíveis gastos compulsivos.

## 🛠️ Requisitos

Para esse projeto é necessário ter instalado o pnpm na versão 11.3.0 e o docker.

## ✅ Execução local

### 1. Instalação de dependências

```
pnpm install
```

### 2. Instalação da imagem do docker

Preencha as variáveis do .env baseado no [.env.example](.env.example)

```
docker compose up -d
```

### 3. Estruturação do banco de dados

Considerando que você já preencheu o .env corretamente com a url do banco de dados, execute um dos códigos abaixo:

- Caso esteja realizando uma instalação do zero:

```
pnpm exec prisma migrate deploy
```

- Caso já tenha baixado o projeto anteriormente e vai atualizar o banco com alterações:

```
pnpm exec prisma migrate dev
```

### 4. Gerar o Prisma Client

```
pnpm exec prisma generate
```

### 5. Execução

```
pnpm dev
```

Obs: Para a execução do frontend basta ir até o repositório da [interface](https://github.com/Pare-Pense/pare-pense-frontend) e seguir os passos lá descritos.

## ✒️ Autores

<table>
    <tr>
      <td align="center" width="190px" height="160px">
         <img src="https://avatars.githubusercontent.com/u/128195146?v=4" alt="Aline Profile Image" width="60"></img>
         </br>
         <a href="https://github.com/alinebmr">@alinebmr</a>
         <br>Aline Brito</br>
      </td>
      <td align="center" width="190px" height="160px">
         <img src="https://avatars.githubusercontent.com/u/64997111?v=4" alt="Filipe Luiz Profile Image" width="60"></img>
         </br>
         <a href="https://github.com/FLuiz22">@FLuiz22</a>
         <br>Filipe Luiz</br>
      </td>
      <td align="center" width="190px" height="160px">
         <img src="https://avatars.githubusercontent.com/u/130506942?v=4" alt="Mateus Faria Profile Image" width="60"></img>
         </br>
         <a href="https://github.com/mateusmf4">@mateusmf4</a>
         <br>Mateus Faria</br>
      </td>
      <td align="center" width="190px" height="160px">
         <img src="https://avatars.githubusercontent.com/u/127061916?v=4" alt="Paulo Lunguinho Profile Image" width="60"></img>
         </br>
         <a href="https://github.com/Paulo-Lunguinho">@Paulo-Lunguinho</a>
         <br>Paulo Lunguinho</br>
      </td>
   </tr>
</table>
