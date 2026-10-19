# Bella Massa — projeto demonstrativo

Projeto React + Vite + TypeScript da demonstração da Pizzaria Bella Massa.

## Requisitos

- Node.js 20 ou superior
- pnpm 10 ou superior

## Como abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra a pasta extraída no VS Code.
3. Abra o terminal integrado nessa pasta.
4. Execute:

```bash
pnpm install
pnpm dev
```

5. Acesse o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

## Login local

A tela inicial usa `localStorage` apenas para diferenciar os perfis neste dispositivo.

### Comerciante

```text
Usuário: comerciante
Senha: 1234
```

O comerciante entra no painel de gestão.

### Cliente

Use a aba **Criar conta** para cadastrar nome, usuário/WhatsApp e senha. Depois do cadastro, o cliente é direcionado diretamente ao cardápio.

A sessão fica salva neste navegador. O botão de saída remove a sessão e retorna à tela de login.

## Rota de entrega

No painel do comerciante, abra um pedido de entrega e clique em **Abrir rota no Google Maps**. O sistema usa primeiro a latitude e longitude compartilhadas pelo cliente. Se não houver GPS, usa o endereço, número e bairro informados no pedido. O Maps abre em uma nova aba com modo de direção.

## Comandos úteis

```bash
pnpm check   # valida TypeScript
pnpm build   # gera build de produção
pnpm dev     # inicia o ambiente local
```

## Observações importantes

Esta é uma versão exclusivamente demonstrativa. Os dados da loja, Pix, telefone, pedidos e endereço são fictícios. O botão de pedido simula o envio e não envia mensagens reais para o WhatsApp. Não use esta versão para operação comercial ou pagamentos reais.

Os usuários, produtos, configurações e pedidos são armazenados apenas no `localStorage` do navegador. Não há autenticação real, banco de dados compartilhado ou proteção de senha para uso comercial. A integração com o Google Maps abre uma URL pública de navegação e não exige uma chave da API para esse fluxo básico.

As imagens são carregadas por URLs do armazenamento do protótipo. Para usar o projeto totalmente offline, substitua os caminhos de imagem em `client/src/pages/Home.tsx` por arquivos locais em uma pasta de assets.
