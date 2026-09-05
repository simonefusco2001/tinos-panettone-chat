# Tino's Panettone Chat — Landing Page

## 🔗 [Vai alla landing page](https://simonefusco2001.github.io/tinos-panettone-chat/)

Landing page di **Lievitista** con Tino, il lievitista digitale: la versione con chat,
sezione "Chi siamo" e blog. Racconta come Tino ti dice cosa serve e quando serve,
senza calcoli complicati.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [Supabase](https://supabase.com/) — autenticazione e dati
- React Router, TanStack Query, React Hook Form + Zod

## Sviluppo in locale

Serve Node.js 18+ (o [Bun](https://bun.sh/)).

```sh
npm install
npm run dev
```

L'app parte su http://localhost:8080.

### Variabili d'ambiente

**Obbligatorie**: il client Supabase le legge da `import.meta.env`, senza l'app va in
errore all'avvio. Copia `.env.example` in `.env` e compila i valori del progetto Supabase:

```sh
cp .env.example .env
```

| Variabile | Descrizione |
| --- | --- |
| `VITE_SUPABASE_PROJECT_ID` | ID del progetto Supabase |
| `VITE_SUPABASE_URL` | URL dell'istanza Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chiave anon/publishable (client-side, protetta da RLS) |

Gli stessi valori sono configurati come secret della repository, così la build
automatica su GitHub li ritrova.

## Script

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Server di sviluppo con hot reload |
| `npm run build` | Build di produzione in `dist/` |
| `npm run build:dev` | Build in modalità development |
| `npm run preview` | Anteprima locale della build |
| `npm run lint` | ESLint su tutto il progetto |

## Struttura

```
public/                  asset statici e icone
src/
  assets/                immagini (mascotte Tino, logo, foto lievito)
  components/            TinoChat, ChatInterface, AuthDialog, Footer
  components/ui/         componenti shadcn/ui
  integrations/supabase/ client e tipi Supabase
  pages/                 Index, ChiSiamo, TinoChat, BlogArticle, NotFound
supabase/migrations/     migrazioni SQL del database
```

## Deploy

Il sito è pubblicato su GitHub Pages: **https://simonefusco2001.github.io/tinos-panettone-chat/**

Il deploy è automatico. Ogni push su `main` fa partire il workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), che compila il progetto
e pubblica `dist/` — non serve nessun tool installato in locale.

Poiché il sito è servito da una sottocartella, `vite.config.ts` imposta
`base: "/tinos-panettone-chat/"` e il router usa lo stesso valore come `basename`.
Collegando in futuro un dominio dedicato, vanno rimossi entrambi.
