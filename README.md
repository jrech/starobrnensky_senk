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

5. Ve Studiu otevřete `Obsah webu → Jídelní lístek` nebo `Obsah webu → Nápojový lístek`. V každé skupině lze přidávat, upravovat, mazat a přetahovat položky; upravit lze název, gramáž či objem, cenu a alergeny.

Bez Sanity credentials web bezpečně použije lokální ukázkový obsah.

### Kdy se změny projeví

- **Obědové menu a stav provozu** se na homepage načítají ze Sanity živě v prohlížeči, takže jsou vidět hned po kliknutí na `Publikovat`.
- **Jídelní a nápojový lístek** (`/listky`) je statická stránka. Po publikování ji přegeneruje webhook, změna je na webu zhruba do minuty.

### Webhook pro přegenerování webu

1. Hosting: vytvořte deploy hook (Vercel: `Settings → Git → Deploy Hooks`, větev `main`; Cloudflare Pages: `Settings → Builds → Deploy hooks`) a zkopírujte jeho URL.
2. Sanity: na `sanity.io/manage` → projekt → `API → Webhooks → Create webhook`:
   - URL: deploy hook z kroku 1, HTTP method `POST`
   - Dataset: `production`, trigger on `Create`, `Update`, `Delete`
   - Filter: `_type in ["foodMenu", "drinkMenu", "lunchMenu", "operatingStatus"]`
   - Projection nechte prázdnou, `Drafts` a `Versions` vypnuté
3. Ověření: upravte cenu v lístku, publikujte a v přehledu deploymentů hostingu by se měl spustit nový build.

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
