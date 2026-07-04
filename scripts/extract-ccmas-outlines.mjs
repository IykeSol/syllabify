/**
 * Extract per-department course outlines from the NUC CCMAS discipline PDFs.
 *
 *   node scripts/extract-ccmas-outlines.mjs
 *
 * Reads  docs/ccmas/disciplines/*.pdf  (see docs/ccmas/README.md for sources)
 * and writes one markdown outline per department to docs/course-outlines/:
 * the course-structure tables per level plus the full course contents and
 * learning outcomes — ready to draft Syllabify PDFs from.
 */
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

const ROOT = path.resolve(import.meta.dirname, '..')
const PDF_DIR = path.join(ROOT, 'docs', 'ccmas', 'disciplines')
const OUT_DIR = path.join(ROOT, 'docs', 'course-outlines')

/** Seeded department slug → { file, keywords matched against programme headings }. */
const DEPARTMENTS = {
  // Administration & Management
  accounting: { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['accounting'] },
  'actuarial-science': { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['actuarial science'] },
  'banking-and-finance': { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['banking and finance'] },
  'business-administration': { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['business administration'] },
  entrepreneurship: { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['entrepreneurship'] },
  insurance: { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['insurance'] },
  marketing: { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['marketing'] },
  'public-administration': { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['public administration'] },
  taxation: { file: 'Administration-and-Management-CCMAS.pdf', keywords: ['taxation'] },
  // Agriculture
  agriculture: { file: 'Agriculture-CCMAS.pdf', keywords: ['b. agriculture', 'agriculture'] },
  'agricultural-economics': { file: 'Agriculture-CCMAS.pdf', keywords: ['agricultural economics'] },
  'agricultural-extension': { file: 'Agriculture-CCMAS.pdf', keywords: ['agricultural extension'] },
  'animal-science': { file: 'Agriculture-CCMAS.pdf', keywords: ['animal science'] },
  'crop-science': { file: 'Agriculture-CCMAS.pdf', keywords: ['crop science'] },
  'fisheries-and-aquaculture': { file: 'Agriculture-CCMAS.pdf', keywords: ['fisheries and aquaculture', 'fisheries'] },
  'food-science-and-technology': { file: 'Agriculture-CCMAS.pdf', keywords: ['food science'] },
  'forestry-and-wildlife-management': { file: 'Agriculture-CCMAS.pdf', keywords: ['forestry and wildlife', 'forest resources'] },
  'nutrition-and-dietetics': { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['human nutrition and dietetics', 'human nutrition', 'nutrition and dietetics'] },
  'soil-science': { file: 'Agriculture-CCMAS.pdf', keywords: ['soil science'] },
  // Arts
  'arabic-studies': { file: 'Arts-CCMAS.pdf', keywords: ['arabic studies', 'arabic'] },
  'christian-religious-studies': { file: 'Arts-CCMAS.pdf', keywords: ['christian religious studies', 'christian studies'] },
  'english-and-literary-studies': { file: 'Arts-CCMAS.pdf', keywords: ['english and literary studies', 'english language', 'english studies'] },
  // NUC files Fine & Applied Arts under the Environmental Sciences volume
  'fine-and-applied-arts': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['fine and applied arts', 'fine and applied art'] },
  french: { file: 'Arts-CCMAS.pdf', keywords: ['french'] },
  'history-and-international-studies': { file: 'Arts-CCMAS.pdf', keywords: ['history and international studies', 'history and diplomatic studies', 'history'] },
  'islamic-studies': { file: 'Arts-CCMAS.pdf', keywords: ['islamic studies'] },
  linguistics: { file: 'Arts-CCMAS.pdf', keywords: ['linguistics'] },
  music: { file: 'Arts-CCMAS.pdf', keywords: ['music'] },
  philosophy: { file: 'Arts-CCMAS.pdf', keywords: ['philosophy'] },
  'religious-studies': { file: 'Arts-CCMAS.pdf', keywords: ['religious studies'] },
  'theatre-arts': { file: 'Arts-CCMAS.pdf', keywords: ['theatre art', 'theatre and film', 'performing art'] },
  // Education
  'adult-and-non-formal-education': { file: 'Education-CCMAS.pdf', keywords: ['adult and continuing education', 'adult and non-formal education', 'adult education'] },
  'business-education': { file: 'Education-CCMAS.pdf', keywords: ['business education'] },
  'early-childhood-education': { file: 'Education-CCMAS.pdf', keywords: ['early childhood', 'childhood education'] },
  'educational-management': { file: 'Education-CCMAS.pdf', keywords: ['educational management', 'education management'] },
  'guidance-and-counselling': { file: 'Education-CCMAS.pdf', keywords: ['guidance and counselling'] },
  'human-kinetics-and-health-education': { file: 'Education-CCMAS.pdf', keywords: ['human kinetics', 'health education'] },
  'library-and-information-science': { file: 'Education-CCMAS.pdf', keywords: ['library and information science'] },
  'science-education': { file: 'Education-CCMAS.pdf', keywords: ['science education'] },
  // Engineering
  'agricultural-and-bioresources-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['agricultural and biosystems', 'agricultural and bioresources engineering', 'agricultural engineering'] },
  'biomedical-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['biomedical engineering'] },
  'chemical-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['chemical engineering'] },
  'civil-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['civil engineering'] },
  'computer-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['computer engineering'] },
  'electrical-and-electronics-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['electrical and electronics engineering', 'electrical/electronic', 'electrical engineering'] },
  'marine-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['marine and offshore engineering', 'marine and offshore', 'marine engineering'] },
  'mechanical-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['mechanical engineering'] },
  'mechatronics-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['mechatronic'] },
  'metallurgical-and-materials-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['metallurgical engineering', 'materials and metallurgical', 'metallurgical and materials'] },
  'petroleum-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['petroleum engineering', 'petroleum and gas engineering'] },
  'telecommunications-engineering': { file: 'Engineering-CCMAS.pdf', keywords: ['telecommunication'] },
  // Environmental Sciences (+ Architecture volume)
  architecture: { file: 'Architecture-CCMAS.pdf', keywords: ['architecture'] },
  building: { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['building'] },
  'environmental-management': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['environmental management'] },
  'estate-management': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['estate management'] },
  'quantity-surveying': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['quantity surveying'] },
  'surveying-and-geoinformatics': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['surveying and geoinformatics'] },
  'urban-and-regional-planning': { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['urban and regional planning'] },
  // Law
  law: { file: 'Law-CCMAS.pdf', keywords: ['ll.b', 'llb', 'law'] },
  'common-and-islamic-law': { file: 'Law-CCMAS.pdf', keywords: ['common and islamic law'] },
  // Medical & Health Sciences
  anatomy: { file: 'Basic-Medical-Sciences-CCMAS.pdf', keywords: ['anatomy'] },
  physiology: { file: 'Basic-Medical-Sciences-CCMAS.pdf', keywords: ['physiology'] },
  'medicine-and-surgery': { file: 'Medicine-and-Dentistry-CCMAS.pdf', keywords: ['medicine and surgery', 'mbbs'] },
  dentistry: { file: 'Medicine-and-Dentistry-CCMAS.pdf', keywords: ['dental surgery', 'dentistry'] },
  'medical-laboratory-science': { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['medical laboratory science'] },
  'nursing-science': { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['nursing'] },
  optometry: { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['optometry'] },
  physiotherapy: { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['physiotherapy'] },
  'public-health': { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['public health'] },
  radiography: { file: 'Allied-Health-Sciences-CCMAS.pdf', keywords: ['radiography'] },
  pharmacy: { file: 'Pharmacy-CCMAS.pdf', keywords: ['pharm'] },
  'veterinary-medicine': { file: 'Veterinary-Medicine-CCMAS.pdf', keywords: ['veterinary'] },
  // Sciences
  biochemistry: { file: 'Sciences-CCMAS.pdf', keywords: ['biochemistry'] },
  biology: { file: 'Sciences-CCMAS.pdf', keywords: ['biology'] },
  biotechnology: { file: 'Sciences-CCMAS.pdf', keywords: ['biotechnology'] },
  botany: { file: 'Sciences-CCMAS.pdf', keywords: ['botany', 'plant science'] },
  chemistry: { file: 'Sciences-CCMAS.pdf', keywords: ['chemistry'] },
  geology: { file: 'Sciences-CCMAS.pdf', keywords: ['geology'] },
  geophysics: { file: 'Sciences-CCMAS.pdf', keywords: ['geophysics'] },
  'industrial-chemistry': { file: 'Sciences-CCMAS.pdf', keywords: ['industrial chemistry'] },
  mathematics: { file: 'Sciences-CCMAS.pdf', keywords: ['mathematics'] },
  microbiology: { file: 'Sciences-CCMAS.pdf', keywords: ['microbiology'] },
  physics: { file: 'Sciences-CCMAS.pdf', keywords: ['physics'] },
  'science-laboratory-technology': { file: 'Sciences-CCMAS.pdf', keywords: ['science laboratory technology'] },
  statistics: { file: 'Sciences-CCMAS.pdf', keywords: ['statistics'] },
  zoology: { file: 'Sciences-CCMAS.pdf', keywords: ['zoology'] },
  // Computing
  'computer-science': { file: 'Computing-CCMAS.pdf', keywords: ['computer science'] },
  'cyber-security': { file: 'Computing-CCMAS.pdf', keywords: ['cybersecurity', 'cyber security'] },
  'information-technology': { file: 'Computing-CCMAS.pdf', keywords: ['information technology'] },
  'software-engineering': { file: 'Computing-CCMAS.pdf', keywords: ['software engineering'] },
  // Social Sciences
  'criminology-and-security-studies': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['criminology'] },
  'demography-and-social-statistics': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['demography'] },
  economics: { file: 'Social-Sciences-CCMAS.pdf', keywords: ['economics'] },
  geography: { file: 'Environmental-Sciences-CCMAS.pdf', keywords: ['geography'] },
  'international-relations': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['international relations'] },
  'peace-and-conflict-studies': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['peace and conflict', 'peace studies'] },
  'political-science': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['political science'] },
  psychology: { file: 'Social-Sciences-CCMAS.pdf', keywords: ['psychology'] },
  'social-work': { file: 'Social-Sciences-CCMAS.pdf', keywords: ['social work'] },
  sociology: { file: 'Social-Sciences-CCMAS.pdf', keywords: ['sociology'] },
  // Communication
  'mass-communication': { file: 'Communication-and-Media-Studies-CCMAS.pdf', keywords: ['mass communication'] },
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

/**
 * Lines that are page furniture, not content. Bare digits are NOT junk —
 * vertical table layouts put each unit/hour cell on its own line; page
 * numbers in these PDFs ride on the discipline word ("Sciences 428").
 */
function isJunkLine(line, disciplineWords) {
  const t = line.trim()
  if (!t) return false
  if (/^new$/i.test(t)) return true
  if (disciplineWords.some((w) => new RegExp(`^${w}\\s*\\d*$`, 'i').test(t))) return true
  return false
}

/** True for table-of-contents lines (dot/dash leaders, trailing page numbers). */
function isTocLine(t) {
  return /\.{2,}|-{3,}|…/.test(t) || /\s\d{1,4}\s*$/.test(t)
}

/** Programme heading = degree-ish line whose section soon shows Overview/Philosophy. */
function findSections(lines) {
  const headingRe =
    /^\s*(b[.\s]|bachelor of|doctor of|o\.?\s?d\b|dpt\b|ll\.?\s?b|mbbs|bds|dvm|pharm\.?\s?d)/i
  const starts = []
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t.length < 8 || t.length > 90 || !headingRe.test(t) || isTocLine(t)) continue
    // Prose, not a title: dangles on a function word or continues lowercase.
    if (/\b(of|and|the|in|is|are|an|a|for|with|to|has|was|its|their)\s*$/i.test(t)) continue
    const nextLine = (lines[i + 1] ?? '').trim()
    if (/^[a-z]/.test(nextLine)) continue
    // Or the previous line flows into this one ("… requirements for the ⏎ B.Sc. X …")
    let p = i - 1
    while (p >= 0 && !lines[p].trim()) p--
    const prev = p >= 0 ? lines[p].trim() : ''
    if (/(\b(of|and|the|in|is|are|an|a|for|with|to|as|by|or|new)|,)$/i.test(prev)) continue
    const ahead = lines.slice(i + 1, i + 18).join(' ')
    if (!/\b(overview|philosophy)\b/i.test(ahead)) continue
    // Merge headings wrapped onto two lines ("…Metallurgical and Materials\nEngineering")
    if (starts.length && i - starts[starts.length - 1].i <= 1) {
      starts[starts.length - 1].title += ' ' + t
      continue
    }
    starts.push({ i, title: t })
  }
  return starts.map((s, idx) => ({
    title: s.title.replace(/\s+/g, ' '),
    start: s.i,
    end: starts[idx + 1]?.i ?? lines.length,
  }))
}

/** Strip degree prefixes/suffixes so titles compare by programme name only. */
function programmeName(title) {
  return norm(title)
    .replace(/\b(b|sc|a|ed|eng|tech|nsc|mls|nd|rad|o|dpt|bachelor|doctor|of|degree|combined|honours|hons|llb|ll|mbbs|mbchb|bds|bchd|dvm|pharm|d|programme)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Best section for a department: exact programme-name match beats containment. */
function matchSection(sections, keywords) {
  let best = null
  let bestScore = 0
  for (const s of sections) {
    const name = programmeName(s.title)
    for (let k = 0; k < keywords.length; k++) {
      const kw = norm(keywords[k])
      let score = 0
      if (name === kw) score = 400
      else if (name.startsWith(kw) || kw.startsWith(name)) score = 300
      else if (name.includes(kw)) score = 200
      else if (norm(s.title).includes(kw)) score = 100
      if (score === 0) continue
      score -= k // earlier keywords win ties
      // Same score: prefer the longer section (skips stray mini-matches).
      if (score > bestScore || (score === bestScore && best && s.end - s.start > best.end - best.start)) {
        bestScore = score
        best = s
      }
    }
  }
  return best
}

/**
 * Fallback for headings the degree regex misses (e.g. a bare "Science
 * Education" section title). Strict: the line must BE the programme name
 * (allowing a short degree prefix), not merely mention it in prose.
 */
function findSectionByKeyword(lines, sections, keywords) {
  for (const kw of keywords) {
    const nkw = norm(kw)
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim()
      if (t.length < kw.length || t.length > 90 || isTocLine(t)) continue
      if (/^\d+[.)]/.test(t)) continue // numbered list (table of contents)
      if (/[A-Z]{2,4}\s?\d{3}/.test(t)) continue // course-code line
      if (/^[a-z]/.test((lines[i + 1] ?? '').trim())) continue // prose continuation
      const nt = norm(t)
      const heading =
        nt === nkw ||
        (nt.endsWith(nkw) && nt.length - nkw.length <= 20) ||
        (nt.startsWith(nkw) && nt.length - nkw.length <= 25)
      if (!heading) continue
      const ahead = lines.slice(i + 1, i + 25).join(' ')
      if (!/\b(overview|philosophy)\b/i.test(ahead)) continue
      const nextStart = sections.map((s) => s.start).find((s) => s > i)
      return {
        title: t.replace(/\s+/g, ' '),
        start: i,
        end: nextStart ?? Math.min(lines.length, i + 2200),
      }
    }
  }
  return null
}

/**
 * Parse "CODE 123 Title 3 C 30 45"-style rows within a structure block.
 * PDF extraction wraps long rows onto 2–3 lines ("GST 112 Nigerian Peoples
 * and / Culture / 2 C 30 -"), so accumulate from each course code until the
 * units/status tail appears.
 */
const ROW_RE = /^([A-Z]{2,4})[ \t-]{0,4}(\d{3})\s+(.+?)\s+(\d{1,2})\s+(C|E|R)\b(?:\s+(\d+|-)\s+(\d+|-))?/
const CODE_START = /^[A-Z]{2,4}[ \t-]{0,4}\d{3}\b/

function parseTable(blockLines) {
  const rows = []
  let buffer = ''
  const flush = () => {
    if (!buffer) return
    const m = buffer.replace(/\s+/g, ' ').trim().match(ROW_RE)
    if (m) {
      rows.push({
        code: `${m[1]} ${m[2]}`,
        title: m[3].replace(/\s{2,}/g, ' ').trim(),
        units: m[4],
        status: m[5],
      })
    }
    buffer = ''
  }
  for (const raw of blockLines) {
    const line = raw.trim()
    if (!line) continue
    if (CODE_START.test(line)) {
      flush()
      buffer = line
    } else if (buffer) {
      if (/^(TOTAL|Course Code|NOTE)/i.test(line)) {
        flush()
        continue
      }
      buffer += ' ' + line
    }
    // Row complete once the units/status tail is present.
    if (buffer && ROW_RE.test(buffer.replace(/\s+/g, ' '))) flush()
  }
  flush()
  return rows
}

const STATUS_LABEL = { C: 'Compulsory', E: 'Elective', R: 'Required' }

function buildMarkdown(slug, deptTitle, sectionTitle, file, sectionLines) {
  const text = sectionLines.join('\n')
  const structIdx = sectionLines.findIndex((l) =>
    /(global\s+)?course structure/i.test(l.trim()),
  )
  // The syllabus block. Most volumes head it "Course Contents and Learning
  // Outcomes"; a few (e.g. Music) say "Course Structure and Learning Outcomes".
  // A handful have no umbrella heading at all — fall back to the first
  // per-course heading ("QTS 101: Introduction… (2 Units C: LH 30)").
  const CONTENT_HEADING = /^[A-Z]{2,4}\s?\d{3}[A-Z]?\s*[:.]\s*.+?\(\s*\d+\s*Units?/i
  let contentsIdx = sectionLines.findIndex((l) =>
    /course\s+(contents?|structures?)\s+and\s+learning\s+outcomes?/i.test(l.trim()),
  )
  if (contentsIdx === -1) {
    contentsIdx = sectionLines.findIndex((l) => CONTENT_HEADING.test(l.trim()))
    // Guard: must sit after the structure tables, not inside them.
    if (contentsIdx !== -1) contentsIdx = Math.max(contentsIdx - 1, 0)
  }

  let md = `# ${deptTitle} — CCMAS course outline\n\n`
  md += `> National core curriculum (70%) for **every Nigerian university**, extracted from\n`
  md += `> \`docs/ccmas/disciplines/${file}\` (NUC CCMAS 2023), programme section “${sectionTitle}”.\n`
  md += `> Each university adds its own 30% on top — draft Syllabify PDFs from the courses below.\n\n`

  // Course structure tables, split by "N00 Level". When the section has no
  // explicit structure heading, parse the stretch before the contents block.
  if (structIdx !== -1 || contentsIdx !== -1) {
    const structStart = structIdx !== -1 ? structIdx : 0
    const structEnd =
      contentsIdx !== -1 && contentsIdx > structStart ? contentsIdx : sectionLines.length
    const struct = sectionLines.slice(structStart, structEnd)
    md += `## Course structure\n`
    const levelIdx = []
    struct.forEach((l, i) => {
      if (/^\s*\d00\s+Level\b/i.test(l)) levelIdx.push(i)
    })
    if (levelIdx.length === 0) levelIdx.push(0)
    levelIdx.forEach((li, k) => {
      const levelName = struct[li].trim().match(/\d00\s+Level/i)?.[0] ?? 'Courses'
      const chunk = struct.slice(li, levelIdx[k + 1] ?? struct.length)
      const rows = parseTable(chunk)
      if (rows.length === 0) return
      md += `\n### ${levelName}\n\n| Code | Course title | Units | Status |\n|---|---|---|---|\n`
      for (const r of rows) {
        md += `| ${r.code} | ${r.title} | ${r.units} | ${STATUS_LABEL[r.status] ?? r.status} |\n`
      }
    })
    md += `\n`
  }

  // Full course contents + learning outcomes (the syllabus text)
  if (contentsIdx !== -1) {
    md += `## Course contents and learning outcomes\n\n`
    const body = sectionLines.slice(contentsIdx + 1)
    for (const raw of body) {
      const t = raw.trimEnd()
      const heading = t
        .trim()
        .match(/^([A-Z]{2,4}[ -]?\d{3})\s*[:–-]\s*(.+?)\s*(\(\d+\s*Units?.*)?$/)
      if (heading && heading[2] && heading[2].length < 90) {
        md += `\n### ${heading[1].replace(/[ -]?(\d{3})/, ' $1')}: ${heading[2].trim()} ${heading[3] ? heading[3].trim() : ''}\n\n`
      } else if (/^(learning outcomes|course contents)\s*$/i.test(t.trim())) {
        md += `\n**${t.trim()}**\n\n`
      } else if (/^\d00\s+Level\s*$/i.test(t.trim())) {
        md += `\n---\n\n## ${t.trim()} — course contents\n\n`
      } else {
        md += `${t}\n`
      }
    }
  }

  if (structIdx === -1 && contentsIdx === -1) {
    md += `⚠️ Automatic extraction found no standard structure — open the PDF and copy the tables manually.\n\n`
    md += '```\n' + text.slice(0, 4000) + '\n```\n'
  }
  return md
}

// ---------------------------------------------------------------------------

const cache = new Map()
async function loadPdfLines(file) {
  if (cache.has(file)) return cache.get(file)
  const buf = readFileSync(path.join(PDF_DIR, file))
  const { text } = await pdf(buf)
  const disciplineWords = [file.replace('-CCMAS.pdf', '').split('-')[0]]
  const lines = text
    .replace(/[   ]/g, ' ') // non-breaking spaces from PDF cells
    .split('\n')
    .filter((l) => !isJunkLine(l, disciplineWords))
  const entry = { lines, sections: findSections(lines) }
  cache.set(file, entry)
  return entry
}

mkdirSync(OUT_DIR, { recursive: true })
const report = { ok: [], failed: [] }

for (const [slug, cfg] of Object.entries(DEPARTMENTS)) {
  try {
    const { lines, sections } = await loadPdfLines(cfg.file)
    let section =
      matchSection(sections, cfg.keywords) ??
      findSectionByKeyword(lines, sections, cfg.keywords)
    if (!section) {
      report.failed.push({ slug, file: cfg.file, reason: 'no matching programme section' })
      continue
    }
    const deptTitle = slug
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ')
    const md = buildMarkdown(
      slug,
      deptTitle,
      section.title,
      cfg.file,
      lines.slice(section.start, section.end),
    )
    writeFileSync(path.join(OUT_DIR, `${slug}.md`), md)
    report.ok.push(`${slug}  ←  ${section.title}`)
  } catch (e) {
    report.failed.push({ slug, file: cfg.file, reason: e.message })
  }
}

console.log(`\n✅ extracted ${report.ok.length} departments → docs/course-outlines/`)
report.ok.forEach((s) => console.log('   ' + s))
if (report.failed.length) {
  console.log(`\n⚠️ could not extract ${report.failed.length}:`)
  report.failed.forEach((f) => console.log(`   ${f.slug} (${f.file}): ${f.reason}`))
}
