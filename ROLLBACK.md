# ⏪ Guia de Rollback e Recuperação

Este guia explica como reverter o projeto Apex Velocity para estados anteriores de forma segura.

## 1. Visualizar Histórico
Para ver todas as alterações e checkpoints realizados:
```bash
git log --oneline --graph --decorate
```

## 2. Reverter Alterações Não Comitadas
Se você estragou algo e ainda não fez o commit:
```bash
git restore .
```

## 3. Voltar para uma Versão Anterior (Checkpoints)
Para restaurar o projeto inteiro para um estado anterior:
1. Encontre o ID (hash) do commit desejado no `git log`.
2. Volte para ele:
   ```bash
   git checkout <commit-id> .
   ```
   *Nota: O ponto no final restaura os arquivos mas mantém você na branch atual.*

3. Se quiser voltar permanentemente o histórico (CUIDADO):
   ```bash
   git reset --hard <commit-id>
   ```

## 4. Recuperação via Backup Automático
Se o `backup.bat` foi executado, você verá commits com o padrão `auto-backup YYYY-MM-DD_HH-MM`. Eles são pontos de restauração garantidos.

## 5. Cuidados Importantes
- **Banco de Dados/Planilha**: Note que o Git controla o código, não os dados na planilha do Google Sheets.
- **Sincronização**: Se reverter para uma versão antiga onde o polling era diferente, certifique-se de validar o arquivo `.env`.
