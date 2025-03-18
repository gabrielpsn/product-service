# Microserviço de Produtos

## Descrição

Este microserviço é responsável pelo gerenciamento de produtos e controle de estoque. Ele permite criar, atualizar, listar, buscar e deletar produtos, garantindo que o estoque seja devidamente controlado.

## Tecnologias Utilizadas

- Node.js
- Express
- Apollo Server (GraphQL)
- PostgreSQL/MySQL (ou outro banco de dados relacional)

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seuusuario/product-service.git
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd product-service
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

4. Configure o banco de dados no arquivo `.env`:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=secret
   DB_NAME=seubanco
   PORT=4001
   ```

5. Execute as migrações do banco:

   ```sh
   npm run migrete
   ```

6. Inicie o servidor:
   ```sh
   npm start
   ```

## Endpoints da API

### **Listar Produtos**

**GraphQL Query:**

```graphql
query {
  products {
    id
    name
    description
    price
    stock
  }
}
```

### **Buscar Produto por ID**

**GraphQL Query:**

```graphql
query {
  product(id: "1") {
    id
    name
    description
    price
    stock
  }
}
```

### **Criar Produto**

**GraphQL Mutation:**

```graphql
mutation {
  createProduct(
    input: {
      name: "Teclado Mecânico"
      description: "Teclado RGB"
      price: 250.00
      stock: 30
    }
  ) {
    id
    name
    stock
  }
}
```

### **Atualizar Produto**

**GraphQL Mutation:**

```graphql
mutation {
  updateProduct(id: "1", input: { stock: 25 }) {
    id
    name
    stock
  }
}
```

### **Deletar Produto**

**GraphQL Mutation:**

```graphql
mutation {
  deleteProduct(id: "1") {
    success
    message
  }
}
```

## Controle de Estoque

- O sistema permite reduzir ou aumentar a quantidade de estoque ao atualizar um produto.
- Caso a quantidade de estoque fique negativa, a operação será rejeitada.

## Executando Testes

```sh
npm test
```

## Autor

Desenvolvido por Gabriel. 🚀
