# API Middleware com Webhooks

API middleware para processamento de webhooks e integração com COB Cloud.

## Configuração Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis necessárias no arquivo `.env`

## Deploy no Railway

### 1. Preparação
- Crie uma conta no [Railway](https://railway.app)
- Instale o [Railway CLI](https://docs.railway.app/develop/cli) (opcional)

### 2. Configuração do Projeto no Railway
1. Crie um novo projeto no Railway
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no Railway:
   - `DATABASE_URL`: URL do banco PostgreSQL (o Railway pode provisionar um para você)
   - `COB_CLOUD_TOKEN_COMPANY`: Token da sua empresa
   - `COB_CLOUD_TOKEN_CLIENT`: Token do cliente
   - `PORT`: O Railway vai definir automaticamente

### 3. Deploy
1. Faça commit das alterações no seu repositório:
```bash
git add .
git commit -m "Preparando para deploy no Railway"
git push origin main
```

2. O Railway detectará automaticamente as mudanças e iniciará o deploy

### 4. Verificação do Deploy
1. Após o deploy, o Railway fornecerá uma URL para sua aplicação
2. Teste os endpoints:
   - Status da API: `https://sua-url-railway.up.railway.app/db-status`
   - Webhook: `https://sua-url-railway.up.railway.app/webhook`
   - Lista de Webhooks: `https://sua-url-railway.up.railway.app/webhooks`

### 5. Configuração do Webhook
1. Atualize a URL do webhook no seu sistema para apontar para a nova URL do Railway
2. Formato do payload para teste:
```json
{
  "event_type": "titulo_criado",
  "payload": {
    "id": 123,
    "valor": 1000.00,
    "data_vencimento": "2024-03-20",
    "status": "novo"
  }
}
```

### 6. Monitoramento
- Acesse o dashboard do Railway para:
  - Ver logs em tempo real
  - Monitorar uso de recursos
  - Verificar status do deploy
  - Gerenciar variáveis de ambiente

## Endpoints Disponíveis

- `GET /db-status`: Verifica o status do banco de dados
- `POST /webhook`: Recebe webhooks
- `GET /webhooks`: Lista webhooks recebidos
- `GET /cli/devedores/listar`: Lista devedores
- `GET /cli/titulos/listar`: Lista títulos
- `GET /cli/ocorrencias/listar`: Lista ocorrências
- `GET /cli/prestacoes/listar`: Lista prestações
- `GET /cli/devolucoes/listar`: Lista devoluções

## Suporte

Em caso de problemas:
1. Verifique os logs no Railway
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste localmente antes de fazer deploy
4. Verifique a conexão com o banco de dados 