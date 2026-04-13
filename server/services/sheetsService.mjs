/* global process */
import Papa from 'papaparse';

// Helper for Exponential Backoff on API Rate Limits/Network issues
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Node 18+ possui fetch nativo
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text(); // Retorna CSV como texto puro
        } catch (error) {
            if (attempt < maxRetries) {
                const backoffDelay = attempt * 2000; // 2s, 4s, 6s...
                console.warn(`[Network] Falha ao buscar CSV. Retentando em ${backoffDelay}ms (Tentativa ${attempt})`);
                await delay(backoffDelay);
            } else {
                throw error;
            }
        }
    }
}

export async function fetchDashboardData() {
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    
    if (!SPREADSHEET_ID) {
        throw new Error("SPREADSHEET_ID não definido no arquivo .env");
    }

    // URL Mágica de exportação CSV pública do Google Sheets
    let csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
    if (process.env.SHEET_GID) {
        csvUrl += `&gid=${process.env.SHEET_GID}`;
    }

    console.log(`[Polling] Iniciando busca de dados via CSV: ${csvUrl}`);

    // 1. Buscar a string CSV pela URL com resiliência
    let csvString;
    try {
        csvString = await fetchWithRetry(csvUrl);
        console.log(`[Polling] CSV recebido com sucesso (${csvString.length} bytes)`);
    } catch (error) {
        console.error(`[Polling] Erro fatal ao buscar CSV: ${error.message}`);
        throw error;
    }

    // 2. Usar PapaParse para transformar CSV em vetor de Objetos
    console.log(`[Polling] Iniciando parsing do CSV...`);
    const parsed = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true
    });
    
    if (parsed.errors && parsed.errors.length > 0) {
        console.warn(`[Polling] Alertas durante o parsing:`, parsed.errors);
    }

    const rows = parsed.data || [];
    console.log(`[Polling] Parsing concluído. Total de linhas brutas: ${rows.length}`);

    // 3. Processa & Serializa
    console.log(`[Polling] Filtrando e formatando linhas...`);
    const validRows = rows.filter(r => r["Nome do Vendedor"] && r["Nome do Vendedor"].toUpperCase() !== 'TOTAL GERAL');

    const formattedData = validRows.map(row => {
        const cleanCurrency = (val) => parseFloat(String(val || '').replace(/[R$\s.]/g, '').replace(',', '.') || 0);
        
        return {
            vendedor: row["Nome do Vendedor"],
            carro: row["Modelo do Carro"],
            categoria: row["Categoria"],
            tipo: row["Tipo"],
            precoUnitario: cleanCurrency(row["Preço Unitário"]),
            quantidadeVendida: parseInt(row["Quantidade Vendida"] || 0, 10),
            receitaTotal: cleanCurrency(row["Receita Total"])
        };
    });

    console.log(`[Polling] Formatação concluída. Total de vendedores válidos: ${formattedData.length}`);

    // 4. Calculate core Dashboard Metrics
    console.log(`[Polling] Calculando métricas consolidadas...`);
    const totais = formattedData.reduce((acc, curr) => {
        acc.receita += curr.receitaTotal;
        acc.carrosVendidos += curr.quantidadeVendida;
        return acc;
    }, { receita: 0, carrosVendidos: 0, ticketMedio: 0 });

    if (totais.carrosVendidos > 0) {
        totais.ticketMedio = totais.receita / totais.carrosVendidos;
    }
    console.log(`[Polling] Métricas: Receita Total R$ ${totais.receita}, Carros: ${totais.carrosVendidos}`);

    // 5. Fetch Spreadsheet Title
    let sheetTitle = 'Atual';
    try {
        console.log(`[Polling] Tentando capturar título da planilha via HTML...`);
        const htmlUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlview`;
        const htmlResponse = await fetch(htmlUrl);
        if (htmlResponse.ok) {
            const htmlText = await htmlResponse.text();
            const match = htmlText.match(/<title>(.*?)<\/title>/);
            if (match && match[1]) {
                const rawTitle = match[1].replace(' - Google Drive', '').replace(' - Google Sheets', '');
                const parts = rawTitle.split('-');
                sheetTitle = parts.length > 1 ? parts[parts.length - 1].trim() : rawTitle.trim();
                console.log(`[Polling] Título identificado: ${sheetTitle}`);
            }
        } else {
            console.warn(`[Polling] Não foi possível acessar o HTML para o título (Status: ${htmlResponse.status})`);
        }
    } catch (e) {
        console.error("[Polling] Falha ao buscar título HTML:", e.message);
    }

    return {
        timestamp: new Date().toISOString(),
        sheetTitle,
        totais,
        items: formattedData
    };
}
