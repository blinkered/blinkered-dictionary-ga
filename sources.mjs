/**
 * The collections that attest Gaeilge, and where each comes from.
 *
 * Irish has a 13,545-word candidate list, ordered by Irish Wikipedia and checked against the
 * Gaelspell hunspell dictionary. Wikipedia proposed the candidates, so it attests nearly all of
 * them by construction; every word still needs two families that had no say in the list.
 *
 * The risk particular to Irish is English. Most Irish-language writing on the web sits on
 * English-language sites, most of what libraries catalogue as Irish is about Ireland rather than
 * in its language, and an English page can confirm any candidate that is also an English string
 * (TIME, GAME, BUS). The legibility floor stops a wholly English book. The publishers are chosen
 * to write in Irish, and the harvest is measured against English afterwards.
 *
 * There is no Irish Wikisource and no Irish translation on eBible.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly — the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'ga'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// The only Irish package Leipzig has above 100,000 sentences, a 2014 news crawl. The Leipzig
// Wikipedia packages are deliberately absent: they are Wikipedia text wearing a Leipzig label, so
// including one would corroborate `wiki:ga` while looking like another family.
const LEIPZIG = ['gle_newscrawl_2014_300K']

const ALL = [
  {
    id: 'wiki:ga',
    what: 'Irish Wikipedia — modern encyclopedic prose, and the list that proposed the candidates',
    needs: `${CACHE}gawiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}gawiki.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg} — modern news, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/gle/gle_sentences.tsv.bz2',
    what: 'Tatoeba Irish — contemporary and conversational, and small',
    needs: `${CACHE}gle_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}gle_sentences.tsv`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg Irish, 4 texts',
    needs: `${CACHE}gutenberg-ga`,
    documents: () => {
      const dir = `${CACHE}gutenberg-ga`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Irish books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-ga`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Irish%22+OR+language%3A%22gle%22%29',
    documents: () => {
      const dir = `${CACHE}archive-ga`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Irish-language publishers, for the harvest.
 *
 * Chosen because they publish in Irish rather than because they are large, which rules out most of
 * the web: RTÉ's Irish news shares a domain with its English news, and the national papers' Irish
 * columns are a page among thousands. These are Irish-language sites throughout. The literary
 * magazine and the publishers come first, for the register the news never reaches. Every one
 * answered when probed.
 */
export const DOMAINS = [
  'comhar.ie', 'cic.ie', 'tuairisc.ie', 'nos.ie', 'peig.ie', 'meoneile.ie',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
