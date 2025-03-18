# Microserviço de Pedidos

## Descrição

Este microserviço gerencia pedidos, permitindo criar, atualizar, listar e cancelar pedidos. Ele também mantém a relação dos pedidos com os produtos e garante a atualização do estoque no serviço de produtos.

## Tecnologias Utilizadas

- Node.js
- Express
- Apollo Server (GraphQL)
- PostgreSQL/MySQL (ou outro banco de dados relacional)
- Axios (para comunicação com o microserviço de produtos)

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seuusuario/order-service.git
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd order-service
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

4. Configure o banco de dados no arquivo `.env`:

   ```env

   DB_NAME=seubanco
   DB_USER=root
   DB_PASS=password
   DB_HOST=localhost
   DB_DIALECT=mysql
   PORT=4002
   ```

BASE_URL_API_PRODUCT_SERVICE=http://localhost:4001/api/products

BASE_URL_API_SHIPPING_SERVICE=http://localhost:4003/calculate
ZIP_CODE_ORIGIN=01000-000

````

5. Execute as migrações do banco:

```sh
npm run migrate
````

6. Inicie o servidor:
   ```sh
   npm start
   ```

## Endpoints da API

### **Listar Pedidos**

**GraphQL Query:**

```graphql
query {
  orders {
    id
    customerName
    items {
      productId
      quantity
    }
    totalAmount
    status
  }
}
```

### **Buscar Pedido por ID**

**GraphQL Query:**

```graphql
query {
  order(id: "1") {
    id
    customerName
    items {
      productId
      quantity
    }
    totalAmount
    status
  }
}
```

### **Criar Pedido**

**GraphQL Mutation:**

```graphql
mutation {
  createOrder(
    input: {
      customerName: "Gabriel Silva"
      items: [{ productId: "1", quantity: 2 }, { productId: "3", quantity: 1 }]
    }
  ) {
    id
    status
  }
}
```

### **Atualizar Pedido**

**GraphQL Mutation:**

```graphql
mutation {
  updateOrder(id: "1", input: { status: "Shipped" }) {
    id
    status
  }
}
```

### **Cancelar Pedido**

**GraphQL Mutation:**

```graphql
mutation {
  cancelOrder(id: "1") {
    success
    message
  }
}
```

## Controle de Estoque

- Sempre que um pedido é criado, o microserviço de pedidos se comunica com o **microserviço de produtos** para reduzir a quantidade no estoque.
- Caso o estoque seja insuficiente, a criação do pedido será rejeitada.
- Se um pedido for cancelado, o estoque será restaurado.

## Executando Testes

```sh
npm test
```

## Autor

Desenvolvido por Gabriel. 🚀
