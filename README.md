# API Middleware

Criado por: Luiz Henrique Krainski

## Descrição
Esta é uma API middleware que integra com os serviços COB Cloud, fornecendo endpoints seguros para gerenciamento de devedores, títulos, ocorrências, prestações e devoluções. A API inclui suporte a webhooks para processamento de eventos em tempo real.

## Recursos de Segurança
- Limitação de taxa para prevenir abusos
- Validação e sanitização de entrada
- Cabeçalhos de segurança (Helmet)
- Proteção CORS
- Limites de tamanho de requisição
- Tratamento de erros aprimorado
- Logging seguro

## Pré-requisitos
- Node.js >= 14.0.0
- Banco de dados PostgreSQL
- Credenciais da API COB Cloud

## Variáveis de Ambiente
Crie um arquivo `.env` com as seguintes variáveis:
```
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco
COB_CLOUD_TOKEN_COMPANY=seu_token_empresa
COB_CLOUD_TOKEN_CLIENT=seu_token_cliente
ALLOWED_ORIGINS=http://localhost:3000,https://seudominio.com
NODE_ENV=development
```

## Instalação
1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure suas variáveis de ambiente
4. Inicie o servidor:
```bash
npm start
```

## Endpoints da API

### Endpoints que Requerem Autenticação
- GET `/cli/devedores/listar` - Lista devedores
- GET `/cli/titulos/listar` - Lista títulos
- GET `/cli/ocorrencias/listar` - Lista ocorrências
- GET `/cli/prestacoes/listar` - Lista prestações
- GET `/cli/devolucoes/listar` - Lista devoluções

### Endpoints de Webhook
- POST `/webhook` - Recebe eventos de webhook
- GET `/webhooks` - Lista webhooks recebidos

### Endpoints do Sistema
- GET `/db-status` - Verifica status do banco de dados

## Considerações de Segurança
- Todos os endpoints são protegidos por limitação de taxa
- Validação de entrada é aplicada em todos os endpoints
- Dados sensíveis não são registrados em logs
- CORS está configurado para permitir apenas origens específicas
- Payloads de requisição são limitados para prevenir abusos

## Estrutura do Webhook
Exemplo de payload para teste:
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

## Monitoramento
- Logs detalhados de todas as requisições
- Rastreamento de tempo de resposta
- Monitoramento de erros
- Status do banco de dados

## Suporte
Para suporte ou dúvidas, entre em contato com o autor.

## Licença
MIT License

## Autor
Luiz Henrique Krainski 