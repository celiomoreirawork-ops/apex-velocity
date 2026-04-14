# 🏎️ Apex Velocity — Dashboard de Alta Performance v.02

> **Cockpit de Teledados em Tempo Real para Equipes de Vendas**
> Documento de Overview do Projeto · Atualizado em 14/04/2026

---

## 📈 Visão Geral

O **Apex Velocity** é um ecossistema de visualização de dados projetado para ambientes de alta pressão onde a velocidade de decisão é crítica. Inspirado em cockpits de aviação tática e HUDs de Fórmula 1, o dashboard transforma fluxos de vendas complexos em insights visuais imediatos e acionáveis.

A arquitetura é focada em **vibe coding**, utilizando tecnologias modernas para garantir uma interface fluida, responsiva e esteticamente premium.

---

## 🛠️ Stack Tecnológica (Modern-Edge)

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | React 19 + Vite | Renderização ultra-rápida e HMR instantâneo. |
| **Styling** | Tailwind CSS 3.4 | Design utilitário com tokens customizados. |
| **Animações** | Anime.js + Framer Motion | Micro-interações orgânicas e transições de estado. |
| **Visualização** | Chart.js + React-Chartjs-2 | Gráficos de telemetria e composição de mercado. |
| **Real-time** | SSE (Server-Sent Events) | Sincronização de dados sem necessidade de refresh. |
| **Utilidades** | clsx + tailwind-merge | Gestão dinâmica de classes CSS. |

---

## 🎨 Design System: "The Kinetic Deep Blue"

O projeto segue um padrão rigoroso de UI/UX definido em `UI-STANDARDS.md`.

- **Estética Global**: Dark Mode Imersivo com Glassmorphism.
- **Paleta Signature**:
    - `Background`: #000000 (O Vácuo)
    - `Surfaces`: #24252E (Deep Slate)
    - `Accents`: #5B9FFF (Light Blue) e #0523E5 (Apex Blue)
- **Tipografia**: **Inter** (Google Fonts). Foco em pesos Light (300) e Medium (500). Sem negrito pesado para manter a elegância técnica.
- **Regra de Ouro**: Proporção áurea em paddings (24px padrão) e cantos arredondados (Radius 9999px para elementos interativos).

---

## 🧩 Modulares & Componentes

### 1. Sidebar Estratégica
Navegação fixa com acesso rápido aos módulos de performance, relatórios e configurações. Logo minimalista de 20px integrado.

### 2. Objetivo Mensal (Fluid Progress)
Card central com barra de progresso vertical fluida e sistema de badges dinâmicos baseados em ritmo de vendas (Avanço, Ritmo, Tração, Lendário).

### 3. Ranking de Venda (Top Sellers)
Visualização de pódio para os melhores executivos, com avatares upscallados e tooltips interativos com efeito de reflexo cristalino.

### 4. Gráficos de Telemetria
- **Composição de Mercado**: Barras horizontais com degradês oficiais.
- **Ranking Chart**: Gráfico de barras verticais com animações via Anime.js.

---

## 📁 Estrutura do Repositório

```plaintext
apex-velocity/
├── src/
│   ├── components/
│   │   ├── dashboard/      # Módulos de visualização de dados
│   │   └── layout/         # Sidebar, Header e Wrappers
│   ├── assets/             # Badges, ícones e logos SVG
│   ├── hooks/              # Lógica de consumo de dados (SSE/API)
│   └── index.css           # Design Tokens e utilitários globais
├── server/                 # Backend Node.js para feed de dados
├── docs/                   # SETUP.md e documentação técnica
├── UI-STANDARDS.md         # Manual de Identidade Visual
└── WORKFLOW.md             # Protocolos de desenvolvimento
```

---

## 🚀 Próximos Passos & Roadmap

1.  **Refinamento de Dados**: Implementação de filtros avançados por período e região.
2.  **Modo de Apresentação**: Snapshot automático para compartilhamento em slides.
3.  **Alertas Hapticos**: Notificações visuais pulsantes quando metas críticas são atingidas.
4.  **Otimização de Performance**: Auditoria Lighthouse para garantir Core Web Vitals impecáveis.

---

> [!TIP]
> **Dica de Manutenção**: Sempre valide novas cores contra a regra de banimento de tons violetas/roxos para manter a sobriedade do ecossistema Apex.

**Localização**: `apex-velocity/PROJETO_v.02.md`
