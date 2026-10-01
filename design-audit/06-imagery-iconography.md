# titeZMe — Imagery and iconography

Audit date: 2026-10-01. Existing implementation only; media origin is not an approval of brand style.

## Imagery

| Category | Existing implementation and origin |
|---|---|
| Bundled graphics | Six visual files in public: campaign PNG, favicon, Apple touch icon and manifest PNGs/ICO. See [asset inventory](11-asset-inventory.md) for paths, dimensions and hashes. |
| Logo | [Wordmark](../components/Wordmark.tsx#L1) renders inline SVG text. public/wordmark.png was not found. Other text-only logo treatments occur in the footer, admin and 404 interfaces. |
| Provider/profile photography | Firestore user/profile fields and Firebase Storage/Google URLs supply photoUrl, profilePhotoUrl and photo arrays. [Barber profile](../app/barber/[barberId]/BarberProfileClient.tsx), [shop profile](../app/shop/[shopId]/page.tsx) and dashboard galleries use Next Image with different fill, contain and cover treatments. |
| Fake provider imagery | [Frozen fixtures](../lib/fakeUIData.ts) use randomuser.me portraits and remote shop imagery. [Configuration hook](../hooks/useShowFakeUIData.ts) defaults to displaying fixtures unless explicitly false. This is an existing UI fixture mechanism, not verified provider evidence. |
| Marketing photography/video | [For-shops](../app/for-shops/page.tsx) uses a remote Firebase Storage video and a CSS mobile poster. Challenge reference media comes from configuration. |
| Service imagery | Text/price/duration rows and tiles exist. A separate service-photography system: **Not established / not found.** |
| Illustrations/placeholders | Emoji, initial avatars and skeleton shapes; [BeforeAfterSwap](../components/titiza-film/before-after-swap.tsx) uses neutral abstract panels, with no real before/after photography. |
| Generated imagery | Fixture data is generated programmatically. AI-generated bitmap provenance: **Not established / not found.** |
| Backgrounds/textures | CSS gradients, glass, vignette and a 64px grid at 0.04 opacity. No bundled texture file found. |
| Decorative graphics | Procedural Three.js orb, shells, points and rings; inline SVG utility/category icons. No proprietary orb model file found. |
| User video | Portfolio and challenge videos are referenced by remote data. Their complete live inventory is not established by the repository. |

## Iconography

No icon-library dependency such as lucide-react/react-icons was found in package.json. Titiza comments mention conversion from lucide-react; current rendering uses local inline SVG. Emoji, SVG, filled circles and SVG text coexist. No single shared icon size or stroke token is established.

| Treatment | Existing values and source |
|---|---|
| Password eye | 18×18; viewBox 0 0 24 24; fill none; currentColor stroke width 2; round caps/joins. [PasswordInput](../components/PasswordInput.tsx#L75). |
| Titiza utility symbols | Base 24×24; default stroke 2, call-site override 1.5; sizes 16/20/24/28px. [BeautyProfileCard](../components/titiza/beauty-profile-card.tsx), [FeatureCards](../components/titiza/feature-cards.tsx). |
| Category glyphs | 32px grid icons; local category definitions; More uses filled circles of radius 1.4. [CategoryIcon](../components/titiza/category-icons.tsx), [CategoryGrid](../components/titiza/category-grid.tsx). |
| Navigation | Language chevron 8×6 with 2.5 stroke; hamburger 20×20 with 2 stroke. [TopNav](../components/TopNav.tsx). |
| Google mark | Filled, multicolor 18×18 SVG paths. [Signup](../app/signup/page.tsx). |
| Wordmark | viewBox 200×40, text size 32, weight 800; height prop default 28 and navigation call 24. tite/Me #F5C518; Z #E8491D. [Source](../components/Wordmark.tsx). |
| Emoji UI | Bell 15px; search/calendar/scissors/heart empty-state icons use text-5xl. Roles, language flags, cash/location and status symbols use different local sizes. Platform font rendering varies. |

Every SVG, emoji, image and URL occurrence is retained in the [imagery/icon ledger](evidence/imagery-icons.md). Remote source URLs are listed in the [asset inventory](11-asset-inventory.md).
