# Guia de Configuração: Apex Velocity Real-Time Dashboard (CSV Polling)

Este guia detalha os passos necessários para configurar a integração entre o Google Sheets (modo CSV Público) e o Backend do Apex Velocity.

Essa arquitetura elimina a necessidade de chaves de Serviço Google (Service Accounts) ou Webhooks. O backend fica realizando um *polling* passivo e resiliente a cada 30 segundos, repassando os dados via SSE (Eventos de Servidor) para o frontend apenas se notar alterações, mantendo a experiência real-time do usuário final.

## 1. Publicando a Planilha no Google Workspace
Para que a URL mágica de CSV funcione, existem 2 caminhos (escolha apenas um):

### Alternativa A: Compartilhamento Público por Link (Mais Simples)
1. Abra sua planilha do Apex Velocity.
2. Clique no botão de **Compartilhar** (Canto superior direito).
3. Na seção *Acesso geral*, mude de *Restrito* para **Qualquer pessoa com o link**.
4. A permissão ao lado pode continuar como *Leitor*.
5. (Pronto, a URL de exportação já vai funcionar magicamente).

### Alternativa B: Publicar na Web
1. Abra sua planilha.
2. No menu superior, clique em **Arquivo > Compartilhar > Publicar na Web**.
3. Na aba *Link*, escolha qual aba (ex: "Relatório Mensal") ou "Todo o Documento" e escolha a opção **Valores separados por vírgula (.csv)**.
4. Clique em **Publicar** e confirme.

### Dica: Título do Dashboard (Mês/Ano)
O Dashboard puxa dinamicamente a data/mes do nome do arquivo original no próprio Google Sheets!
**Convenção esperada:** Ao nomear seu arquivo lá em cima no Google Sheets, use algo como *`Apex Dashboard - Março 2026`*. O sistema cortará tudo após o hifen e usará dinamicamente *Março 2026* no cabeçalho do sistema.

## 2. Configurando o Backend (.env)
1. Vá até a pasta `server/` do projeto.
2. Crie ou edite o arquivo `.env` referenciando o `.env.example`:
3. Adicione o `SPREADSHEET_ID`. Ele é encontrado na URL normal do Google Sheets, logo depois de `/d/` e antes de `/edit`.
   Exemplo: Na URL `https://docs.google.com/spreadsheets/d/1bQNopm.../edit`, o ID é **1bQNopm...**

```bash
SPREADSHEET_ID="seu-id-da-planilha-aqui"
```
## 3. Removendo Dependência desnecessária
Como você já rodou o npm anterior, limpe dependências velhas:
No terminal, dentro da pasta `/server`, você pode desinstalar usando:
`npm uninstall googleapis`
(Certifique-se de que rodou `npm install papaparse` ali dentro também).

## 4. Rodando Localmente
A estrutura de pastas e comunicação SSE se mantiveram idênticas!

1. **Rode o Backend Caching Layer:**
   No terminal, vá para a pasta `/server` e digite:
   `node index.js` (Deve mostrar a inicialização do Cache com a mensagem **Polling Mode 🔄**).

2. **Rode o Frontend:**
   Em outro terminal, vá para a pasta principal e inicie o Vite via `npm run dev`.

### Por que essa abordagem é elegante?
1. **Zero Setup para o Vendedor:** Não exige habilitar API do Google Cloud Console.
2. **Backoff Tolerante a Falhas:** Caso a rede caia, o Polling adia por 2s, depois 4s até voltar.
3. **Escudo Térmico:** Apesar de buscar de 30 em 30 segundos, se nenhum dado mudou na planilha, o servidor simplesmente aborta em 0 ms e não acorda o Navegador Web (Frontend), o navegador continua rodando calmo e liso via EventSource com consumo O(1).
