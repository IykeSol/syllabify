# Course outlines for every department — the CCMAS library

> **Already extracted for you:** clean, per-department outlines (structure
> tables + full syllabus text) live in [`docs/course-outlines/`](../course-outlines/README.md)
> — 101 markdown files, one per department, ready to draft PDFs from. Rebuild
> with `npm run outlines`. The rest of this file documents the raw source PDFs.


**Why this works for all 101 universities at once:** since the 2023/2024
session, the NUC's **Core Curriculum and Minimum Academic Standards (CCMAS)**
defines **70% of the curriculum of every degree programme in every Nigerian
university**. Each school only adds its own 30%. So one CCMAS outline per
department is valid for UNILAG, FUTO, Caritas — all of them. Draft your
Syllabify PDFs straight from these documents.

Each PDF contains, per programme:

- the **course structure tables** — every course code, title, units,
  compulsory/elective status, per level (100–400/500) and semester
- the **full content description of each course** (this is the actual
  syllabus — your PDF drafting source)
- philosophy, admission requirements, and graduation requirements

> The PDFs are git-ignored (86 MB). This README is the map; re-download any
> file from the source links below if you ever lose the folder.

---

## 1. `disciplines/` — one PDF covers every department in that discipline

| File | Departments it covers (from the Syllabify seed) | Source |
|---|---|---|
| `Administration-and-Management-CCMAS.pdf` | Accounting, Actuarial Science, Banking & Finance, Business Administration, Entrepreneurship, Insurance, Marketing, Public Administration, Taxation | [GOUNI](https://gouni.edu.ng/wp-content/uploads/2025/09/Administration-and-Management-ALL.pdf) |
| `Agriculture-CCMAS.pdf` | Agriculture, Agric Economics, Agric Extension, Animal Science, Crop Science, Fisheries & Aquaculture, Food Science & Tech, Forestry & Wildlife, Nutrition & Dietetics, Soil Science | [NUC](https://nuc.edu.ng/wp-content/uploads/2022/12/Agriculture-CCMAS.pdf) |
| `Arts-CCMAS.pdf` | Arabic Studies, Christian Religious Studies, English & Literary Studies, Fine & Applied Arts, French, History & Int'l Studies, Islamic Studies, Linguistics, Music, Philosophy, Religious Studies, Theatre Arts | [Trinity](https://www.trinityuniversity.edu.ng/wp-content/uploads/Arts.pdf) |
| `Communication-and-Media-Studies-CCMAS.pdf` | Mass Communication (and its unbundled programmes: Journalism, Broadcasting, PR, Advertising, Film…) | [Trinity](https://www.trinityuniversity.edu.ng/wp-content/uploads/Communication-and-Media-Studies.pdf) |
| `Computing-CCMAS.pdf` | Computer Science, Cyber Security, Information Technology, Software Engineering (+ Data Science, ICT) | [Trinity](https://www.trinityuniversity.edu.ng/wp-content/uploads/Computing.pdf) |
| `Education-CCMAS.pdf` | Adult & Non-Formal Education, Business Education, Early Childhood Education, Educational Management, Guidance & Counselling, Human Kinetics & Health Ed, Library & Information Science, Science Education | [IJBCOE](https://ijbcoe.edu.ng/IJBCOE4/studmat/CCMAS-Education-2023.pdf) |
| `Engineering-CCMAS.pdf` | Agricultural & Bioresources, Biomedical, Chemical, Civil, Computer, Electrical & Electronics, Marine, Mechanical, Mechatronics, Metallurgical & Materials, Petroleum, Telecommunications Engineering | [NUC](https://www.nuc.edu.ng/wp-content/uploads/2022/12/Engineering-CCMAS.pdf) |
| `Sciences-CCMAS.pdf` | Biochemistry, Biology, Biotechnology, Botany, Chemistry, Geology, Geophysics, Industrial Chemistry, Mathematics, Microbiology, Physics, Science Lab Tech, Statistics, Zoology | [Trinity](https://www.trinityuniversity.edu.ng/wp-content/uploads/Sciences.pdf) |
| `Social-Sciences-CCMAS.pdf` | Criminology & Security Studies, Demography & Social Statistics, Economics, Geography, International Relations, Peace & Conflict Studies, Political Science, Psychology, Social Work, Sociology | [NUC](https://www.nuc.edu.ng/wp-content/uploads/2026/03/Social-Sciences-CCMAS-FINAL-2023-A.pdf) |

## 2. `programmes/` — 38 single-programme handbooks (fastest for drafting)

CCMAS-aligned handbooks published by Godfrey Okoye University — one PDF per
programme, so you can open exactly the department you're drafting:

- **Management/Social Sciences:** Accounting, Banking & Finance, Business
  Administration, Economics, International Relations, Management, Marketing,
  Mass Communication, Political Science, Psychology, Public Administration,
  Sociology
- **Sciences:** Architecture, Biochemistry, Biology, Biotechnology, Chemistry,
  Computer Science, Industrial Chemistry, Industrial Physics, Mathematics,
  Microbiology, Physics, Physics with Electronics
- **Arts:** English & Literary Studies, History & Int'l Studies, Music,
  Philosophy
- **Law:** LLB Law
- **Education:** English Language, Economics, Biology, Business Education,
  Chemistry, Computer Science, Physics, Political Science, Social Studies

Source pattern: `https://gouni.edu.ng/wp-content/uploads/2025/09/<NAME>.pdf`
(index at [gouni.edu.ng/core-curriculum-minimum-academic-standards-ccmas](https://gouni.edu.ng/core-curriculum-minimum-academic-standards-ccmas/)).

## 3. All 17 disciplines — now complete

Every discipline is downloaded. The nuc-ccmas.ng portal (login-walled and
frequently down) turned out to be unnecessary: the **main NUC site** hosts all
17 volumes openly under `https://www.nuc.edu.ng/wp-content/uploads/2026/03/`.
The remaining disciplines that fill in the last departments:

| Discipline file | Covers (from the Syllabify seed) |
|---|---|
| `Allied-Health-Sciences-CCMAS.pdf` | Medical Laboratory Science, Nursing Science, Optometry, Physiotherapy, Public Health, Radiography, Nutrition & Dietetics |
| `Basic-Medical-Sciences-CCMAS.pdf` | Anatomy, Physiology |
| `Medicine-and-Dentistry-CCMAS.pdf` | Medicine & Surgery, Dentistry |
| `Pharmacy-CCMAS.pdf` | Pharmacy |
| `Environmental-Sciences-CCMAS.pdf` | Building, Environmental Management, Estate Management, Quantity Surveying, Surveying & Geoinformatics, Urban & Regional Planning, Geography, Fine & Applied Arts |
| `Architecture-CCMAS.pdf` | Architecture |
| `Veterinary-Medicine-CCMAS.pdf` | Veterinary Medicine |
| `Law-CCMAS.pdf` | Law, Common & Islamic Law |

---

## Drafting workflow for Syllabify

1. Open the department's PDF and find its **course structure table**
   (e.g. Computer Science 200 Level, First Semester).
2. For each course (e.g. **COS 201 — Computer Programming I, 3 units**),
   the same PDF has the full content description a few pages later — that is
   your syllabus text. Add past questions/notes per topic as you gather them.
3. In Syllabify admin: create the course as *University course* → pick
   university ("All universities" is correct for the CCMAS 70% core) and the
   department → upload your drafted PDF as a material.
4. Universal 100-level courses (GST 111/112, MTH 101/102, PHY 101/102…) appear
   in every discipline document — draft those once, they serve everyone.

**Common core to remember (all programmes):** GST 111 Communication in
English, GST 112 Nigerian Peoples & Culture, GST 212 Philosophy/Logic,
GST 312 Peace & Conflict Resolution, ENT 211 Entrepreneurship & Innovation,
ENT 312 Venture Creation — 12 units every student takes.

**⚠️ Skip school-prefixed courses when drafting the universal core.** In the
`programmes/` handbooks, codes like `GOU-ACC 201` are Godfrey Okoye's own 30%
local additions — not part of the national curriculum. Draft only the plain
codes (ACC 201, COS 102, GST 111…), which are identical in every university.
The `disciplines/` PDFs contain the pure national core with no local extras.
