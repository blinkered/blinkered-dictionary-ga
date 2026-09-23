# Blinkered dictionary: Irish

The Irish word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Irish.

**8,585 of 13,545 candidates proved, 63.4%**, across 11 independent
families, 10 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Irish, and why those
ATTESTATIONS.tsv   the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
searched.tsv       publishers fetched directly: per page, which candidates it held and how often
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Irish list, which lives in
[`blinkered-attestation/candidates/ga`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/ga).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Irish

**The families.** Irish Wikipedia (which also ordered the candidates), a 2014 Leipzig news crawl,
Tatoeba, four Project Gutenberg texts, the Internet Archive's Irish shelf, and six Irish-language
sites fetched directly (`nos.ie`, `tuairisc.ie`, `cic.ie`, `meoneile.ie`, `peig.ie` and
`comhar.ie`). There is no Irish Wikisource and
no Irish translation on eBible.

**English is the risk, and it is mostly contained.** Most of what the Archive catalogues as Irish
is about Ireland and written in English: only 7 of the 192 texts read cleared the legibility floor.
The publishers were chosen to write in Irish throughout, rather than RTÉ or the national papers,
whose Irish pages share a domain with their English ones. The candidate list, validated against
en.wiktionary's Irish categories, still carries a few English strings (THE, FROM, HAS, DID, EACH).
Measured: 317 of the 8,585 shipped words (3.7%) are also English candidates, and 71 are in the top
3,000 of the English list. Most of those 71 are Irish words too (SIN, MAR, AIR, FEAR, TEACH, SEA);
by eye about a dozen are plain English that Irish text quoted (THE, FROM, BOTH, EACH, HIM).

**The fada is a letter.** Á, É, Í, Ó and Ú are tiles of their own, as they are in Irish, so SEAN
and SEÁN are different words here, and every one of the five spells some shipped word.

**Where the drop list points.** The first build, with three publishers, kept 53.5%; this one, with
all six, keeps 63.4%. 3,283 of the 3,659 words still one family short are attested by the Archive
and Wikipedia and nothing else: ABACHT, ÁBHACHT. More Irish-language books or long-form prose
would clear much of that; Comhar, the literary magazine, gave the harvest only eleven pages, so a
deeper fetch of it is the obvious next step.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list. It has to be re-measured before this list reaches the game, and
`status.json` says `"ships": "pending"` until somebody decides otherwise. Nobody has yet played
the boards this list deals.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `CC-BY-SA-4.0` | `dropped.tsv`, which is **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms, here `CC-BY-SA-4.0`.
