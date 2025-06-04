# COB Cloud API Middleware

Este é um middleware que integra com a API do COB Cloud, fornecendo endpoints para gerenciamento de cobranças, devedores, títulos e outros recursos.

## 🚀 Funcionalidades

- Listagem de devedores
- Listagem de títulos
- Listagem de ocorrências
- Listagem de prestações
- Listagem de devoluções
- Webhook para recebimento de eventos

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- Credenciais do COB Cloud:
  - Token da Assessoria (token_company)
  - Token do Cliente (token_client)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd api-middleware
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:[Senha]@localhost:5432/postgres
COB_CLOUD_TOKEN_COMPANY=seu_token_company
COB_CLOUD_TOKEN_CLIENT=seu_token_client
```

4. Inicie o servidor:
```bash
npm start
```

## 📡 Endpoints

### Listagem de Devedores
```http
GET /cli/devedores/listar
```

### Listagem de Títulos
```http
GET /cli/titulos/listar
```

### Listagem de Ocorrências
```http
GET /cli/ocorrencias/listar
```

### Listagem de Prestações
```http
GET /cli/prestacoes/listar
```

### Listagem de Devoluções
```http
GET /cli/devolucoes/listar
```

### Webhook
```http
POST /webhook
```

## 🔄 Webhook

O sistema inclui um endpoint de webhook que pode receber eventos do COB Cloud. Para configurar:

1. Configure a URL do webhook no painel do COB Cloud para apontar para:
```
http://seu-dominio/webhook
```

2. O webhook receberá eventos em formato JSON e os processará automaticamente.

## 🔒 Segurança

- Todos os endpoints são protegidos por autenticação via tokens
- Os tokens são gerenciados de forma segura através de variáveis de ambiente
- As requisições são validadas antes do processamento

## 📝 Logs

O sistema mantém logs de todas as requisições recebidas, incluindo:
- Data e hora
- Método HTTP
- URL acessada
- Status da resposta

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email] ou abra uma issue no repositório. 