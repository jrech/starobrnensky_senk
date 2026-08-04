# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Místní lidé z Brna–Nového Lískovce, zejména pracující ve věku 28–65 let. Nejčastěji hledají rychle aktuální oběd, nabídku jídla a pití, kontakt nebo cestu k podniku.

## Product Purpose

Web Starobrněnského Šenku převádí zájem na návštěvu podniku: umožňuje snadno najít aktuální denní menu, jídelní a nápojový lístek, rezervaci, otevírací dobu a kontakt.

## Positioning

Známý sousedský šenk v Novém Lískovci pro pivo po práci, poctivé jídlo, zahrádku a výběr rumů — moderní digitální podoba tradičního místa.

## Operating Context

Lidé web používají často v krátkých mobilních návštěvách před obědem, cestou z práce nebo při domlouvání posezení. Denní menu se spravuje v Sanity CMS; web běží na Astro a bude nasazený na Vercelu.

## Capabilities and Constraints

- Homepage obsahuje denní menu, rumy, galerie, speciality, kontakt, mapu a rezervační formulář.
- Samostatný lístek slučuje jídelní a nápojový lístek do jedné stránky.
- Provozní informace musí být rychle čitelné, bez závislosti na animaci.
- Používat jednotný icon pack a respektovat `prefers-reduced-motion`.

## Brand Commitments

Název: Starobrněnský Šenk. Hlas je sousedský, přímočarý a pohostinný; ne fine dining. Zachovat Caudex pro display text a Manrope pro provozní informace, současný tmavě zelený/krémový systém a 8px spacing grid.

## Evidence on Hand

- [PRD.md](./PRD.md) a [design.md](./design.md)
- Existující homepage v `src/pages/index.astro`
- Aktuální obsah z původního jídelního a nápojového lístku, ověřený 3. 8. 2026
- Placeholder fotografie v `public/assets/`

## Product Principles

1. Dnešní praktická informace má přednost před dekorací.
2. Jídlo, pití, otevírací doba a kontakt musí být dosažitelné během několika sekund.
3. Motion podporuje atmosféru, nikdy nezdržuje provozní úkol.
4. Obsah je jasný a čitelný pro místní publikum napříč věkem.
