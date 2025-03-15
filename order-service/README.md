# Microserviço de Pedido

Este é um microserviço responsável por gerenciar os pedidos, calcular o frete e controlar o status dos pedidos. Ele é parte de uma arquitetura de microsserviços, sendo independente e capaz de interagir com outros microsserviços, como o de **Produto** e **Frete**.

## Índice

- [Introdução](#introdução)
- [Arquitetura](#arquitetura)
- [Endpoints da API](#endpoints-da-api)
  - [Criar Pedido](#criar-pedido)
  - [Listar Pedidos](#listar-pedidos)
  - [Atualizar Status do Pedido](#atualizar-status-do-pedido)
  - [Cálculo de Frete](#cálculo-de-frete)
- [Exemplo de Fluxo de Criação de Pedido](#exemplo-de-fluxo-de-criação-de-pedido)
- [Estrutura de Dados](#estrutura-de-dados)
  - [Pedido](#pedido)
  - [Item](#item)
  - [Resposta do Cálculo de Frete](#resposta-do-cálculo-de-frete)
- [Banco de Dados](#banco-de-dados)
- [Testes Unitários](#testes-unitários)
- [Conclusão](#conclusão)

---

## Introdução

O **Microserviço de Pedido** gerencia todos os aspectos relacionados ao processo de pedidos, como a criação de pedidos, cálculo do frete, atualização do status dos pedidos e total do pedido. Este serviço é autônomo e se comunica com outros microsserviços por meio de APIs RESTful.

A arquitetura do serviço é baseada em uma API **RESTful** e utiliza o formato de troca de dados **JSON**. A autenticação é feita via **JWT (JSON Web Token)**.

---

## Arquitetura

A arquitetura do Microserviço de Pedido segue o padrão de microsserviços, com as seguintes características:

- **API RESTful**: Comunicação por HTTP com endpoints claros.
- **Axios**: Para consumo de APIs externas, como a de frete.
- **Banco de Dados**: Utiliza um banco relacional para armazenamento dos pedidos e itens.

---

## Endpoints da API

### Criar Pedido

- **URL**: `/api/orders`
- **Método**: `POST`
- **Corpo da Requisição**:

```json
{
  "customerId": 123,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 50
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 20
    }
  ],
  "shippingZipcode": "12345-678"
}
```
