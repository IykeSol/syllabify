# Course outlines — one clean file per department

**101 department outlines, ready to draft Syllabify PDFs from.** Each file is
the NUC CCMAS national curriculum (the 70% every Nigerian university shares)
for that department, extracted from the official PDFs in `docs/ccmas/`.

Every file has the same shape — use it as your drafting template:

1. **Course structure** — the tables per level (100→400/500/600), each row a
   course code, title, units, and status (Compulsory / Elective / Required).
2. **Course contents and learning outcomes** — the full syllabus text for
   every course: what it covers and what a student should be able to do. This
   is your source material; add your own notes and past questions per topic.

Regenerate everything from the PDFs any time:

```bash
npm run outlines      # writes all 101 files here
```

(Script: [`scripts/extract-ccmas-outlines.mjs`](../../scripts/extract-ccmas-outlines.mjs).)

## Known source-PDF limitations

- A few **Sciences** programmes (e.g. Chemistry, Physics) have their 300/400
  level *structure tables* rendered as images in the official PDF, so those
  two summary tables come out blank. The **course contents for every level are
  still complete** — nothing is missing for drafting, only the tabular summary.
- Large files are correct, not bugs: **Medicine & Surgery**, **Dentistry**,
  **Science Laboratory Technology**, **Pharmacy**, and **Fine & Applied Arts**
  are long, multi-year or multi-option programmes.

## How to draft a course in Syllabify

1. Open the department file (e.g. `computer-science.md`), pick a course
   (e.g. **COS 201 — Computer Programming I**).
2. Its "Course contents" paragraph is your syllabus body; expand it with your
   notes and past questions.
3. In admin: **New course** → type *University course* → choose the university
   ("All universities" matches the shared 70% core) and this department →
   upload your drafted PDF as a material.
4. The shared 100-level core (GST 111/112, MTH 101/102, PHY 101/102, ENT 211,
   GST 212/312, ENT 312…) repeats across every department — draft those once.

---

## All 101 departments

| Department | File | Courses |
|---|---|---|
| Accounting | [accounting.md](accounting.md) | 35 |
| Actuarial Science | [actuarial-science.md](actuarial-science.md) | 39 |
| Adult & Non-Formal Education | [adult-and-non-formal-education.md](adult-and-non-formal-education.md) | 91 |
| Agricultural & Bioresources Engineering | [agricultural-and-bioresources-engineering.md](agricultural-and-bioresources-engineering.md) | 59 |
| Agricultural Economics | [agricultural-economics.md](agricultural-economics.md) | 48 |
| Agricultural Extension | [agricultural-extension.md](agricultural-extension.md) | 47 |
| Agriculture | [agriculture.md](agriculture.md) | 61 |
| Anatomy | [anatomy.md](anatomy.md) | 49 |
| Animal Science | [animal-science.md](animal-science.md) | 48 |
| Arabic Studies | [arabic-studies.md](arabic-studies.md) | 47 |
| Architecture | [architecture.md](architecture.md) | 42 |
| Banking & Finance | [banking-and-finance.md](banking-and-finance.md) | 38 |
| Biochemistry | [biochemistry.md](biochemistry.md) | 46 |
| Biology | [biology.md](biology.md) | 45 |
| Biomedical Engineering | [biomedical-engineering.md](biomedical-engineering.md) | 59 |
| Biotechnology | [biotechnology.md](biotechnology.md) | 45 |
| Botany | [botany.md](botany.md) | 40 |
| Building | [building.md](building.md) | 53 |
| Business Administration | [business-administration.md](business-administration.md) | 30 |
| Business Education | [business-education.md](business-education.md) | 57 |
| Chemical Engineering | [chemical-engineering.md](chemical-engineering.md) | 51 |
| Chemistry | [chemistry.md](chemistry.md) | 18* |
| Christian Religious Studies | [christian-religious-studies.md](christian-religious-studies.md) | 37 |
| Civil Engineering | [civil-engineering.md](civil-engineering.md) | 55 |
| Common & Islamic Law | [common-and-islamic-law.md](common-and-islamic-law.md) | 53 |
| Computer Engineering | [computer-engineering.md](computer-engineering.md) | 55 |
| Computer Science | [computer-science.md](computer-science.md) | 42 |
| Criminology & Security Studies | [criminology-and-security-studies.md](criminology-and-security-studies.md) | 38 |
| Crop Science | [crop-science.md](crop-science.md) | 49 |
| Cyber Security | [cyber-security.md](cyber-security.md) | 43 |
| Demography & Social Statistics | [demography-and-social-statistics.md](demography-and-social-statistics.md) | 42 |
| Dentistry | [dentistry.md](dentistry.md) | 185 |
| Early Childhood Education | [early-childhood-education.md](early-childhood-education.md) | 33 |
| Economics | [economics.md](economics.md) | 41 |
| Educational Management | [educational-management.md](educational-management.md) | 32 |
| Electrical & Electronics Engineering | [electrical-and-electronics-engineering.md](electrical-and-electronics-engineering.md) | 56 |
| English & Literary Studies | [english-and-literary-studies.md](english-and-literary-studies.md) | 70 |
| Entrepreneurship | [entrepreneurship.md](entrepreneurship.md) | 41 |
| Environmental Management | [environmental-management.md](environmental-management.md) | 36 |
| Estate Management | [estate-management.md](estate-management.md) | 49 |
| Fine & Applied Arts | [fine-and-applied-arts.md](fine-and-applied-arts.md) | 193 |
| Fisheries & Aquaculture | [fisheries-and-aquaculture.md](fisheries-and-aquaculture.md) | 43 |
| Food Science & Technology | [food-science-and-technology.md](food-science-and-technology.md) | 50 |
| Forestry & Wildlife Management | [forestry-and-wildlife-management.md](forestry-and-wildlife-management.md) | 53 |
| French | [french.md](french.md) | 44 |
| Geography | [geography.md](geography.md) | 38 |
| Geology | [geology.md](geology.md) | 40 |
| Geophysics | [geophysics.md](geophysics.md) | 38 |
| Guidance & Counselling | [guidance-and-counselling.md](guidance-and-counselling.md) | 31 |
| History & International Studies | [history-and-international-studies.md](history-and-international-studies.md) | 37 |
| Human Kinetics & Health Education | [human-kinetics-and-health-education.md](human-kinetics-and-health-education.md) | 13* |
| Industrial Chemistry | [industrial-chemistry.md](industrial-chemistry.md) | 45 |
| Information Technology | [information-technology.md](information-technology.md) | 43 |
| Insurance | [insurance.md](insurance.md) | 35 |
| International Relations | [international-relations.md](international-relations.md) | 42 |
| Islamic Studies | [islamic-studies.md](islamic-studies.md) | 45 |
| Law | [law.md](law.md) | 42 |
| Library & Information Science | [library-and-information-science.md](library-and-information-science.md) | 33 |
| Linguistics | [linguistics.md](linguistics.md) | 39 |
| Marine Engineering | [marine-engineering.md](marine-engineering.md) | 84 |
| Marketing | [marketing.md](marketing.md) | 43 |
| Mass Communication | [mass-communication.md](mass-communication.md) | 63 |
| Mathematics | [mathematics.md](mathematics.md) | 34 |
| Mechanical Engineering | [mechanical-engineering.md](mechanical-engineering.md) | 53 |
| Mechatronics Engineering | [mechatronics-engineering.md](mechatronics-engineering.md) | 57 |
| Medical Laboratory Science | [medical-laboratory-science.md](medical-laboratory-science.md) | 68 |
| Medicine & Surgery | [medicine-and-surgery.md](medicine-and-surgery.md) | 241 |
| Metallurgical & Materials Engineering | [metallurgical-and-materials-engineering.md](metallurgical-and-materials-engineering.md) | 52 |
| Microbiology | [microbiology.md](microbiology.md) | 43 |
| Music | [music.md](music.md) | 51 |
| Nursing Science | [nursing-science.md](nursing-science.md) | 69 |
| Nutrition & Dietetics | [nutrition-and-dietetics.md](nutrition-and-dietetics.md) | 56 |
| Optometry | [optometry.md](optometry.md) | 94 |
| Peace & Conflict Studies | [peace-and-conflict-studies.md](peace-and-conflict-studies.md) | 42 |
| Petroleum Engineering | [petroleum-engineering.md](petroleum-engineering.md) | 53 |
| Pharmacy | [pharmacy.md](pharmacy.md) | 90 |
| Philosophy | [philosophy.md](philosophy.md) | 44 |
| Physics | [physics.md](physics.md) | 92 |
| Physiology | [physiology.md](physiology.md) | 45 |
| Physiotherapy | [physiotherapy.md](physiotherapy.md) | 78 |
| Political Science | [political-science.md](political-science.md) | 45 |
| Psychology | [psychology.md](psychology.md) | 45 |
| Public Administration | [public-administration.md](public-administration.md) | 41 |
| Public Health | [public-health.md](public-health.md) | 47 |
| Quantity Surveying | [quantity-surveying.md](quantity-surveying.md) | 40 |
| Radiography | [radiography.md](radiography.md) | 67 |
| Religious Studies | [religious-studies.md](religious-studies.md) | 45 |
| Science Education | [science-education.md](science-education.md) | 34 |
| Science Laboratory Technology | [science-laboratory-technology.md](science-laboratory-technology.md) | 251 |
| Social Work | [social-work.md](social-work.md) | 37 |
| Sociology | [sociology.md](sociology.md) | 38 |
| Software Engineering | [software-engineering.md](software-engineering.md) | 42 |
| Soil Science | [soil-science.md](soil-science.md) | 50 |
| Statistics | [statistics.md](statistics.md) | 35 |
| Surveying & Geoinformatics | [surveying-and-geoinformatics.md](surveying-and-geoinformatics.md) | 50 |
| Taxation | [taxation.md](taxation.md) | 47 |
| Telecommunications Engineering | [telecommunications-engineering.md](telecommunications-engineering.md) | 58 |
| Theatre Arts | [theatre-arts.md](theatre-arts.md) | 41 |
| Urban & Regional Planning | [urban-and-regional-planning.md](urban-and-regional-planning.md) | 47 |
| Veterinary Medicine | [veterinary-medicine.md](veterinary-medicine.md) | 103 |
| Zoology | [zoology.md](zoology.md) | 39 |

\* Structure-table row count only; the full course contents for all levels are
present in the file (see limitations above).

The department slugs here match the `slug` column in the `departments` table
([supabase/migrations/0002_universities.sql](../../supabase/migrations/0002_universities.sql)),
so you can map an outline straight to the department you pick in admin.
