-- Syllabify — universities & departments
--
-- Adds the two lookup tables the catalogue targets, links courses to them,
-- and seeds 101 Nigerian universities (the EduRank/Webometrics top-100 plus
-- Caritas University, Enugu) and the standard NUC degree programmes.
-- Universities can be delisted from /admin/universities via `is_active`.

-- =====================================================================
-- Tables
-- =====================================================================

create table if not exists public.universities (
  id           uuid default gen_random_uuid() primary key,
  name         text not null unique,
  slug         text not null unique,
  abbreviation text,
  state        text not null,
  ownership    text not null check (ownership in ('federal', 'state', 'private')),
  is_active    boolean default true,
  created_at   timestamptz default now()
);

create table if not exists public.departments (
  id         uuid default gen_random_uuid() primary key,
  name       text not null unique,
  slug       text not null unique,
  faculty    text,
  created_at timestamptz default now()
);

-- A course (syllabus) can target one university and/or one department.
-- Both are optional: null = "applies to every school / every department".
alter table public.courses
  add column if not exists university_id uuid references public.universities(id) on delete set null,
  add column if not exists department_id uuid references public.departments(id) on delete set null;

create index if not exists idx_courses_university on public.courses(university_id);
create index if not exists idx_courses_department on public.courses(department_id);
create index if not exists idx_universities_active on public.universities(is_active);

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table public.universities enable row level security;

-- Students and the public only ever see listed (active) universities.
-- Admin reads/writes go through the service-role client, which bypasses RLS,
-- so delisted rows stay visible in /admin.
create policy "Anyone can read active universities"
  on public.universities for select
  using (is_active = true);

alter table public.departments enable row level security;

create policy "Anyone can read departments"
  on public.departments for select
  using (true);

-- =====================================================================
-- Seed: universities
-- Source: EduRank ranking of Nigerian universities (top 100), plus
-- Caritas University, Enugu. Renamed institutions use their current
-- official names (e.g. Modibbo Adama University, Prince Abubakar Audu
-- University).
-- =====================================================================

insert into public.universities (name, slug, abbreviation, state, ownership) values
  ('University of Ibadan', 'university-of-ibadan', 'UI', 'Oyo', 'federal'),
  ('University of Lagos', 'university-of-lagos', 'UNILAG', 'Lagos', 'federal'),
  ('University of Nigeria, Nsukka', 'university-of-nigeria-nsukka', 'UNN', 'Enugu', 'federal'),
  ('Obafemi Awolowo University', 'obafemi-awolowo-university', 'OAU', 'Osun', 'federal'),
  ('Ahmadu Bello University', 'ahmadu-bello-university', 'ABU', 'Kaduna', 'federal'),
  ('Covenant University', 'covenant-university', 'CU', 'Ogun', 'private'),
  ('Nnamdi Azikiwe University', 'nnamdi-azikiwe-university', 'UNIZIK', 'Anambra', 'federal'),
  ('University of Ilorin', 'university-of-ilorin', 'UNILORIN', 'Kwara', 'federal'),
  ('University of Benin', 'university-of-benin', 'UNIBEN', 'Edo', 'federal'),
  ('University of Port Harcourt', 'university-of-port-harcourt', 'UNIPORT', 'Rivers', 'federal'),
  ('Lagos State University', 'lagos-state-university', 'LASU', 'Lagos', 'state'),
  ('Federal University of Technology, Akure', 'federal-university-of-technology-akure', 'FUTA', 'Ondo', 'federal'),
  ('Bayero University Kano', 'bayero-university-kano', 'BUK', 'Kano', 'federal'),
  ('University of Jos', 'university-of-jos', 'UNIJOS', 'Plateau', 'federal'),
  ('University of Calabar', 'university-of-calabar', 'UNICAL', 'Cross River', 'federal'),
  ('Olabisi Onabanjo University', 'olabisi-onabanjo-university', 'OOU', 'Ogun', 'state'),
  ('Ladoke Akintola University of Technology', 'ladoke-akintola-university-of-technology', 'LAUTECH', 'Oyo', 'state'),
  ('University of Abuja', 'university-of-abuja', 'UNIABUJA', 'FCT Abuja', 'federal'),
  ('Babcock University', 'babcock-university', 'BU', 'Ogun', 'private'),
  ('Federal University of Technology, Minna', 'federal-university-of-technology-minna', 'FUTMINNA', 'Niger', 'federal'),
  ('Usmanu Danfodiyo University, Sokoto', 'usmanu-danfodiyo-university-sokoto', 'UDUS', 'Sokoto', 'federal'),
  ('University of Uyo', 'university-of-uyo', 'UNIUYO', 'Akwa Ibom', 'federal'),
  ('Afe Babalola University', 'afe-babalola-university', 'ABUAD', 'Ekiti', 'private'),
  ('Federal University of Technology, Owerri', 'federal-university-of-technology-owerri', 'FUTO', 'Imo', 'federal'),
  ('Federal University of Agriculture, Abeokuta', 'federal-university-of-agriculture-abeokuta', 'FUNAAB', 'Ogun', 'federal'),
  ('Redeemer''s University', 'redeemers-university', 'RUN', 'Osun', 'private'),
  ('Kwara State University', 'kwara-state-university', 'KWASU', 'Kwara', 'state'),
  ('Rivers State University', 'rivers-state-university', 'RSU', 'Rivers', 'state'),
  ('University of Maiduguri', 'university-of-maiduguri', 'UNIMAID', 'Borno', 'federal'),
  ('Abubakar Tafawa Balewa University', 'abubakar-tafawa-balewa-university', 'ATBU', 'Bauchi', 'federal'),
  ('Delta State University, Abraka', 'delta-state-university-abraka', 'DELSU', 'Delta', 'state'),
  ('Landmark University', 'landmark-university', 'LMU', 'Kwara', 'private'),
  ('Ebonyi State University', 'ebonyi-state-university', 'EBSU', 'Ebonyi', 'state'),
  ('Michael Okpara University of Agriculture, Umudike', 'michael-okpara-university-of-agriculture-umudike', 'MOUAU', 'Abia', 'federal'),
  ('Ekiti State University', 'ekiti-state-university', 'EKSU', 'Ekiti', 'state'),
  ('Nasarawa State University, Keffi', 'nasarawa-state-university-keffi', 'NSUK', 'Nasarawa', 'state'),
  ('Benue State University', 'benue-state-university', 'BSU', 'Benue', 'state'),
  ('Enugu State University of Science and Technology', 'enugu-state-university-of-science-and-technology', 'ESUT', 'Enugu', 'state'),
  ('Ambrose Alli University', 'ambrose-alli-university', 'AAU', 'Edo', 'state'),
  ('Lead City University', 'lead-city-university', 'LCU', 'Oyo', 'private'),
  ('Bowen University', 'bowen-university', 'BOWEN', 'Osun', 'private'),
  ('Adekunle Ajasin University', 'adekunle-ajasin-university', 'AAUA', 'Ondo', 'state'),
  ('Federal University, Oye-Ekiti', 'federal-university-oye-ekiti', 'FUOYE', 'Ekiti', 'federal'),
  ('Federal University, Lokoja', 'federal-university-lokoja', 'FULOKOJA', 'Kogi', 'federal'),
  ('Niger Delta University', 'niger-delta-university', 'NDU', 'Bayelsa', 'state'),
  ('Abia State University', 'abia-state-university', 'ABSU', 'Abia', 'state'),
  ('Kaduna State University', 'kaduna-state-university', 'KASU', 'Kaduna', 'state'),
  ('Pan-Atlantic University', 'pan-atlantic-university', 'PAU', 'Lagos', 'private'),
  ('Gombe State University', 'gombe-state-university', 'GSU', 'Gombe', 'state'),
  ('Federal University of Petroleum Resources, Effurun', 'federal-university-of-petroleum-resources-effurun', 'FUPRE', 'Delta', 'federal'),
  ('Imo State University', 'imo-state-university', 'IMSU', 'Imo', 'state'),
  ('Chukwuemeka Odumegwu Ojukwu University', 'chukwuemeka-odumegwu-ojukwu-university', 'COOU', 'Anambra', 'state'),
  ('American University of Nigeria', 'american-university-of-nigeria', 'AUN', 'Adamawa', 'private'),
  ('Joseph Sarwuan Tarka University, Makurdi', 'joseph-sarwuan-tarka-university-makurdi', 'JOSTUM', 'Benue', 'federal'),
  ('Bells University of Technology', 'bells-university-of-technology', 'BELLSTECH', 'Ogun', 'private'),
  ('Ajayi Crowther University', 'ajayi-crowther-university', 'ACU', 'Oyo', 'private'),
  ('Osun State University', 'osun-state-university', 'UNIOSUN', 'Osun', 'state'),
  ('Tai Solarin University of Education', 'tai-solarin-university-of-education', 'TASUED', 'Ogun', 'state'),
  ('Igbinedion University, Okada', 'igbinedion-university-okada', 'IUO', 'Edo', 'private'),
  ('Akwa Ibom State University', 'akwa-ibom-state-university', 'AKSU', 'Akwa Ibom', 'state'),
  ('Umaru Musa Yar''Adua University', 'umaru-musa-yaradua-university', 'UMYU', 'Katsina', 'state'),
  ('Federal University, Birnin Kebbi', 'federal-university-birnin-kebbi', 'FUBK', 'Kebbi', 'federal'),
  ('Benson Idahosa University', 'benson-idahosa-university', 'BIU', 'Edo', 'private'),
  ('Federal University, Lafia', 'federal-university-lafia', 'FULAFIA', 'Nasarawa', 'federal'),
  ('Modibbo Adama University', 'modibbo-adama-university', 'MAU', 'Adamawa', 'federal'),
  ('Adeleke University', 'adeleke-university', 'AU', 'Osun', 'private'),
  ('African University of Science and Technology', 'african-university-of-science-and-technology', 'AUST', 'FCT Abuja', 'private'),
  ('Bingham University', 'bingham-university', 'BHU', 'Nasarawa', 'private'),
  ('Federal University, Otuoke', 'federal-university-otuoke', 'FUOTUOKE', 'Bayelsa', 'federal'),
  ('Olusegun Agagu University of Science and Technology', 'olusegun-agagu-university-of-science-and-technology', 'OAUSTECH', 'Ondo', 'state'),
  ('Fountain University, Osogbo', 'fountain-university-osogbo', 'FUO', 'Osun', 'private'),
  ('Paul University', 'paul-university', 'PUA', 'Anambra', 'private'),
  ('Joseph Ayo Babalola University', 'joseph-ayo-babalola-university', 'JABU', 'Osun', 'private'),
  ('Caleb University', 'caleb-university', 'CALEB', 'Lagos', 'private'),
  ('Adamawa State University', 'adamawa-state-university', 'ADSU', 'Adamawa', 'state'),
  ('Prince Abubakar Audu University', 'prince-abubakar-audu-university', 'PAAU', 'Kogi', 'state'),
  ('Novena University', 'novena-university', 'NU', 'Delta', 'private'),
  ('Crescent University, Abeokuta', 'crescent-university-abeokuta', 'CUAB', 'Ogun', 'private'),
  ('Wellspring University', 'wellspring-university', 'WU', 'Edo', 'private'),
  ('Alex Ekwueme Federal University, Ndufu-Alike', 'alex-ekwueme-federal-university-ndufu-alike', 'AE-FUNAI', 'Ebonyi', 'federal'),
  ('Baze University', 'baze-university', 'BAZE', 'FCT Abuja', 'private'),
  ('Nile University of Nigeria', 'nile-university-of-nigeria', 'NUN', 'FCT Abuja', 'private'),
  ('Madonna University, Okija', 'madonna-university-okija', 'MU', 'Anambra', 'private'),
  ('Crawford University', 'crawford-university', 'CRU', 'Ogun', 'private'),
  ('Kings University', 'kings-university', 'KINGS', 'Osun', 'private'),
  ('Moshood Abiola University of Science and Technology, Abeokuta', 'moshood-abiola-university-of-science-and-technology-abeokuta', 'MAUSTECH', 'Ogun', 'state'),
  ('Godfrey Okoye University', 'godfrey-okoye-university', 'GOUNI', 'Enugu', 'private'),
  ('Federal University, Kashere', 'federal-university-kashere', 'FUKASHERE', 'Gombe', 'federal'),
  ('Sokoto State University', 'sokoto-state-university', 'SSU', 'Sokoto', 'state'),
  ('First Technical University, Ibadan', 'first-technical-university-ibadan', 'TECH-U', 'Oyo', 'state'),
  ('Ignatius Ajuru University of Education', 'ignatius-ajuru-university-of-education', 'IAUE', 'Rivers', 'state'),
  ('Dominican University, Ibadan', 'dominican-university-ibadan', 'DUI', 'Oyo', 'private'),
  ('University of Medical Sciences, Ondo', 'university-of-medical-sciences-ondo', 'UNIMED', 'Ondo', 'state'),
  ('Federal University, Dutse', 'federal-university-dutse', 'FUD', 'Jigawa', 'federal'),
  ('Federal University, Dutsin-Ma', 'federal-university-dutsin-ma', 'FUDMA', 'Katsina', 'federal'),
  ('Southwestern University, Nigeria', 'southwestern-university-nigeria', 'SUN', 'Ogun', 'private'),
  ('Aliko Dangote University of Science and Technology, Wudil', 'aliko-dangote-university-of-science-and-technology-wudil', 'ADUSTECH', 'Kano', 'state'),
  ('Tansian University', 'tansian-university', 'TANU', 'Anambra', 'private'),
  ('Yobe State University', 'yobe-state-university', 'YSU', 'Yobe', 'state'),
  ('Taraba State University', 'taraba-state-university', 'TSU', 'Taraba', 'state'),
  ('Caritas University', 'caritas-university', 'CARITAS', 'Enugu', 'private')
on conflict (name) do nothing;

-- =====================================================================
-- Seed: departments (standard NUC degree programmes, grouped by faculty)
-- =====================================================================

insert into public.departments (name, slug, faculty) values
  -- Administration & Management
  ('Accounting', 'accounting', 'Administration & Management'),
  ('Actuarial Science', 'actuarial-science', 'Administration & Management'),
  ('Banking and Finance', 'banking-and-finance', 'Administration & Management'),
  ('Business Administration', 'business-administration', 'Administration & Management'),
  ('Entrepreneurship', 'entrepreneurship', 'Administration & Management'),
  ('Insurance', 'insurance', 'Administration & Management'),
  ('Marketing', 'marketing', 'Administration & Management'),
  ('Public Administration', 'public-administration', 'Administration & Management'),
  ('Taxation', 'taxation', 'Administration & Management'),
  -- Agriculture
  ('Agricultural Economics', 'agricultural-economics', 'Agriculture'),
  ('Agricultural Extension', 'agricultural-extension', 'Agriculture'),
  ('Agriculture', 'agriculture', 'Agriculture'),
  ('Animal Science', 'animal-science', 'Agriculture'),
  ('Crop Science', 'crop-science', 'Agriculture'),
  ('Fisheries and Aquaculture', 'fisheries-and-aquaculture', 'Agriculture'),
  ('Food Science and Technology', 'food-science-and-technology', 'Agriculture'),
  ('Forestry and Wildlife Management', 'forestry-and-wildlife-management', 'Agriculture'),
  ('Nutrition and Dietetics', 'nutrition-and-dietetics', 'Agriculture'),
  ('Soil Science', 'soil-science', 'Agriculture'),
  -- Arts & Humanities
  ('Arabic Studies', 'arabic-studies', 'Arts & Humanities'),
  ('Christian Religious Studies', 'christian-religious-studies', 'Arts & Humanities'),
  ('English and Literary Studies', 'english-and-literary-studies', 'Arts & Humanities'),
  ('Fine and Applied Arts', 'fine-and-applied-arts', 'Arts & Humanities'),
  ('French', 'french', 'Arts & Humanities'),
  ('History and International Studies', 'history-and-international-studies', 'Arts & Humanities'),
  ('Islamic Studies', 'islamic-studies', 'Arts & Humanities'),
  ('Linguistics', 'linguistics', 'Arts & Humanities'),
  ('Music', 'music', 'Arts & Humanities'),
  ('Philosophy', 'philosophy', 'Arts & Humanities'),
  ('Religious Studies', 'religious-studies', 'Arts & Humanities'),
  ('Theatre Arts', 'theatre-arts', 'Arts & Humanities'),
  -- Education
  ('Adult and Non-Formal Education', 'adult-and-non-formal-education', 'Education'),
  ('Business Education', 'business-education', 'Education'),
  ('Early Childhood Education', 'early-childhood-education', 'Education'),
  ('Educational Management', 'educational-management', 'Education'),
  ('Guidance and Counselling', 'guidance-and-counselling', 'Education'),
  ('Human Kinetics and Health Education', 'human-kinetics-and-health-education', 'Education'),
  ('Library and Information Science', 'library-and-information-science', 'Education'),
  ('Science Education', 'science-education', 'Education'),
  -- Engineering
  ('Agricultural and Bioresources Engineering', 'agricultural-and-bioresources-engineering', 'Engineering'),
  ('Biomedical Engineering', 'biomedical-engineering', 'Engineering'),
  ('Chemical Engineering', 'chemical-engineering', 'Engineering'),
  ('Civil Engineering', 'civil-engineering', 'Engineering'),
  ('Computer Engineering', 'computer-engineering', 'Engineering'),
  ('Electrical and Electronics Engineering', 'electrical-and-electronics-engineering', 'Engineering'),
  ('Marine Engineering', 'marine-engineering', 'Engineering'),
  ('Mechanical Engineering', 'mechanical-engineering', 'Engineering'),
  ('Mechatronics Engineering', 'mechatronics-engineering', 'Engineering'),
  ('Metallurgical and Materials Engineering', 'metallurgical-and-materials-engineering', 'Engineering'),
  ('Petroleum Engineering', 'petroleum-engineering', 'Engineering'),
  ('Telecommunications Engineering', 'telecommunications-engineering', 'Engineering'),
  -- Environmental Sciences
  ('Architecture', 'architecture', 'Environmental Sciences'),
  ('Building', 'building', 'Environmental Sciences'),
  ('Environmental Management', 'environmental-management', 'Environmental Sciences'),
  ('Estate Management', 'estate-management', 'Environmental Sciences'),
  ('Quantity Surveying', 'quantity-surveying', 'Environmental Sciences'),
  ('Surveying and Geoinformatics', 'surveying-and-geoinformatics', 'Environmental Sciences'),
  ('Urban and Regional Planning', 'urban-and-regional-planning', 'Environmental Sciences'),
  -- Law
  ('Common and Islamic Law', 'common-and-islamic-law', 'Law'),
  ('Law', 'law', 'Law'),
  -- Medical & Health Sciences
  ('Anatomy', 'anatomy', 'Medical & Health Sciences'),
  ('Dentistry', 'dentistry', 'Medical & Health Sciences'),
  ('Medical Laboratory Science', 'medical-laboratory-science', 'Medical & Health Sciences'),
  ('Medicine and Surgery', 'medicine-and-surgery', 'Medical & Health Sciences'),
  ('Nursing Science', 'nursing-science', 'Medical & Health Sciences'),
  ('Optometry', 'optometry', 'Medical & Health Sciences'),
  ('Pharmacy', 'pharmacy', 'Medical & Health Sciences'),
  ('Physiology', 'physiology', 'Medical & Health Sciences'),
  ('Physiotherapy', 'physiotherapy', 'Medical & Health Sciences'),
  ('Public Health', 'public-health', 'Medical & Health Sciences'),
  ('Radiography', 'radiography', 'Medical & Health Sciences'),
  ('Veterinary Medicine', 'veterinary-medicine', 'Medical & Health Sciences'),
  -- Sciences
  ('Biochemistry', 'biochemistry', 'Sciences'),
  ('Biology', 'biology', 'Sciences'),
  ('Biotechnology', 'biotechnology', 'Sciences'),
  ('Botany', 'botany', 'Sciences'),
  ('Chemistry', 'chemistry', 'Sciences'),
  ('Computer Science', 'computer-science', 'Sciences'),
  ('Cyber Security', 'cyber-security', 'Sciences'),
  ('Geology', 'geology', 'Sciences'),
  ('Geophysics', 'geophysics', 'Sciences'),
  ('Industrial Chemistry', 'industrial-chemistry', 'Sciences'),
  ('Information Technology', 'information-technology', 'Sciences'),
  ('Mathematics', 'mathematics', 'Sciences'),
  ('Microbiology', 'microbiology', 'Sciences'),
  ('Physics', 'physics', 'Sciences'),
  ('Science Laboratory Technology', 'science-laboratory-technology', 'Sciences'),
  ('Software Engineering', 'software-engineering', 'Sciences'),
  ('Statistics', 'statistics', 'Sciences'),
  ('Zoology', 'zoology', 'Sciences'),
  -- Social Sciences
  ('Criminology and Security Studies', 'criminology-and-security-studies', 'Social Sciences'),
  ('Demography and Social Statistics', 'demography-and-social-statistics', 'Social Sciences'),
  ('Economics', 'economics', 'Social Sciences'),
  ('Geography', 'geography', 'Social Sciences'),
  ('International Relations', 'international-relations', 'Social Sciences'),
  ('Mass Communication', 'mass-communication', 'Social Sciences'),
  ('Peace and Conflict Studies', 'peace-and-conflict-studies', 'Social Sciences'),
  ('Political Science', 'political-science', 'Social Sciences'),
  ('Psychology', 'psychology', 'Social Sciences'),
  ('Social Work', 'social-work', 'Social Sciences'),
  ('Sociology', 'sociology', 'Social Sciences')
on conflict (name) do nothing;
