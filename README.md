🎬 UNIFECAP FLIX - API de Controle de Filmes
📌 Descrição

Este projeto consiste no desenvolvimento de uma API RESTful para gerenciamento de filmes, utilizando Node.js, Express, Prisma ORM e MySQL.

A aplicação permite listar, buscar e filtrar filmes, seguindo boas práticas de desenvolvimento como arquitetura MVC e padrão REST.

🚀 Tecnologias Utilizadas
Node.js
Express
Prisma ORM
MySQL
Cors
Body-parser

🔗 Endpoints da API

Base URL:

http://localhost:3000/v1/controle-filmes
📌 Listar todos os filmes
GET /filme
📌 Buscar filme por ID
GET /filme/:id
📌 Filtrar filmes por nome ou sinopse
GET /filtro/filme?nome=xxx
🧠 Padrões Utilizados
🔹 MVC (Model-Controller)
Model: responsável pelo acesso ao banco de dados
Controller: responsável pela lógica das requisições
View: não se aplica (API)
🔹 REST
Uso correto dos métodos HTTP
Organização de rotas
Retorno em JSON
🔹 Status HTTP
200 → Sucesso
201 → Criado
404 → Não encontrado
500 → Erro interno
🎨 Front-end (Opcional)

O sistema pode ser integrado a um front-end estilo Netflix, com:

Tema escuro
Grid de filmes
Cards com efeito hover
Consumo da API via fetch
👨‍💻 Autor

Desenvolvido por Aleff Blendon

📌 Observações
O projeto segue boas práticas de organização e separação de responsabilidades
A conexão com o banco é feita via variável de ambiente (.env)
O Prisma ORM é utilizado para facilitar a comunicação com o banco de dados
🚀 RESULTADO

✔ API funcional
✔ Código organizado
✔ Pronto para entrega
✔ Fácil de apresentar