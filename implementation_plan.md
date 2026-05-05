# DompetKu — Platform Manajemen Keuangan Pribadi

Membangun platform manajemen keuangan pribadi berbasis web yang **local-first**, tanpa koneksi ke pihak ketiga. Seluruh data tersimpan di perangkat pengguna menggunakan IndexedDB (via Dexie.js).

## User Review Required

> [!IMPORTANT]
> **Nama Aplikasi**: Saya menggunakan nama **"DompetKu"** sebagai nama proyek. Apakah Anda ingin nama lain?

> [!IMPORTANT]
> **Bahasa Antarmuka**: Saya akan menggunakan **Bahasa Indonesia** untuk UI (label, tombol, pesan). Apakah ini sesuai?

> [!IMPORTANT]
> **Tailwind CSS v4**: Anda menyebutkan Tailwind CSS. Saya akan menggunakan **Tailwind CSS v4** (versi terbaru 2025) yang menggunakan `@import "tailwindcss"` tanpa file `tailwind.config.js`. Apakah setuju?

## Open Questions

> [!NOTE]
> **Mata Uang Default**: Saya akan menggunakan **Rp (Rupiah)** sebagai default, dengan opsi untuk mengubah simbol di Settings. Apakah ini cukup?

> [!NOTE]
> **Warna Tema**: Saya berencana menggunakan skema warna **emerald/teal** sebagai warna utama (melambangkan keuangan) dengan dark mode default. Apakah ada preferensi warna lain?

---

## Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Build Tool | **Vite** | Cepat, HMR instan, ekosistem plugin kuat |
| Framework | **React 18** | Ekosistem hooks yang mature, `useLiveQuery` dari Dexie |
| Routing | **React Router v6** | Layout routes, nested routing |
| Styling | **Tailwind CSS v4** | Utility-first, responsive, dark mode built-in |
| Database | **Dexie.js v4** | IndexedDB wrapper, reactive queries via `useLiveQuery` |
| Charts | **Recharts** | Deklaratif, React-native, mudah dikustomisasi |
| Icons | **Lucide React** | Modern, lightweight icon library |
| PWA | **vite-plugin-pwa** | Auto service worker, manifest generation |
| Date | **date-fns** | Lightweight date utility (vs Moment.js) |
| Notifications | **react-hot-toast** | Elegant toast notifications |

---

## Project Structure

```
d:\CODING\A\manage-uang\
├── public/
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── favicon.svg
├── src/
│   ├── assets/                 # Static assets
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx       # Main layout (sidebar + content)
│   │   │   ├── Sidebar.jsx         # Desktop sidebar navigation
│   │   │   ├── BottomNav.jsx       # Mobile bottom navigation
│   │   │   └── Header.jsx          # Page header with title
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.jsx     # Total balance overview
│   │   │   ├── BudgetGauge.jsx     # Daily budget gauge (circular)
│   │   │   ├── SpendingChart.jsx   # Weekly/monthly spending chart
│   │   │   ├── RecentTransactions.jsx
│   │   │   └── QuickStats.jsx      # Income/expense/debt summary
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx # Add/edit transaction modal
│   │   │   ├── TransactionList.jsx # Filtered transaction list
│   │   │   ├── TransactionItem.jsx # Single transaction row
│   │   │   └── CategoryPicker.jsx  # Category selection grid
│   │   ├── debts/
│   │   │   ├── DebtForm.jsx        # Add/edit debt
│   │   │   ├── DebtList.jsx        # All debts list
│   │   │   ├── DebtItem.jsx        # Single debt card
│   │   │   └── DebtPaymentForm.jsx # Record debt payment
│   │   ├── budget/
│   │   │   ├── BudgetSettings.jsx  # Daily limit settings
│   │   │   └── BudgetAlert.jsx     # Alert banner component
│   │   └── common/
│   │       ├── FAB.jsx             # Floating Action Button
│   │       ├── Modal.jsx           # Reusable modal
│   │       ├── EmptyState.jsx      # Empty state illustration
│   │       ├── CurrencyInput.jsx   # Formatted Rp input
│   │       └── ConfirmDialog.jsx   # Confirmation dialog
│   ├── db/
│   │   ├── db.js                   # Dexie database instance (singleton)
│   │   ├── useTransactions.js      # Transaction CRUD hooks
│   │   ├── useDebts.js             # Debt CRUD hooks
│   │   └── useSettings.js          # Settings read/write hooks
│   ├── pages/
│   │   ├── Dashboard.jsx           # Home / overview page
│   │   ├── Transactions.jsx        # Income & expense management
│   │   ├── Debts.jsx               # Debt tracker page
│   │   ├── Reports.jsx             # Charts & analytics
│   │   └── Settings.jsx            # App settings, backup/restore
│   ├── utils/
│   │   ├── formatCurrency.js       # Rp formatting helper
│   │   ├── dateHelpers.js          # Date utility functions
│   │   ├── budgetCalculator.js     # Daily budget logic
│   │   ├── categories.js           # Default categories + icons
│   │   └── backup.js               # Export/import JSON logic
│   ├── hooks/
│   │   └── useTheme.js             # Dark/light mode toggle hook
│   ├── App.jsx                     # Root component with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind import
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Database Schema (Dexie.js / IndexedDB)

```javascript
// db.js
import Dexie from 'dexie';

const db = new Dexie('DompetKuDB');

db.version(1).stores({
  // Transactions: income & expenses
  transactions: '++id, type, category, date, amount, description, createdAt',
  
  // Debts & liabilities
  debts: '++id, creditorName, totalAmount, paidAmount, dueDate, status, createdAt',
  
  // Debt payment history
  debtPayments: '++id, debtId, amount, date, note',
  
  // App settings (single row, id=1)
  settings: 'id',
  
  // Custom categories
  categories: '++id, name, icon, color, type'
});
```

### Settings Object Structure
```javascript
{
  id: 1,
  dailyLimit: 50000,         // Rp50.000 default
  currencySymbol: 'Rp',
  theme: 'dark',             // 'dark' | 'light' | 'system'
  language: 'id',
  createdAt: Date
}
```

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] Project scaffolding
- `npm create vite@latest ./ -- --template react`
- Install dependencies:
  ```
  npm install dexie dexie-react-hooks react-router-dom recharts lucide-react 
              date-fns react-hot-toast
  npm install -D tailwindcss @tailwindcss/vite vite-plugin-pwa
  ```

---

### 2. Core Configuration

#### [NEW] [vite.config.js](file:///d:/CODING/A/manage-uang/vite.config.js)
- React plugin
- Tailwind CSS v4 plugin
- PWA plugin with manifest configuration (name, icons, theme color)

#### [NEW] [index.css](file:///d:/CODING/A/manage-uang/src/index.css)
- `@import "tailwindcss"` (v4 syntax)
- Custom CSS variables for color theme (emerald/teal palette)
- Custom animations (fade-in, slide-up, pulse)
- Scrollbar styling
- Typography customization (Inter font from Google Fonts)

#### [NEW] [index.html](file:///d:/CODING/A/manage-uang/index.html)
- SEO meta tags
- Google Font preload (Inter)
- PWA manifest link

---

### 3. Database Layer

#### [NEW] [db.js](file:///d:/CODING/A/manage-uang/src/db/db.js)
- Dexie singleton instance with schema versioning
- Default categories seeding on first run

#### [NEW] [useTransactions.js](file:///d:/CODING/A/manage-uang/src/db/useTransactions.js)
- `useAllTransactions(filters)` — query with date range, type, category filters
- `useTodayExpenses()` — sum of today's expenses
- `useMonthlyStats()` — income vs expense for current month
- `addTransaction(data)`, `updateTransaction(id, data)`, `deleteTransaction(id)`

#### [NEW] [useDebts.js](file:///d:/CODING/A/manage-uang/src/db/useDebts.js)
- `useAllDebts(statusFilter)` — query debts by status (active/paid)
- `addDebt()`, `updateDebt()`, `deleteDebt()`
- `addDebtPayment()` — record payment and update debt's paidAmount
- Auto-calculate status: `paidAmount >= totalAmount` → status = 'paid'

#### [NEW] [useSettings.js](file:///d:/CODING/A/manage-uang/src/db/useSettings.js)
- `useSettings()` — reactive settings with `useLiveQuery`
- `updateSettings(partial)` — upsert settings

---

### 4. Utility Functions

#### [NEW] [formatCurrency.js](file:///d:/CODING/A/manage-uang/src/utils/formatCurrency.js)
- Format number to `Rp50.000` style (Indonesian locale)
- Parse currency string back to number

#### [NEW] [categories.js](file:///d:/CODING/A/manage-uang/src/utils/categories.js)
- Default 5 expense categories: Makan, Transport, Listrik, Hiburan, Lainnya
- Default 3 income categories: Gaji, Freelance, Lainnya
- Each with icon (Lucide) and color

#### [NEW] [budgetCalculator.js](file:///d:/CODING/A/manage-uang/src/utils/budgetCalculator.js)
- `calculateDailyRemaining(dailyLimit, todayExpenses)` → remaining amount
- `getBudgetStatus(remaining, dailyLimit)`:
  - 🟢 **Aman**: Pengeluaran < 70% batas
  - 🟡 **Peringatan**: 70% - 90%
  - 🔴 **Kritis**: > 90% atau melampaui batas

#### [NEW] [backup.js](file:///d:/CODING/A/manage-uang/src/utils/backup.js)
- `exportData()` — export all tables to JSON, trigger download
- `importData(file)` — parse JSON, validate schema, bulk insert
- Include metadata: export date, app version

---

### 5. Layout Components

#### [NEW] [AppLayout.jsx](file:///d:/CODING/A/manage-uang/src/components/layout/AppLayout.jsx)
- Desktop: Sidebar (left 280px) + Content area
- Mobile: Full-width content + Bottom navigation bar
- Budget alert banner at top when status is yellow/red
- Uses `<Outlet />` for child routes

#### [NEW] [Sidebar.jsx](file:///d:/CODING/A/manage-uang/src/components/layout/Sidebar.jsx)
- App logo + name
- Navigation links: Dashboard, Transaksi, Hutang, Laporan, Pengaturan
- Active state indicator with animation
- Glassmorphism background in dark mode

#### [NEW] [BottomNav.jsx](file:///d:/CODING/A/manage-uang/src/components/layout/BottomNav.jsx)
- Mobile-only bottom tab bar (5 items)
- Active tab with filled icon + label
- Smooth transition animations

#### [NEW] [Header.jsx](file:///d:/CODING/A/manage-uang/src/components/layout/Header.jsx)
- Page title
- Date display
- Quick action buttons

---

### 6. Pages

#### [NEW] [Dashboard.jsx](file:///d:/CODING/A/manage-uang/src/pages/Dashboard.jsx)
- **BalanceCard**: Total saldo (pemasukan - pengeluaran), gradient card with glassmorphism
- **BudgetGauge**: Circular progress showing daily spending vs limit, color-coded
- **QuickStats**: 3 cards — Pemasukan bulan ini, Pengeluaran bulan ini, Total hutang
- **SpendingChart**: Bar/area chart showing 7-day spending trend (Recharts)
- **RecentTransactions**: Last 5 transactions with swipe-to-delete on mobile

#### [NEW] [Transactions.jsx](file:///d:/CODING/A/manage-uang/src/pages/Transactions.jsx)
- Tab toggle: Semua | Pemasukan | Pengeluaran
- Date range filter (hari ini, minggu ini, bulan ini, custom)
- Category filter chips
- Transaction list with grouping by date
- FAB (Floating Action Button) "+" di pojok kanan bawah
- Click FAB → Modal form: Tipe, Nominal, Kategori, Deskripsi, Tanggal

#### [NEW] [Debts.jsx](file:///d:/CODING/A/manage-uang/src/pages/Debts.jsx)
- Tab toggle: Aktif | Lunas
- Debt cards with progress bar (paidAmount / totalAmount)
- Click card → Detail with payment history
- "Bayar" button → Payment modal
- Color-coded due date indicator (overdue = red)

#### [NEW] [Reports.jsx](file:///d:/CODING/A/manage-uang/src/pages/Reports.jsx)
- Period selector: Minggu ini | Bulan ini | 3 Bulan | Custom
- **Pie Chart**: Pengeluaran per kategori
- **Bar Chart**: Pemasukan vs Pengeluaran per minggu/bulan
- **Line Chart**: Tren saldo harian
- Summary stats cards

#### [NEW] [Settings.jsx](file:///d:/CODING/A/manage-uang/src/pages/Settings.jsx)
- **Anggaran Harian**: Input batas harian (CurrencyInput)
- **Tampilan**: Toggle dark/light mode
- **Kategori Kustom**: Manage categories (add, edit, delete)
- **Backup & Restore**:
  - Tombol "Ekspor Data" → Download `.json` file
  - Tombol "Impor Data" → File picker + confirmation dialog
- **Hapus Semua Data**: With double-confirmation dialog
- **Tentang Aplikasi**: Version, credits

---

### 7. Key UI Features

#### Floating Action Button (FAB)
- Fixed position bottom-right (mobile: 24px from bottom nav, desktop: 32px from edge)
- Icon "+" with emerald gradient
- Click → Expand to show "Pemasukan" / "Pengeluaran" options with animation
- Accessible from all pages

#### Smart Alert System
- Persistent banner at top of layout when budget status is yellow/red
- Toast notification on each expense that crosses a threshold
- Visual states:
  - 🟢 Hidden when aman
  - 🟡 Yellow banner: "Peringatan: Sisa kuota hari ini Rp15.000"
  - 🔴 Red banner: "Kritis! Batas harian terlampaui!"

#### Dark Mode
- Default to system preference, toggleable in settings
- Tailwind `dark:` classes + CSS variables
- Smooth transition on theme switch

#### Responsive Design
- **Mobile (< 768px)**: Bottom nav, FAB, single-column layout, touch-friendly inputs
- **Tablet (768px - 1024px)**: Collapsible sidebar, 2-column grid
- **Desktop (> 1024px)**: Full sidebar, 3-column dashboard grid

---

### 8. Design System

#### Color Palette
| Token | Light | Dark |
|-------|-------|------|
| Primary | `#10b981` (emerald-500) | `#34d399` (emerald-400) |
| Primary Dark | `#059669` (emerald-600) | `#10b981` (emerald-500) |
| Background | `#f8fafc` (slate-50) | `#0f172a` (slate-900) |
| Surface | `#ffffff` | `#1e293b` (slate-800) |
| Surface Hover | `#f1f5f9` (slate-100) | `#334155` (slate-700) |
| Text Primary | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) |
| Text Secondary | `#64748b` (slate-500) | `#94a3b8` (slate-400) |
| Income (Green) | `#10b981` | `#34d399` |
| Expense (Red) | `#ef4444` | `#f87171` |
| Debt (Amber) | `#f59e0b` | `#fbbf24` |
| Danger | `#ef4444` | `#f87171` |

#### Typography
- Font: **Inter** (Google Fonts)
- Sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px)

#### Animations
- Page transitions: Fade + slide-up (150ms)
- Card hover: Scale(1.02) + shadow elevation
- Modal: Fade overlay + slide-up content
- FAB: Rotate 45° on open
- Number counters: Count-up animation on dashboard

---

## Verification Plan

### Automated Tests
1. **Dev Server**: `npm run dev` — verify no build errors
2. **PWA Validation**: Check Chrome DevTools → Application tab for manifest & service worker
3. **Responsiveness**: Browser resize testing at 375px, 768px, 1024px, 1440px

### Manual Verification (via Browser)
1. **CRUD Flow**: Add income → Add expense → Verify balance updates
2. **Budget Alert**: Set daily limit Rp50.000 → Add expense Rp40.000 → Check yellow alert → Add Rp15.000 → Check red alert
3. **Debt Flow**: Create debt → Make partial payment → Verify progress bar → Pay remaining → Check "Lunas" status
4. **Backup/Restore**: Export → Clear data → Import → Verify all data restored
5. **Dark Mode**: Toggle → Verify all pages render correctly
6. **Offline**: Disconnect network → Verify app still works (PWA)
7. **Mobile**: Test touch interactions, FAB, bottom nav, swipe gestures
