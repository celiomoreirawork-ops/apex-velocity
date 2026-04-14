import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

console.log("SERVIDOR INICIANDO...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import { fetchDashboardData } from './services/sheetsService.mjs';

const app = express();
const port = process.env.PORT || 3001;

// Cache setup: TTl limit 5 minutes (300 seconds)
// This ensures we have a fallback and protects against excessive memory issues
const dataCache = new NodeCache({ stdTTL: 300 });
const CACHE_KEY = 'apex_dashboard_data';

// Store all active SSE client connections
let clients = [];

app.use(cors());

// ---------------------------------------------------------
// Middleware for Server-Sent Events (SSE) Broadcast
// ---------------------------------------------------------
const broadcast = (data) => {
    if (clients.length === 0) return;
    
    console.log(`[SSE] Somando broadcast para ${clients.length} clientes conectados...`);
    clients.forEach(client => {
        try {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
            console.error(`[SSE] Falha ao enviar para cliente ${client.id}:`, err.message);
        }
    });
};

// ---------------------------------------------------------
// Polling Loop: Compare and Broadcast (A cada 30 segundos)
// ---------------------------------------------------------
const POLLING_INTERVAL_MS = 30000; // 30 seconds

const pollGoogleSheets = async () => {
    console.log("Executando polling...");
    try {
        console.log("\n[Loop] Verificando atualizações no Google Sheets...");
        const newData = await fetchDashboardData();
        
        const oldData = dataCache.get(CACHE_KEY);
        
        // Simples comparação de string via JSON para verificar se houve mudanças na tabela
        const newDataStr = JSON.stringify(newData.items);
        const oldDataStr = oldData ? JSON.stringify(oldData.items) : null;

        if (!oldData || oldDataStr !== newDataStr) {
            console.log("[Loop] DADOS ALTERADOS");
            dataCache.set(CACHE_KEY, newData);
            console.log("[Polling] Dados processados. Preparando broadcast...");
            broadcast({ type: 'UPDATE', payload: newData });
            console.log("[Polling] BROADCAST ENVIADO");
        } else {
            console.log("[Loop] SEM ALTERAÇÃO");
        }
    } catch (error) {
        console.error("[Loop] ❌ Falha crítica no ciclo de polling:", error.message);
    }
};

// Iniciar o polling em background
setInterval(pollGoogleSheets, POLLING_INTERVAL_MS);

// ---------------------------------------------------------
// Endpoints
// ---------------------------------------------------------

/**
 * 1. SSE Endpoint: Clients connect here to stay open for live updates
 */
app.get('/api/events', async (req, res) => {
    console.log(`[SSE] Tentativa de nova conexão...`);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add this new client to our list
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);
    
    console.log(`[SSE] Cliente conectado (ID: ${clientId}). Total: ${clients.length}`);

    // Send the current state immediately upon connection
    let currentData = dataCache.get(CACHE_KEY);
    if (!currentData) {
        try {
            console.log("[SSE] Cache vazio, buscando dados iniciais para novo cliente...");
            currentData = await fetchDashboardData();
            dataCache.set(CACHE_KEY, currentData);
        } catch (e) {
            console.error("[SSE] Erro ao puxar dados iniciais:", e.message);
        }
    }

    if (currentData) {
        res.write(`data: ${JSON.stringify({ type: 'SYNC', payload: currentData })}\n\n`);
    }

    // Ping every 30 seconds to keep connection alive
    const keepAliveId = setInterval(() => {
        if (!res.writableEnded) {
            res.write(': keep-alive\n\n');
        }
    }, 30000);

    // When client drops connection, clean up
    req.on('close', () => {
        console.log(`[SSE] Conexão fechada pelo cliente ${clientId}`);
        clearInterval(keepAliveId);
        clients = clients.filter(client => client.id !== clientId);
        console.log(`[SSE] Clientes restantes: ${clients.length}`);
    });
});

/**
 * 2. REST Endpoint: Polling fallback or initial direct fetch
 */
app.get('/api/data', async (req, res) => {
    try {
        let data = dataCache.get(CACHE_KEY);
        if (!data) {
            data = await fetchDashboardData();
            dataCache.set(CACHE_KEY, data);
        }
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
});

// Startup Server & Initial Fetch
app.listen(port, async () => {
    console.log(`🚀 Server running on port ${port} (CSV Polling Mode 🔄)`);
    // Warm up cache upon startup
    try {
        const data = await fetchDashboardData();
        dataCache.set(CACHE_KEY, data);
        console.log("Initial data loaded.");
    } catch (e) {
        console.error("Falha ao carregar dados iniciais:", e.message);
    }
});
