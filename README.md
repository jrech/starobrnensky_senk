# Starobrnenský Šenk

Produkční základ nové homepage pro Starobrnenský Šenk. Web je postavený jako rychlý statický Astro projekt, obsah spravuje Sanity CMS, komplexnější pohyb zajišťuje GSAP a hosting je připravený pro Vercel.

## Lokální spuštění

Požadavky: Node.js 22+ a Corepack.

```bash
corepack pnpm install
corepack pnpm dev
```

Web poběží na `http://localhost:4321`.

## Sanity CMS

1. Vytvořte nebo vyberte Sanity projekt a dataset `production`.
2. Zkopírujte `.env.example` jako `.env` a doplňte `PUBLIC_SANITY_PROJECT_ID`.
3. Zkopírujte `studio/.env.example` jako `studio/.env.local` a doplňte stejný project ID.
4. Spusťte Studio:

```bash
corepack pnpm studio
```

5. Vytvořte dokument typu `Obsah webu` a doplňte obědové menu, rumy, speciality a provozní informace.

Bez Sanity credentials web bezpečně použije lokální ukázkový obsah a viditelně jej tak označí. Při dostupném projektu se během buildu automaticky použijí publikovaná data ze Sanity.

## Nasazení na Vercel

Importujte repozitář jako nový Vercel projekt. Build command je `pnpm build`, výstup spravuje Astro adapter automaticky.

Nastavte environment variables:

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET=production`
- `SANITY_READ_TOKEN` pouze pokud je dataset privátní
- `RESEND_API_KEY`
- `RESERVATION_FROM_EMAIL`
- `RESERVATION_TO_EMAIL`

Rezervační formulář používá Vercel Function `/api/reservation`. Pokud není Resend nakonfigurovaný, formulář uživatele bezpečně odkáže na telefonickou rezervaci.

## Kontroly před publikací

```bash
corepack pnpm build
corepack pnpm studio:build
```

Před ostrým spuštěním nahraďte ukázkové menu a AI placeholder fotografie skutečnými schválenými daty a fotografiemi, ověřte otevírací dobu, telefon, e-mail, ceny a doménu odesílatele v Resend.

## Struktura

- `src/pages/index.astro` — homepage
- `src/styles/global.css` — design tokeny, layout a responzivní pravidla
- `src/scripts/site.ts` — GSAP motion a interakce
- `src/lib/site-content.ts` — Sanity načítání a fallback obsah
- `studio/schemaTypes` — Sanity datový model
- `api/reservation.ts` — bezpečný rezervační endpoint pro Vercel
- `PRD.md` — produktový source of truth
- `design.md` — vizuální a interakční source of truth
- `infrastructure.md` — architektura a provoz
