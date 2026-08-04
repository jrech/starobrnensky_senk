# Design direction: Starobrněnský Šenk

**Verze:** 2.0  
**Stav:** creative direction a UX/motion specifikace pro homepage  
**Produktový source of truth:** [PRD.md](./PRD.md)  
**Hlavní vizuální reference:** [Figma – Senk, frame Desktop 16](https://www.figma.com/design/1CPzac5TeOPjioO7JfRl7J/Senk?node-id=157-933&t=mAwq8SzJMSLs08m8-4)  
**Rozsah:** pouze homepage; samostatný jídelní a nápojový lístek nejsou součástí této fáze

## 1. Hierarchie zdrojů

Při návrhu platí toto pořadí:

1. `PRD.md` určuje cílovou skupinu, positioning, obsahové priority, cíle webu a CTA.
2. Figma frame `157:933` je hlavní direction reference pro atmosféru, barvy, Caudex, práci s fotografií a kontrast světlých a tmavých kapitol.
3. Špičkové restaurační a Awwwards weby jsou inspirací pro motion, interakce, rytmus a digitální řemeslo.
4. UX, přístupnost a výkon mají přednost před dekorativním efektem.

Z referenčních webů se nesmí kopírovat branding, logo, fotografie, ilustrace, texty ani přesný layout. Přebírají se pouze obecné principy a ty se překládají do autentického charakteru Starobrněnského Šenku.

## 2. Creative concept

### Koncept: „Od oběda k poslední sklence“

Homepage má působit jako jeden plynulý průchod Šenkem během dne. Začíná prakticky a okamžitě použitelně dnešním obědem, postupně se otevírá do atmosféry piva, zahrádky a setkávání a končí večernější kapitolou rumů, rezervace a kontaktu.

Celý zážitek stojí na kontrastu:

- tradiční Caudex × současné digitální interakce,
- tmavá lesní zelená × krémové denní plochy,
- velká expresivní typografie × jednoduché provozní informace,
- pomalé atmosférické momenty × rychlé akce jako menu, telefon a navigace.

Výsledkem nemá být luxusní fine dining ani teatrální bar. Má to být moderní digitální podoba známého místa z Nového Lískovce: poctivá, sousedská, živá a zapamatovatelná.

### Hlavní UX princip

> Uživatel musí najít obědové menu, otevírací dobu, telefon a cestu rychleji, než ho začne web bavit animacemi.

Motion vytváří atmosféru až poté, co web splní svůj praktický účel.

## 3. Vizuální DNA z Figma frame

Z frame se zachovává:

- Caudex Bold pro hlavní nadpisy a Caudex Regular pro názvy dnů nebo klidnější editorial momenty.
- Tmavá lesní zelená `#18261F` jako hlavní večerní a brandová barva.
- Krémová `#FFFEF4` jako hlavní denní a obsahové pozadí.
- Medová `#FFD98D` pro teplé akcenty, rumy a vybrané aktivní momenty.
- Cihlová `#A86A3A` jako vazba na kuchyni, dřevo a tradiční hospodský charakter.
- Tlumená šalvějová `#769185` pro přechodové a klidnější kapitoly.
- Velké sekční nadpisy, silný kontrast a fotografie jako nositel atmosféry.
- Základní motivy: obědové menu, rumy, zahrádka, speciality a místo, kam se lidé vracejí.

Frame není pixelově závazný. Typografická škála, spacing, responzivita a motion se sjednotí do produkčního systému.

## 4. Typografie

### 4.1 Font pairing

#### Display: Caudex

- `Caudex Bold`: hero, dominantní sekční nadpisy, velká scroll-triggered typografie.
- `Caudex Regular`: dny v menu, citace, klidnější editorial sdělení.
- Nepoužívat pro dlouhé odstavce, formuláře, ceny ani navigaci.

#### Body a UI: Manrope

Montserrat se nahrazuje písmem Manrope. Důvody:

- otevřenější kresba a velmi dobrá čitelnost v menších velikostech,
- moderní, lidský charakter bez příliš korporátního dojmu,
- dostatečný kontrast ke klasickému Caudexu,
- vhodné řezy pro ceny, navigaci, CTA i delší provozní texty.

```css
--font-display: "Caudex", Georgia, serif;
--font-body: "Manrope", "Segoe UI", Arial, sans-serif;
```

Obě rodiny musí být nasazené s podporou české diakritiky. Preferovat self-hosted WOFF2, font-display `swap` a pouze skutečně používané řezy.

### 4.2 Fluidní typografická škála

Velikost písma nemusí být násobkem 8. Řádkování a vertikální odsazení se musí opírat o 8px grid.

| Token | CSS velikost | Line-height | Font | Použití |
|---|---|---:|---|---|
| `display-hero` | `clamp(4rem, 9vw, 8.5rem)` | 0.92–0.98 | Caudex Bold | hero a jeden dominantní typografický moment |
| `display-section` | `clamp(3rem, 6vw, 5.5rem)` | 0.98–1.05 | Caudex Bold | nadpis hlavní sekce |
| `heading-xl` | `clamp(2.5rem, 4vw, 4rem)` | 1.05 | Caudex Bold | významný příběhový nadpis |
| `heading-lg` | `clamp(2rem, 3vw, 3rem)` | 1.1 | Caudex Bold/Regular | názvy dnů a podsekcí |
| `heading-md` | `clamp(1.5rem, 2vw, 2rem)` | 1.2 | Manrope SemiBold | jídla, rumy, speciality |
| `lead` | `clamp(1.25rem, 1.7vw, 1.5rem)` | 1.5 | Manrope Medium | úvodní text a důležité sdělení |
| `body-lg` | 18 px | 32 px | Manrope Regular | hlavní text; výchozí velikost pro cílovou skupinu 28–65 |
| `body` | 16 px | 24 px | Manrope Regular | kratší doplňkové texty |
| `label` | 14 px | 24 px | Manrope Bold | navigace, metadata a stavy |
| `price` | 20–24 px | 32 px | Manrope SemiBold | ceny menu |

### 4.3 Typografická pravidla

- Nadpis má nést informaci i bez navazujícího odstavce.
- Hero claim nejvýše 2–3 krátké řádky.
- Na jednom viewportu nesmějí soupeřit více než tři dominantní velikosti.
- Dlouhý text držet přibližně mezi 52–72 znaky na řádku.
- Uppercase používat jen pro krátké UI labely a navigaci; nikdy pro delší text.
- Negativní tracking pouze u velkých nadpisů, nejvýše přibližně `-0.03em`.
- Ceny, názvy jídel, datum menu a stav rezervace mají přednost před dekorativní typografií.

## 5. Color system

### 5.1 Core palette

| Token | Hex | Primární role |
|---|---|---|
| `forest-900` | `#131B14` | nejtmavší footer, overlay, hluboké večerní pozadí |
| `forest-800` | `#18261F` | hlavní brandové pozadí a text na světlých plochách |
| `brown-900` | `#2B2520` | rumová a dřevěná kapitola |
| `cream-100` | `#F5F0E6` | alternativní teplé pozadí |
| `cream-50` | `#FFFEF4` | hlavní světlé pozadí a text na tmavých plochách |
| `honey-300` | `#FFD98D` | hlavní teplý akcent |
| `clay-500` | `#A86A3A` | kuchyně, zvýraznění dne nebo editorial detail |
| `sage-500` | `#769185` | klidná přechodová kapitola |
| `peach-100` | `#FFE8D5` | jemný teplý detail a maska fotografie |
| `white` | `#FFFFFF` | funkční kontrast |
| `black` | `#000000` | pouze technický maximální kontrast |

`#FF9696` z frame se nepoužívá jako brandová barva. Může být pouze systémovou error barvou po úpravě kontrastu.

### 5.2 Barevná dramaturgie homepage

Pozadí se mění jako plynulé kapitoly, ne jako náhodné střídání sekcí:

| Kapitola | Pozadí | Text | Akcent |
|---|---|---|---|
| Hero | `forest-800` | `cream-50` | `honey-300` |
| Obědové menu | `cream-50` | `forest-800` | `clay-500` |
| Rumy | `brown-900` nebo `forest-900` | `cream-50` | `honey-300` |
| Galerie | `cream-100` | `forest-800` | `sage-500` |
| O nás | `sage-500` | `forest-900` / `cream-50` podle kontrastu | `honey-300` |
| Speciality | `cream-50` | `forest-800` | `clay-500` |
| Kontakt a rezervace | `forest-800` | `cream-50` | `honey-300` |
| Footer | `forest-900` | `cream-50` | `sage-500` |

### 5.3 Přechody pozadí

- Barva se mění až při vstupu nové kapitoly přibližně do 35–45 % viewportu.
- Default transition: 700–1000 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Přechod musí být navázán na scroll progres, pokud nehrozí blikání nebo špatný kontrast.
- Text změní barvu až ve chvíli, kdy je podklad kontrastně bezpečný.
- Na `prefers-reduced-motion` se barva přepne bez interpolace nebo krátkým 150ms fade.

## 6. 8px spacing system

Veškeré paddingy, gaps, sekční rozestupy, velikosti ikon a výšky ovládacích prvků vycházejí z 8px gridu.

```text
0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 120, 128, 160, 192
```

| Token | Hodnota | Použití |
|---|---:|---|
| `space-1` | 8 px | ikona–text, jemný detail |
| `space-2` | 16 px | kompaktní obsah a mikrokomponenty |
| `space-3` | 24 px | mezera uvnitř karty |
| `space-4` | 32 px | odstup label–obsah nebo text–CTA |
| `space-5` | 40 px | podskupiny sekce |
| `space-6` | 48 px | nadpis–obsah |
| `space-8` | 64 px | mobilní sekční padding |
| `space-10` | 80 px | tabletový sekční padding |
| `space-12` | 96 px | desktopový sekční padding |
| `space-16` | 128 px | výrazný přechod mezi kapitolami |
| `space-20` | 160 px | editorial breathing room na desktopu |

4 px lze použít pouze pro optickou korekci, focus ring nebo mikrodetail. Nesmí se stát běžnou layout hodnotou.

## 7. Motion principles

### 7.1 Charakter pohybu

Pohyb má připomínat nalévání, odkrývání a plynulý přechod mezi částmi večera. Má být hřejivý, kontrolovaný a lehce filmový, nikoli technologicky demonstrativní.

Pět hlavních motion motivů:

1. **Masked reveal** – fotografie a nadpisy se odkrývají přes `clip-path`, overflow masku nebo scale masku.
2. **Typografický scroll reveal** – řádky nebo slova se odkrývají po skupinách, ne chaoticky po jednotlivých písmenech.
3. **Subtle parallax** – fotografie se pohybují pomaleji než kontejner, maximálně přibližně 8–12 % své výšky.
4. **Color chapters** – plynulá změna základní barvy mezi obsahovými kapitolami.
5. **Horizontal story** – desktopová sekce rumů převádí vertikální scroll do kontrolovaného horizontálního postupu.

### 7.2 Motion tokens

| Token | Délka | Použití |
|---|---:|---|
| `motion-instant` | 120 ms | stisk, aktivace, drobná odezva |
| `motion-fast` | 200 ms | hover a focus změna |
| `motion-base` | 360 ms | mikrointerakce komponenty |
| `motion-slow` | 700 ms | reveal fotografie nebo sekce |
| `motion-cinematic` | 1000–1400 ms | hero a významný maskovaný přechod |

Výchozí easing:

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
```

### 7.3 Scroll-triggered typografie

- Nadpis se rozdělí po řádcích, každý řádek je uvnitř `overflow: hidden` masky.
- Reveal: `translateY(110%) → 0`, případně jemný `rotate(2deg) → 0`.
- Stagger 60–100 ms mezi řádky; nepoužívat stagger po každém písmenu u provozních textů.
- Hero může reagovat na prvních 30–40 % scrollu jemným rozestupem řádků nebo posunem slov v opačných směrech.
- Nadpis nesmí být neviditelný před inicializací JavaScriptu. Výchozí HTML stav je čitelný; animace se aktivuje až po přidání motion-ready třídy.
- Obědové menu se neanimuje způsobem, který oddaluje zobrazení položek.

### 7.4 Parallax

- Používat pouze na fotografie, textury a dekorativní vrstvy.
- Nikdy nepoužívat na menu, formulář, mapu, ceny nebo navigaci.
- Doporučený poměr rychlosti 0.85–0.95 vůči stránce; vyhnout se extrémnímu protisměru.
- Parallax smí používat pouze `transform`; nesmí způsobovat layout thrashing.
- Na mobilu efekt omezit na polovinu nebo vypnout.

### 7.5 Masked image transitions

- Primární maska je vertikální nebo organicky zaoblený obdélník, nikoli cizí brandový symbol.
- Reveal může kombinovat `clip-path: inset()` a lehký image scale `1.08 → 1`.
- Hover fotografie: scale maximálně `1 → 1.03` během 700 ms.
- Masky se používají na vybrané dominantní fotografie, ne na každý obrázek.

### 7.6 Mikrointerakce

- Textový odkaz: underline nebo linka se odkrývá zleva doprava; při odchodu může pokračovat ven a znovu vstoupit.
- Tlačítko: text se při hoveru posune o 2–4 px, ikona o 8 px; barva se změní do 200–360 ms.
- Menu položka: aktivní stav kombinuje barvu, váhu a marker/underline.
- Karta rumu: obrázek se lehce přiblíží, název a země původu se posunou do kontrastnějšího stavu.
- Form field: focus zvýrazní border a label; žádné skákající layouty.
- Telefon a mapa mají okamžitou tap odezvu do 120 ms.
- Custom cursor není základní součást. Lze ho přidat jen pro desktopovou galerii nebo rumy a musí mít běžný kurzor jako fallback.

## 8. Homepage experience

Pořadí homepage je závazné:

1. Hero
2. Obědové menu
3. Rumy
4. Galerie
5. O nás
6. Speciality
7. Kontakt, rezervace a mapa
8. Footer

### 8.1 Hero

**Účel:** během několika sekund sdělit, co je Šenk, kde je a jak se dostat k dnešnímu obědu.

Obsahové minimum:

- krátký claim v Caudexu,
- lokalita `Brno–Nový Lískovec`,
- CTA `Dnešní obědové menu`,
- sekundární CTA `Rezervovat stůl`,
- stručný provozní stav nebo otevírací doba,
- atmosférický placeholder fotografie nebo krátké video bez zvuku.

Motion:

- Při vstupu se background odhalí maskou během 1000–1400 ms.
- Nadpis přijde po řádcích, CTA až po dokončení prvního čitelného stavu.
- Při scrollu se nadpis rozestoupí nebo posune o malou hodnotu, fotografie má jemný parallax.
- Žádný dlouhý preloader. Pokud je nutný, maximálně 600–900 ms a nesmí blokovat textové CTA.

UX pravidlo: hero nesmí být pouze image/video zážitek. Obědové menu musí být dosažitelné jedním kliknutím a viditelné bez otevření navigace.

### 8.2 Obědové menu

**Účel:** hlavní konverzní a informační sekce webu.

Obsah:

- datum a informace o aktuálnosti,
- dnešní den jako primární stav,
- polévka, hlavní jídlo A, hlavní jídlo B a ceny,
- alergeny jako dostupný sekundární detail,
- možnost přepnout další pracovní dny,
- odkaz na úplnou nabídku jen pokud existuje a je aktuální.

Visual direction:

- Krémové pozadí, tmavě zelený text, cihelný akcent pro aktuální den.
- Typografie a prostor mají větší váhu než fotografie.
- Stejná pozice názvu, popisu a ceny v každém řádku.
- Cena musí být viditelná během rychlého skenu.

Motion:

- Přechod z tmavého hero do světlé sekce je elegantní color wash.
- Nadpis se odhalí po řádcích; obsah dne krátkým 200–360ms fade/translate.
- Při změně dne se obsah crossfade-ne a lehce posune, bez horizontálního odletu celé stránky.
- Žádný parallax ani scroll-jacking uvnitř menu.

### 8.3 Rumy

**Účel:** zapamatovatelný zážitkový moment a odlišení podniku.

Desktop interaction:

- Sekce se po vstupu na omezenou dobu připne.
- Vertikální scroll posouvá řadu rumů horizontálně.
- První karta je částečně viditelná a následující karta vykukuje, aby byl směr jasný.
- Zobrazit nenápadný progress indikátor a textový cue `Posuňte dál`.
- Horizontální fáze má jasný začátek a konec; uživatel nesmí uvíznout.
- Trackpad, kolečko, klávesnice i drag musí mít funkční alternativu.

Mobile interaction:

- Nepřevádět dlouhý vertikální scroll na horizontální.
- Použít přirozený horizontální swipe se scroll-snap nebo vertikální karty.
- Zajistit viditelný peek další karty a přístupná tlačítka předchozí/další.

Obsah karty:

- název rumu,
- země nebo region,
- styl/chutě v jedné krátké větě,
- obsah alkoholu,
- případně cena, pokud je nabídka veřejná a udržovaná.

Motion:

- Karty mají různé, ale střídmé parallax rychlosti fotografie a textu.
- Aktivní karta může přejít z tlumeného do plného kontrastu.
- Pozadí přechází do `brown-900` nebo `forest-900`, akcent je `honey-300`.

### 8.4 Galerie

**Účel:** ukázat skutečnou atmosféru, hosty, pivo, zahrádku a jídlo.

- Kombinovat velké a menší formáty, ale držet čitelný rytmus.
- Fotografie se odkrývají maskou a jemným scale.
- Vybrané snímky mají odlišnou parallax rychlost pro hloubku.
- Galerie nesmí být kopií Instagram feedu.
- Lightbox musí mít klávesnicové ovládání, popisek a jasné zavření.
- Na mobilu preferovat jednoduchý swipe nebo vertikální proud.

### 8.5 O nás

**Účel:** potvrdit, že Šenk je známé sousedské místo, ne vytvořit dlouhý firemní manifest.

- Jeden silný Caudex nadpis a krátký text z brand story v PRD.
- Scroll-triggered typografie může postupně zvýraznit klíčová slova: `Nový Lískovec`, `po práci`, `na jedno`, `dobré jídlo`.
- Zvýraznění pracuje s barvou a opacity, ale text zůstává čitelný i bez animace.
- Doplnit jednu autentickou fotografii interiéru, zahrádky nebo lidí; ne generickou fine-dining scénu.

### 8.6 Speciality

**Účel:** ukázat několik důvodů přijít i mimo oběd.

- 3–5 kurátorovaných položek, nikoli celý jídelní lístek.
- Názvy, stručný popis a případně cena.
- Fotografie mají jednotný art direction, ale mohou mít různé masky nebo poměry stran.
- Hover odhalí detail; zásadní informace nesmí být dostupná pouze na hover.
- Sekce odkazuje na budoucí stránku jídelního lístku, ale tato stránka se nyní nevytváří.

### 8.7 Kontakt, rezervace a mapa

**Účel:** převést zájem na návštěvu bez kreativní překážky.

Obsah:

- telefon,
- adresa,
- aktuální otevírací doba,
- rezervace,
- informace o potvrzení rezervace,
- mapa a CTA `Naplánovat cestu`.

Motion a UX:

- Formulář nemá parallax ani maskované vstupy.
- Focus, error, success a loading stavy jsou okamžitě viditelné.
- Po odeslání se jasně sdělí, zda je rezervace potvrzená, nebo čeká na potvrzení.
- Mapa se může lazy-loadovat nebo načíst po interakci kvůli výkonu a soukromí.
- Na mobilu zůstanou telefon a navigace snadno dosažitelné; lze použít nenápadný sticky action bar.

### 8.8 Footer

**Účel:** silné, ale praktické zakončení.

- Velký typografický podpis v Caudexu, například zkrácený hlavní message značky.
- Adresa, telefon, otevírací doba, sociální sítě a právní odkazy.
- Odkazy na jídelní a nápojový lístek mohou být připravené až ve chvíli, kdy stránky existují.
- Jemný hover pohyb odkazů a pomalý background shift; žádný nekonečný marquee, který ruší čtení.

## 9. Navigace a globální interakce

- Navigace je jednoduchá a používá skutečné názvy sekcí.
- `Obědové menu` je nejvýraznější obsahová položka.
- `Rezervovat` je globální CTA, ale nesmí přebít dnešní oběd.
- Sticky navigace může při scrollu změnit kontrast podle pozadí; přechod musí být plynulý a čitelný.
- Anchor scroll vždy skončí s dostatečným offsetem pod sticky headerem.
- Mobilní menu používá jasný fullscreen overlay s rychlým vstupem 360–500 ms; odkazy jsou okamžitě klikatelné.
- Scrollbar se nesmí skrývat.
- Smooth scroll nesmí změnit očekávanou vzdálenost nebo rychlost kolečka natolik, že uživatel ztratí kontrolu.

## 10. Placeholder image direction

Fotografie a logo ve Figmě jsou pouze placeholdery. Nové placeholdery i finální focení mají následovat tento směr:

### Motivy

- čerstvě načepované pivo a pěna v detailu,
- oběd servírovaný bez fine-dining stylizace,
- ruce, přípitek a přirozené setkání lidí,
- zahrádka během pozdního odpoledne,
- dřevo, sklo, výčep a autentické detaily prostoru,
- rum ve skle, láhev a teplé boční světlo,
- exteriér a kontext Nového Lískovce.

### Styl

- dokumentární, teplý, lehce filmový,
- přirozené světlo nebo kontrolované teplé boční světlo,
- skutečné nedokonalosti a známky provozu,
- žádné sterilní studio, luxusní hotelový servis ani generická stock fotografie,
- lidská přítomnost bez nuceného pózování.

### Technická pravidla

- Připravit landscape, portrait i čtvercové cropy.
- Zachovat bezpečný prostor pro typografii jen u předem určených hero fotografií.
- Dodávat moderní formáty AVIF/WebP a responzivní velikosti.
- Finální fotografie musí mít vyřešená práva a souhlasy zachycených osob.

## 11. Accessibility a reduced motion

- `prefers-reduced-motion: reduce` vypne parallax, pinned horizontal převod, dlouhé masky a typografický stagger.
- Obsah zůstává ve stejném pořadí a plně dostupný bez animací.
- Rumy se v reduced-motion režimu zobrazí jako běžný horizontální carousel nebo vertikální seznam.
- Textový kontrast minimálně WCAG 2.2 AA: 4,5:1 pro běžný text a 3:1 pro velký text.
- Dotykové cíle minimálně 44 × 44 px, preferovaně 48 px.
- Focus ring je vždy viditelný a kontrastní.
- Barva nikdy není jediným indikátorem aktivního dne, chyby nebo dostupnosti.
- Text nesmí být pouze součástí obrázku.
- Všechny zásadní akce fungují z klávesnice.
- Animace nesmí blikat ani rychle opakovat kontrastní změny.

## 12. Performance guardrails

Awwwards-level polish nesmí znamenat pomalý web.

- Primární obsah a CTA musí fungovat bez JavaScriptové animace.
- Animovat především `transform`, `opacity` a bezpečný `clip-path`.
- Neanimovat layoutové vlastnosti jako `top`, `left`, `width` nebo `height` během scrollu.
- Jeden hlavní scroll engine; nekombinovat více knihoven řídících tentýž scroll.
- Smooth-scroll knihovna je volitelná. Pokud se použije, zachovat přirozené ovládání a okamžitě respektovat reduced motion.
- Horizontální rumová sekce se inicializuje až po načtení jejího obsahu a musí správně reagovat na resize.
- Lazy-loadovat galerie, mapu a obsah pod foldem.
- Hero video je volitelné; musí mít poster, být bez zvuku, krátké a komprimované.
- Nepoužívat WebGL jen pro dekoraci. Přidat ho pouze tehdy, pokud má jasnou hodnotu a mobilní fallback.
- Cílit na plynulých 60 fps na běžném telefonu a notebooku, ne jen na výkonném vývojářském stroji.
- Testovat Core Web Vitals a reálný low-end Android před spuštěním.

## 13. Doporučený implementační přístup

Tento dokument neurčuje framework, ale doporučuje principy:

- CSS custom properties pro barvy, spacing, typography a motion tokens.
- Nativní HTML pořadí a anchor navigace jako základ.
- CSS transitions pro mikrointerakce.
- GSAP ScrollTrigger nebo ekvivalent pouze pro složitější scroll timeline, pinning a maskované sekvence.
- Lenis nebo podobný smooth scroll pouze pokud projde testem kontroly, výkonu a přístupnosti.
- Intersection Observer pro lehké reveal efekty.
- Progressivní enhancement: bez JavaScriptu se zobrazí plně použitelná statická verze.

Technologie jsou prostředek, nikoli součást identity. Amici je relevantní reference právě tím, že používá konzistentní animační systém pro podporu identity a zároveň zachovává jednoduchou navigaci; princip se přebírá, jeho konkrétní vzhled nikoli.

## 14. UX pravidla

- Dnešní obědové menu musí být dostupné z hero a hlavní navigace.
- Datum a aktuálnost menu musí být vždy explicitní.
- Uživatel nesmí kvůli animaci čekat na zobrazení ceny, telefonu nebo CTA.
- Každá sekce má jednu hlavní myšlenku a nejvýše jednu dominantní akci.
- Odkazy používají informační názvy, nikoli `Více` nebo `Klikněte zde`.
- Kreativní scroll sekvence mají jasný vstup, průběh a výstup.
- Horizontální posun musí mít vizuální cue; nemá být překvapením.
- Interakce, které existují na hover, mají ekvivalent pro touch a keyboard.
- Formulář, menu a kontakt používají stabilní layout bez pohyblivých dekorací.
- Web má být rychle skenovatelný i pro člověka, který ho navštíví poprvé cestou na oběd.

## 15. QA checklist

### Produkt a obsah

- Je obědové menu hlavní informační prvek po hero?
- Je web stále v souladu s positioningem z `PRD.md`?
- Nepůsobí web jako fine dining, noční klub nebo rumový bar?
- Jsou pivo, zahrádka, sousedská atmosféra a Nový Lískovec dostatečně přítomné?

### Visual a typography

- Je Caudex dominantní charakterový font?
- Funguje Manrope s českou diakritikou ve všech řezech?
- Drží všechny spacingy 8px grid?
- Je barevná dramaturgie konzistentní a kontrastní?
- Mají fotografie jednotný autentický art direction?

### Motion

- Podporuje každý efekt význam dané sekce?
- Je scroll-triggered typografie čitelná i před a po animaci?
- Má parallax malou amplitudu a stabilních 60 fps?
- Má horizontální sekce rumů jasný cue, začátek a konec?
- Funguje celý web při `prefers-reduced-motion`?
- Nedochází k layout shiftům při načtení fontů a fotografií?

### UX a accessibility

- Lze najít dnešní menu, telefon, adresu a otevírací dobu během několika sekund?
- Lze celý web ovládat klávesnicí?
- Mají formuláře focus, error, loading a success stav?
- Je mapa dostupná i jako textový odkaz na navigaci?
- Funguje homepage na mobilu bez scroll-jackingu?

## 16. Inspiration references

Tyto zdroje slouží jako direction research, nikoli jako předloha ke kopírování:

- [Figma – Senk, frame Desktop 16](https://www.figma.com/design/1CPzac5TeOPjioO7JfRl7J/Senk?node-id=157-933&t=mAwq8SzJMSLs08m8-4) – hlavní vizuální reference.
- [Starobrněnský Šenk – současný web](https://www.starobrnenskysenk.cz/) – původní obsah a provozní kontext.
- [Awwwards – Restaurant websites](https://www.awwwards.com/websites/restaurant/) – současné restaurační motion a storytelling směry.
- [Amici – Communication Arts case study](https://www.commarts.com/webpicks/amici) – konzistentní animace podporující identitu bez komplikace navigace.
- [Awwwards – Homepage Scroll inspiration](https://www.awwwards.com/inspiration/homepage-scroll-charles-leclerc) – scroll storytelling, transitions a typography motion.
- [NN/g – 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) – viditelnost stavu, konzistence, kontrola a prevence chyb.
- [NN/g – F-shaped reading pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) – skenovatelnost, informační nadpisy a prioritizace obsahu.
- [Google Fonts – Caudex](https://fonts.google.com/specimen/Caudex) a [Manrope](https://fonts.google.com/specimen/Manrope) – doporučené font families.

## 17. Rozsah této fáze

Tento dokument definuje homepage a její motion/interaction systém. V této fázi se nevytváří:

- samostatná stránka jídelního lístku,
- samostatná stránka nápojového lístku,
- finální logo,
- finální fotografie,
- kopie cizích layoutů nebo brandových assetů.

Budoucí jídelní a nápojová stránka musí převzít stejnou typografii, barvy, spacing, navigaci a accessibility pravidla, ale jejich struktura se navrhne samostatně podle reálného obsahu.
