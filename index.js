/**
 * API Middleware
 * Criado por: Luiz Henrique Krainski
 * Versão: 1.0.0
 * Descrição: API Middleware para integração com COB Cloud
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet()); // Adiciona vários cabeçalhos HTTP para segurança
app.use(express.json({ limit: '10kb' })); // Limita o tamanho do payload
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Limitação de taxa
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por IP por janela
});
app.use(limiter);

// Configuração CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'token_company', 'token_client'],
    credentials: true
};
app.use(cors(corsOptions));

// Middleware de logging aprimorado
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Configuração do PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:SENHA@localhost:5432/postgres'
});//TODO: Mude a sua senha aqui do seu banco

// Criação da tabela refinada
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INT,
    bank TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Cria a tabela ao iniciar
pool.query(createUsersTable).then(() => {
    console.log('Tabela users pronta!');
}).catch(console.error);

// Criação da tabela para webhooks
const createWebhooksTable = `
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    event_type TEXT,
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Cria a tabela de webhooks ao iniciar
pool.query(createWebhooksTable).then(() => {
    console.log('Tabela webhooks pronta!');
}).catch(console.error);

// Configuração base da API COB Cloud
const COB_CLOUD_BASE_URL = 'https://api-v3.cob.cloud';

// Middleware para autenticação da API COB Cloud
const cobCloudAuth = async (req, res, next) => {
    try {
        const tokenCompany = process.env.COB_CLOUD_TOKEN_COMPANY;
        const tokenClient = process.env.COB_CLOUD_TOKEN_CLIENT;
        
        if (!tokenCompany || !tokenClient) {
            return res.status(401).json({ error: 'Tokens não configurados' });
        }

        // Adiciona os tokens ao request para uso nas chamadas da API
        req.tokenCompany = tokenCompany;
        req.tokenClient = tokenClient;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Erro na autenticação', details: err.message });
    }
};

// Endpoint para listar devedores
app.get('/cli/devedores/listar', cobCloudAuth, async (req, res) => {
    try {
        const response = await fetch(`${COB_CLOUD_BASE_URL}/cli/devedores/listar`, {
            headers: {
                'Content-Type': 'application/json',
                'token_company': req.tokenCompany,
                'token_client': req.tokenClient
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar devedores', details: err.message });
    }
});

// Endpoint para listar títulos
app.get('/cli/titulos/listar', cobCloudAuth, async (req, res) => {
    try {
        const response = await fetch(`${COB_CLOUD_BASE_URL}/cli/titulos/listar`, {
            headers: {
                'Content-Type': 'application/json',
                'token_company': req.tokenCompany,
                'token_client': req.tokenClient
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar títulos', details: err.message });
    }
});

// Endpoint para listar ocorrências
app.get('/cli/ocorrencias/listar', cobCloudAuth, async (req, res) => {
    try {
        const response = await fetch(`${COB_CLOUD_BASE_URL}/cli/ocorrencias/listar`, {
            headers: {
                'Content-Type': 'application/json',
                'token_company': req.tokenCompany,
                'token_client': req.tokenClient
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar ocorrências', details: err.message });
    }
});

// Endpoint para listar prestações
app.get('/cli/prestacoes/listar', cobCloudAuth, async (req, res) => {
    try {
        const response = await fetch(`${COB_CLOUD_BASE_URL}/cli/prestacoes/listar`, {
            headers: {
                'Content-Type': 'application/json',
                'token_company': req.tokenCompany,
                'token_client': req.tokenClient
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar prestações', details: err.message });
    }
});

// Endpoint para listar devoluções
app.get('/cli/devolucoes/listar', cobCloudAuth, async (req, res) => {
    try {
        const response = await fetch(`${COB_CLOUD_BASE_URL}/cli/devolucoes/listar`, {
            headers: {
                'Content-Type': 'application/json',
                'token_company': req.tokenCompany,
                'token_client': req.tokenClient
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar devoluções', details: err.message });
    }
});

// Endpoint para receber webhooks
app.post('/webhook', async (req, res) => {
    try {
        const { event_type, payload } = req.body;

        // Validação básica do payload
        if (!event_type || !payload) {
            return res.status(400).json({ error: 'Payload inválido' });
        }

        // Salva o webhook no banco de dados
        await pool.query(
            'INSERT INTO webhooks (event_type, payload) VALUES ($1, $2)',
            [event_type, payload]
        );

        // Processa o webhook baseado no tipo de evento
        switch (event_type) {
            case 'titulo_criado':
                await processarTituloCriado(payload);
                break;
            case 'titulo_atualizado':
                await processarTituloAtualizado(payload);
                break;
            case 'ocorrencia_criada':
                await processarOcorrenciaCriada(payload);
                break;
            case 'prestacao_criada':
                await processarPrestacaoCriada(payload);
                break;
            case 'devolucao_criada':
                await processarDevolucaoCriada(payload);
                break;
            default:
                console.log(`Evento não processado: ${event_type}`);
        }

        res.json({ success: true, message: 'Webhook recebido e processado' });
    } catch (err) {
        console.error('Erro ao processar webhook:', err);
        res.status(500).json({ error: 'Erro ao processar webhook', details: err.message });
    }
});

// Funções de processamento de webhooks
async function processarTituloCriado(payload) {
    console.log('Processando título criado:', payload);
    
}

async function processarTituloAtualizado(payload) {
    console.log('Processando título atualizado:', payload);
    // TODO: Implemente a lógica específica para títulos atualizados 
}

async function processarOcorrenciaCriada(payload) {
    console.log('Processando ocorrência criada:', payload);
    
}

async function processarPrestacaoCriada(payload) {
    console.log('Processando prestação criada:', payload);
    
}

async function processarDevolucaoCriada(payload) {
    console.log('Processando devolução criada:', payload);
    
}

// Endpoint para listar webhooks recebidos
app.get('/webhooks', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM webhooks ORDER BY created_at DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar webhooks', details: err.message });
    }
});

// Endpoint para verificar status do banco de dados
app.get('/db-status', async (req, res) => {
    try {
        // Verifica conexão com o banco
        const client = await pool.connect();
        
        // Obtém estatísticas das tabelas
        const usersStats = await client.query('SELECT COUNT(*) as total FROM users');
        const webhooksStats = await client.query('SELECT COUNT(*) as total FROM webhooks');
        
        // Obtém o último webhook recebido
        const lastWebhook = await client.query(
            'SELECT event_type, created_at FROM webhooks ORDER BY created_at DESC LIMIT 1'
        );

        // Libera o cliente
        client.release();

        // Monta o objeto de resposta
        const status = {
            status: 'online',
            timestamp: new Date().toISOString(),
            database: {
                connection: 'connected',
                tables: {
                    users: {
                        total: parseInt(usersStats.rows[0].total)
                    },
                    webhooks: {
                        total: parseInt(webhooksStats.rows[0].total),
                        last_received: lastWebhook.rows[0] ? {
                            event_type: lastWebhook.rows[0].event_type,
                            created_at: lastWebhook.rows[0].created_at
                        } : null
                    }
                }
            }
        };

        res.json(status);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: err.message
        });
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        error: 'Erro Interno do Servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
    });
});

// Middleware de validação de entrada
const validateWebhookPayload = (req, res, next) => {
    const { event_type, payload } = req.body;
    
    if (!event_type || typeof event_type !== 'string') {
        return res.status(400).json({ error: 'Tipo de evento inválido' });
    }
    
    if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Payload inválido' });
    }
    
    next();
};

// Aplica validação ao endpoint de webhook
app.post('/webhook', validateWebhookPayload, async (req, res) => {
    // ... existing webhook code ...
});

// Adiciona cabeçalhos de segurança a todas as respostas
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
}); 