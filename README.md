# Seller training

A web product for trainer-led sessions that help sellers identify AI use cases and position relevant offerings.

The repository currently contains supplied prototypes and a product record. The actual product has not been built yet.

## Product direction

Read [PRODUCT.md](PRODUCT.md) for confirmed product facts and open decisions.

## Try the prototypes

From the repository root, run:

```sh
python3 -m http.server 8000 --directory prototype/seller-ai-training
```

Open http://localhost:8000 to see the launcher. Choose either activity:

- **AI Deal Jeopardy**: a team quiz with presenter scoring.
- **Customer role-play**: scripted conversations with coaching, signal spotting, and a debrief.

The prototypes use static HTML, CSS, and JavaScript. They do not call a live AI model. Google Fonts requires an internet connection, but the pages include fallback fonts.

The trainer operates the shared screen. Group mode lets the trainer tally room votes manually, rather than connecting participant devices.

## Supplied material

- `prototype/seller-ai-training/`: prototype pages and screenshots.
- `prototype/seller-ai-training.zip`: the original supplied archive.

Company names, personas, figures, and service claims in the scenarios are illustrative training content, not verified customer evidence.
