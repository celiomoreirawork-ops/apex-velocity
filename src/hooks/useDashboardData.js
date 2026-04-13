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
            console.log(`Conectando ao SSE... (${API_BASE_URL}/api/events)`);
            
            if (eventSource) {
                eventSource.close();
            }

            eventSource = new EventSource(`${API_BASE_URL}/api/events`);

            eventSource.onopen = () => {
                console.log("Conectado");
                setStatus('live');
                setError(null);
            };

            eventSource.onmessage = (event) => {
                try {
                    if(!event.data || event.data === 'keep-alive') return;

                    const parsed = JSON.parse(event.data);
                    console.log(`Evento recebido: ${parsed.type}`);

                    if (parsed.type === 'SYNC' || parsed.type === 'UPDATE') {
                        console.log("Atualizando estado");
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
                console.error("[SSE] Erro na conexão. Usando fallback REST e tentando reconectar...", err);
                setStatus('reconnecting...');
                eventSource.close();
                
                // Fallback: faz fetch via REST endpoint enquanto SSE tenta voltar
                fetch(`${API_BASE_URL}/api/data`)
                    .then(r => r.json())
                    .then(res => {
                        if (res.success && res.data) {
                            console.log("[Fallback REST] Dados recebidos via API GET.");
                            setData(res.data);
                        }
                    })
                    .catch(e => console.error("[Fallback REST] Falha também na API REST:", e.message));

                clearTimeout(reconnectTimeout);
                reconnectTimeout = setTimeout(connect, 5000);
            };
        };

        // Fetch inicial garantido imediatamente antes da conexão SSE se concretizar (Zero Delay UX)
        fetch(`${API_BASE_URL}/api/data`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) {
                    console.log("[Init Fetch] Dados providos imediatamente pela API REST.");
                    setData(res.data);
                }
            })
            .catch(e => console.warn("[Init Fetch] API indisponível ou vazia no momento...", e.message))
            .finally(() => {
                // Inicia SSE na sequência
                connect();
            });

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
