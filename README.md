# Arabella Atelier & Building Design Workshop (BDW) — Project Management System

> **"Shaping Spaces. Transforming Lives."** &bull; **"Designed with restraint. Built with purpose."**

A bespoke, robust enterprise Project Management System crafted for **Arabella Landscape Limited** and its architectural practice, **Building Design Workshop (BDW)**.

---

## 🌿 Company Overview & Design Heritage

- **Arabella Landscape Limited (Est. 1990)**: Nigeria's premier landscape architecture and site development firm operating in Lagos and Abuja. Specializing in masterplanning, vertical living bio-facades, SuDS stormwater drainage, civil groundworks, high-traffic coastal turf, and in-house plant nursery propagation.
- **Building Design Workshop (BDW Delta)**: Arabella's architectural division specializing in bespoke contemporary residences, corporate headquarters, and mixed-use cultural spaces.
- **Atelier HQ**: 55, Moleye Street, Off Herbert Macaulay Way, Yaba, Lagos, Nigeria.

### Brand Identity & Aesthetic
- **Colors**:
  - `Arabella Forest`: `#002E11` (Primary Atelier Signature)
  - `Vibrant Emerald`: `#00722C`
  - `BDW Studio Plum`: `#8F4894` / `#B87DBD` (Architectural Discipline)
  - `Warm Champagne Gold`: `#C5A059` / `#D4AF37`
  - `Architectural Dark Mode`: `#080B09` and `#111714`
- **Typography**:
  - **Headings & Monograms**: `Cormorant Garamond` (Luxury Architectural Serif)
  - **Interface & Metrics**: `Plus Jakarta Sans` (Clean Modern Geometric Sans)
  - **Financials & Coordinates**: `JetBrains Mono` / Monospace

---

## 🛠️ Specialized Architectural & Landscape Modules

### 1. Executive Atelier Dashboard & Climate Advisory
- Real-time Nigerian local time (**WAT UTC+1 Lagos**).
- **Nigerian Seasonality Weather Advisory**: Guides site engineers on earthwork windows (Dry/Harmattan season) vs peak softscape planting and nursery growth acceleration (Wet season).
- Portfolio financial metrics in Nigerian Naira (`₦ Billions`), active projects count, nursery stock units, and statutory permit health.

### 2. Multi-Discipline Project Directory
- Filter by **Landscape Architecture**, **BDW Building Architecture**, and **Integrated Design-Build**.
- City breakdown: **Lagos** (Ikoyi, Victoria Island, Lekki Phase 1), **Abuja** (Guzape Hills, Maitama), Port Harcourt, and Ibadan.
- Dual Grid Card and Data Table views.
- Deep project inspection modal with interactive stage-gate checklists.

### 3. Stage-Gate Sign-Off Engine
- Stage gates aligned to Arabella & BDW real project workflows:
  - *Topographical Survey & Sun Path Soil Analysis*
  - *3D Bio-Facade Wind Load Simulation*
  - *LASPPPA / LABSCA / FCDA Statutory Clearances*
  - *Civil Groundworks & Subgrade Earthworks*
  - *Hardscape Granite Paving & Structural Steel Trellis*
  - *Living Wall Installation & Nursery Specimen Planting*
  - *Snagging Sign-off & Client Handover Certificate*
- Includes celebratory confetti upon milestone achievement.

### 4. Field & Studio Kanban Workflow Board
- Columns: *Backlog / Staged*, *To Do*, *In Progress*, *Site Inspection / QA*, *Completed*.
- **Weather Sensitivity Flags**: Alerts project engineers if a work package requires a dry weather window (e.g. granite mortar, turf laying).
- Interactive subtask checklists and priority grading (Urgent, High, Medium, Low).

### 5. Annual 12-Month Gantt & Seasonality Planner
- Interactive project timeline bars spanning 12 months with milestone progress indicators.
- Nigerian weather season overlay:
  - **Wet Season (April – October)**: Heavy rains, turf sodding, living wall acclimatization.
  - **Dry Season (November – March)**: Civil excavation, deep borehole piling, flamed granite paving.

### 6. Arabella In-House Plant Nursery & Bio-Wall Stock
- Directly reflects Arabella's actual nursery operations across **Lekki Nursery Zone A**, **Epe Glasshouse**, and **Abuja Depot**.
- Live inventory tracking for:
  - *Royal Palms (Roystonea regia)* - 150L Heavy Rootball Bags
  - *Snake Plants (Dracaena trifasciata)* - West African Native Architectural Succulent
  - *Sword Ferns (Nephrolepis exaltata)* - Modular Living Wall Bio-Facade Trays
  - *Ficus Nitida Hedges (Ficus microcarpa)*
  - *Desert Rose Caudex (Adenium obesum)*
  - *Bermuda Sports Turf Rolls (Cynodon dactylon)*
- Project reservation system: Tracks which plants are locked for upcoming commissions.
- Stock adjustment controls (+ / -) and Add New Species modal.

### 7. Nigerian Statutory Permitting & Approvals Tracker
- Specialized for Nigerian regulatory authorities:
  - **LASPPPA** (Lagos State Physical Planning Permit Authority)
  - **LABSCA** (Lagos State Building Control Agency)
  - **Lagos State Ministry of Environment** (Stormwater & SuDS canal outfall)
  - **FCDA Abuja** (Federal Capital Development Authority - Development Control)
- Reference number tracking, statutory assessment fees, and query rectification notes.

### 8. Daily Construction Field Reports & Site Logs
- Daily diary logging:
  - Weather condition & torrential rain downtime hours
  - Artisan headcount: Masons, pavers, horticulturists, irrigation plumbers, welders, supervisors
  - Heavy equipment deployed (JCB telehandlers, excavators, plate compactors)
  - Completed works today & toolbox safety talk confirmation
  - Formal Architect Site Instructions issued by Tunde Arabella / BDW Leads.

### 9. Snagging & Punch Lists
- Defect tracking by discipline (Hardscape, Planting, Irrigation, Architectural Concrete, Lighting).
- Severity categorisation (Critical Safety, Urgent, Standard, Cosmetic).
- One-click "Sign-off & Resolve" with celebratory milestone feedback.

### 10. Bill of Quantities (BOQ) & Valuation Certificates
- Division trade schedules (DIV 02 Civils, DIV 05 Bio-Trellis, DIV 12 Living Wall Flora, DIV 32 Smart Irrigation).
- Interactive progress claim sliders calculating certified valuations in `₦ NGN` for Interim Payment Certificates (IPC).

### 11. Nigeria Geospatial Site Distribution Map
- Interactive map highlighting site clusters in **Lagos** (Ikoyi Bayo Kuku, VI, Lekki) and **Abuja** (Guzape Diplomatic Ridge).
- Real GPS coordinates, driving addresses, and quick file inspection.

### 12. Executive Client VIP Suite & Private Dispatch Portal
- Dedicated dashboard for high-net-worth clients and corporate boards (GTBank, Stanbic, LASPARK).
- Certified milestone delivery progress and Principal Architect's Weekly Dispatch letter.
- Direct private messaging channel to Tunde Arabella and BDW directors.

### 13. Data Resilience & Portability
- Automatic sync to browser `localStorage`.
- **One-Click JSON Export Backup** (`Download` button in navbar).
- **One-Click Sample Data Reset** to restore showcase Arabella & BDW commissions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:5173` to view the application.

### Production Build
```bash
npm run build
npm run preview
```
Outputs optimized static assets to `dist/`.

---

## 🏛️ Built With
- **React 18** with **TypeScript**
- **Tailwind CSS** with custom Arabella & BDW theme extensions
- **Lucide React** for architectural and botanical icons
- **Canvas Confetti** for milestone celebrations
- **Vite 6** for lightning-fast bundling
