# 🛠️ Workflow de Desenvolvimento - Apex Velocity

Este documento define o padrão obrigatório para alterações no projeto, garantindo a integridade da UI/UX e da sincronização de dados.

## 1. Regra de Ouro: Branches
**NUNCA** altere código diretamente na branch `main`. A `main` deve sempre refletir o estado estável e validado do projeto.

### Fluxo de Trabalho:
1. **Crie uma branch** para cada nova funcionalidade ou correção:
   ```bash
   git checkout -b feature/nome-da-mudanca
   ```
2. **Desenvolva e Teste**: Realize as alterações na branch criada.
3. **Validação**: Verifique se o SSE continua funcionando e o layout não quebrou.
4. **Merge**: Se tudo estiver correto, integre à `main`:
   ```bash
   git checkout main
   git merge feature/nome-da-mudanca
   ```
5. **Descarte**: Se a alteração quebrar o projeto, simplesmente descarte a branch:
   ```bash
   git checkout main
   git branch -D feature/nome-da-mudanca
   ```

## 2. Checkpoints (Commits)
Faça um commit sempre que atingir um estado seguro:
- Antes de alterações críticas de layout.
- Antes de mexer na lógica de polling/SSE.
- Após validar um novo componente.

**Mensagens Padronizadas:**
- `checkpoint: layout validado`
- `checkpoint: lógica de dados estável`
- `checkpoint: ajustes de estilo aplicados`

## 3. Snapshots Visuais
Antes de mudanças drásticas na UI, salve referências visuais em `src/__snapshots__/` para facilitar a reversão manual caso necessário.
