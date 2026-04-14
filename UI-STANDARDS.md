# APEX DASH — UI STANDARDS v3.2

## 1. COLOR PALETTE
- **Background**: #000000
- **Sidebar & Card Surfaces**: #24252E
- **Primary Accent**: #5B9FFF
- **Primary Action (Blue-700)**: #0523E5
- **Deep Blue (Blue-950)**: #1B0056

## 2. GRADIENTS (OFFICIAL)
- **Degradê 1** (versão clara): `linear-gradient(90deg, #0523E5, #94D1FF)`
  - Use: progress bars, bar charts, highlights
- **Degradê 2** (versão escura): `linear-gradient(90deg, #0523E5, #1B0056)`
  - Direction for vertical bars: `90deg` bottom→top
  - Use: ranking bars, icon strokes, goal subcard border

## 3. TYPOGRAPHY
- **Font**: Inter (Google Fonts)
- **Primary Information**: #FFFFFF
- **Secondary Information**: #D0D1D6
- **Letter-spacing**: -0.02em (default), normal (font-size < 10px)

## 4. BORDER RADIUS
- **Cards**: 10px
- **Interactives (Buttons/Tags)**: 6px or 8px
- **Inputs**: 6px

## 5. LOGO
- Minimalist logo mark in sidebar, 20px height.

## 6. VISUAL REGRESSION & SNAPSHOTS
- **Directory**: `src/__snapshots__/`
- **Purpose**: Store static references (images or config JSONs) before critical UI changes.
- **Protocol**: Every drastical change in the dashboard layout must be preceded by a manual snapshot to allow visual rollback comparison.
