import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants/api';

export function useDashboardData() {
    const [data, setData] = useState({
        sheetTitle: '...',
        totais: { receita: 0, carrosVendidos: 0, ticketMedio: 0 },
        items: []
    });
    const [status, setStatus] = useState('connecting...'); 
    const [error, setError] = useState(null);

    useEffect(() => {
        let eventSource = null;
        let reconnectTimeout = null;

        const connect = () => {
            console.log(`[SSE] Tentando conectar em ${API_BASE_URL}/api/events...`);
            
            if (eventSource) {
                eventSource.close();
            }

            eventSource = new EventSource(`${API_BASE_URL}/api/events`);

            eventSource.onopen = () => {
                console.log("[SSE] Conexão estabelecida com sucesso.");
                setStatus('live');
                setError(null);
            };

            eventSource.onmessage = (event) => {
                try {
                    // Ignora keep-alive do servidor se vier no data
                    if(!event.data || event.data === 'keep-alive') return;

                    const parsed = JSON.parse(event.data);
                    console.log(`[SSE] Mensagem recebida: ${parsed.type}`);

                    if (parsed.type === 'SYNC' || parsed.type === 'UPDATE') {
                        setData(parsed.payload);
                        setStatus('live');
                    } else if(parsed.type === 'ERROR') {
                        setStatus('error');
                        setError(parsed.message);
                    }
                } catch (err) {
                    console.error("[SSE] Erro ao processar payload:", err);
                }
            };

            eventSource.onerror = (err) => {
                console.error("[SSE] Erro na conexão. Tentando reconectar em 5s...", err);
                setStatus('reconnecting...');
                eventSource.close();
                
                // Força uma reconexão manual após 5 segundos se o navegador não reconectar sozinho
                clearTimeout(reconnectTimeout);
                reconnectTimeout = setTimeout(connect, 5000);
            };
        };

        connect();

        return () => {
            console.log("[SSE] Limpando conexão no unmount...");
            if (eventSource) eventSource.close();
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
        };
    }, []);

    return { 
        data: data.items, 
        totais: data.totais, 
        sheetTitle: data.sheetTitle,
        status, 
        error 
    };
}
