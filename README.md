# Guia de Inicialização dos Microserviços

Este documento descreve o passo a passo para levantar os três microserviços na ordem correta: **Frete**, **Produto** e **Pedido**.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (versão 16 ou superior)
- Docker e Docker Compose (opcional para bancos de dados)
- PostgreSQL/MySQL (ou outro banco de dados relacional configurado)
- NPM

---

## Clonando o projeto

1. Clone o repositório do projeto
   ```sh
   git clone https://github.com/gabrielpsn/product-service.git

## 1️⃣ Subindo o Microserviço de Frete

1. acessando o serviço de frete:
   ```sh
   cd freight-service
   ```
2. Instale as dependências:

   ```sh
   npm install

   ```

3. Inicie o serviço:
   ```sh
   npm start
   ```
4. O serviço estará disponível em: `http://localhost:4003`

5. OBS: Este serviço é apenas um mock.

---

## 2️⃣ Subindo o Microserviço de Produtos

1. acessar o serviço de produtos:
   ```sh
   cd product-service
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o banco de dados no arquivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=password
   DB_NAME=seubanco
   PORT=4001
   ```
4. Execute as migrações do banco:
   ```sh
   npm run migrate
   ```
5. Inicie o serviço:
   ```sh
   npm start
   ```
6. O serviço estará disponível em: `http://localhost:4001`

---

## 3️⃣ Subindo o Microserviço de Pedidos

1. acesse o serviço de pedidos:
   ```sh
   cd order-service
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o banco de dados no arquivo `.env`:

   ```env
   DB_NAME=seubanco
   DB_USER=root
   DB_PASS=password
   DB_HOST=localhost
   DB_DIALECT=mysql
   PORT=4002
   BASE_URL_API_PRODUCT_SERVICE=http://localhost:4001/api/products
   BASE_URL_API_SHIPPING_SERVICE=http://localhost:4003/calculate
   ZIP_CODE_ORIGIN=01000-000
   ```

````
4. Execute as migrações do banco:
   ```sh
   npm run migrate
   ````

5. Inicie o serviço:
   ```sh
   npm start
   ```
6. O serviço estará disponível em: `http://localhost:4002`

---

## Testando a Integração

Após subir todos os microserviços, execute as seguintes verificações:

- Teste se o serviço de produtos responde corretamente:

  ```sh
  curl http://localhost:4001/api-docs/
  ```

  ```

  ```

- Teste se o serviço de pedidos responde corretamente e se está integrando com os outros serviços:
  ```sh
  curl http://localhost:4002/api-docs/
  ```

Caso algum serviço não funcione, verifique os logs e as configurações do `.env`.

---

## Autor

Desenvolvido por Gabriel. 🚀
