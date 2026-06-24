"""
Synthetic Rwanda Research Dataset
Case study context: NCST (National Council for Science and Technology), Rwanda.
All data is synthetic but grounded in real Rwandan institutions, research themes, and funders.
"""

from typing import List, Dict, Any

RESEARCHERS: List[Dict[str, Any]] = [
    {
        "id": "RWR001", "name": "Dr. Anastase Ndayisaba",
        "institution": "University of Rwanda", "department": "School of Agriculture",
        "position": "Associate Professor", "career_stage": "mid",
        "email": "a.ndayisaba@ur.ac.rw", "orcid": "0000-0001-2345-6789",
        "publication_ids": ["PUB001","PUB002","PUB003","PUB004"], "h_index": 6
    },
    {
        "id": "RWR002", "name": "Prof. Marie-Claire Uwimana",
        "institution": "University of Rwanda", "department": "School of Agriculture",
        "position": "Professor", "career_stage": "senior",
        "email": "mc.uwimana@ur.ac.rw", "orcid": "0000-0002-3456-7890",
        "publication_ids": ["PUB005","PUB006","PUB007","PUB008","PUB009"], "h_index": 12
    },
    {
        "id": "RWR003", "name": "Dr. Emmanuel Kabanda",
        "institution": "University of Rwanda", "department": "School of Medicine and Health Sciences",
        "position": "Senior Lecturer", "career_stage": "mid",
        "email": "e.kabanda@ur.ac.rw", "orcid": "0000-0003-4567-8901",
        "publication_ids": ["PUB010","PUB011","PUB012"], "h_index": 5
    },
    {
        "id": "RWR004", "name": "Prof. Jeanne Mukamana",
        "institution": "University of Rwanda", "department": "School of Medicine and Health Sciences",
        "position": "Professor", "career_stage": "senior",
        "email": "j.mukamana@ur.ac.rw", "orcid": "0000-0004-5678-9012",
        "publication_ids": ["PUB013","PUB014","PUB015","PUB016"], "h_index": 15
    },
    {
        "id": "RWR005", "name": "Dr. Patrick Nzabonimana",
        "institution": "University of Rwanda", "department": "School of ICT",
        "position": "Lecturer", "career_stage": "junior",
        "email": "p.nzabonimana@ur.ac.rw", "orcid": "0000-0005-6789-0123",
        "publication_ids": ["PUB017","PUB018","PUB019"], "h_index": 3
    },
    {
        "id": "RWR006", "name": "Dr. Alice Muhirwa",
        "institution": "University of Rwanda", "department": "School of ICT",
        "position": "Associate Professor", "career_stage": "mid",
        "email": "a.muhirwa@ur.ac.rw", "orcid": "0000-0006-7890-1234",
        "publication_ids": ["PUB020","PUB021","PUB022","PUB023"], "h_index": 7
    },
    {
        "id": "RWR007", "name": "Dr. Théogène Rutagengwa",
        "institution": "University of Rwanda", "department": "School of Environment and Natural Resources",
        "position": "Senior Lecturer", "career_stage": "mid",
        "email": "t.rutagengwa@ur.ac.rw", "orcid": "0000-0007-8901-2345",
        "publication_ids": ["PUB024","PUB025","PUB026"], "h_index": 4
    },
    {
        "id": "RWR008", "name": "Prof. Ignace Habimana",
        "institution": "University of Rwanda", "department": "School of Economics",
        "position": "Professor", "career_stage": "senior",
        "email": "i.habimana@ur.ac.rw", "orcid": "0000-0008-9012-3456",
        "publication_ids": ["PUB027","PUB028","PUB029","PUB030"], "h_index": 11
    },
    {
        "id": "RWR009", "name": "Dr. Odette Tuyishime",
        "institution": "University of Rwanda", "department": "College of Education",
        "position": "Lecturer", "career_stage": "junior",
        "email": "o.tuyishime@ur.ac.rw", "orcid": "0000-0009-0123-4567",
        "publication_ids": ["PUB031","PUB032"], "h_index": 2
    },
    {
        "id": "RWR010", "name": "Prof. Assumpta Mugiraneza",
        "institution": "University of Rwanda", "department": "Center for Conflict Management",
        "position": "Professor", "career_stage": "senior",
        "email": "a.mugiraneza@ur.ac.rw", "orcid": "0000-0010-1234-5678",
        "publication_ids": ["PUB033","PUB034","PUB035"], "h_index": 9
    },
    {
        "id": "RWR011", "name": "Dr. Celestin Nshimiyimana",
        "institution": "Adventist University of Central Africa (AUCA)", "department": "Faculty of Science and Technology",
        "position": "Associate Professor", "career_stage": "mid",
        "email": "c.nshimiyimana@auca.ac.rw", "orcid": "0000-0011-2345-6789",
        "publication_ids": ["PUB036","PUB037","PUB038"], "h_index": 5
    },
    {
        "id": "RWR012", "name": "Dr. Dieudonne Mutangana",
        "institution": "Adventist University of Central Africa (AUCA)", "department": "Faculty of Business and Management",
        "position": "Senior Lecturer", "career_stage": "mid",
        "email": "d.mutangana@auca.ac.rw", "orcid": "0000-0012-3456-7890",
        "publication_ids": ["PUB039","PUB040"], "h_index": 4
    },
    {
        "id": "RWR013", "name": "Prof. Beata Kantarama",
        "institution": "Adventist University of Central Africa (AUCA)", "department": "Faculty of Health Sciences",
        "position": "Professor", "career_stage": "senior",
        "email": "b.kantarama@auca.ac.rw", "orcid": "0000-0013-4567-8901",
        "publication_ids": ["PUB041","PUB042","PUB043"], "h_index": 10
    },
    {
        "id": "RWR014", "name": "Dr. Solange Uwera",
        "institution": "African Leadership University (ALU)", "department": "School of Wildlife Conservation",
        "position": "Research Fellow", "career_stage": "mid",
        "email": "s.uwera@alueducation.com", "orcid": "0000-0014-5678-9012",
        "publication_ids": ["PUB044","PUB045"], "h_index": 3
    },
    {
        "id": "RWR015", "name": "Dr. Aimable Ruzindana",
        "institution": "African Leadership University (ALU)", "department": "School of Business",
        "position": "Assistant Professor", "career_stage": "junior",
        "email": "a.ruzindana@alueducation.com", "orcid": "0000-0015-6789-0123",
        "publication_ids": ["PUB046","PUB047"], "h_index": 2
    },
    {
        "id": "RWR016", "name": "Prof. Placide Nzabahimana",
        "institution": "University of Global Health Equity (UGHE)", "department": "Global Health Delivery",
        "position": "Professor", "career_stage": "senior",
        "email": "p.nzabahimana@ughe.org", "orcid": "0000-0016-7890-1234",
        "publication_ids": ["PUB048","PUB049","PUB050","PUB051"], "h_index": 14
    },
    {
        "id": "RWR017", "name": "Dr. Chantal Ingabire",
        "institution": "University of Global Health Equity (UGHE)", "department": "Epidemiology and Global Health",
        "position": "Research Associate", "career_stage": "junior",
        "email": "c.ingabire@ughe.org", "orcid": "0000-0017-8901-2345",
        "publication_ids": ["PUB052","PUB053"], "h_index": 3
    },
    {
        "id": "RWR018", "name": "Dr. Juvenal Hakizimana",
        "institution": "INES-Ruhengeri", "department": "Department of Computer Science",
        "position": "Lecturer", "career_stage": "junior",
        "email": "j.hakizimana@ines.ac.rw", "orcid": "0000-0018-9012-3456",
        "publication_ids": ["PUB054","PUB055"], "h_index": 2
    },
    {
        "id": "RWR019", "name": "Prof. Augustin Gashumba",
        "institution": "INES-Ruhengeri", "department": "Department of Agriculture",
        "position": "Professor", "career_stage": "senior",
        "email": "a.gashumba@ines.ac.rw", "orcid": "0000-0019-0123-4567",
        "publication_ids": ["PUB056","PUB057","PUB058"], "h_index": 8
    },
    {
        "id": "RWR020", "name": "Dr. Bernadette Uwase",
        "institution": "Kigali Independent University (ULK)", "department": "Faculty of Law",
        "position": "Senior Lecturer", "career_stage": "mid",
        "email": "b.uwase@ulk.ac.rw", "orcid": "0000-0020-1234-5678",
        "publication_ids": ["PUB059","PUB060"], "h_index": 4
    },
    {
        "id": "RWR021", "name": "Dr. Felix Niyigena",
        "institution": "University of Rwanda", "department": "School of Agriculture",
        "position": "Lecturer", "career_stage": "junior",
        "email": "f.niyigena@ur.ac.rw", "orcid": "0000-0021-2345-6789",
        "publication_ids": ["PUB061","PUB062"], "h_index": 2
    },
    {
        "id": "RWR022", "name": "Dr. Vestine Mukamurenzi",
        "institution": "University of Rwanda", "department": "School of ICT",
        "position": "Lecturer", "career_stage": "junior",
        "email": "v.mukamurenzi@ur.ac.rw", "orcid": "0000-0022-3456-7890",
        "publication_ids": ["PUB063","PUB064"], "h_index": 2
    },
    {
        "id": "RWR023", "name": "Prof. Bernard Nzeyimana",
        "institution": "University of Rwanda", "department": "School of Energy",
        "position": "Professor", "career_stage": "senior",
        "email": "b.nzeyimana@ur.ac.rw", "orcid": "0000-0023-4567-8901",
        "publication_ids": ["PUB065","PUB066","PUB067"], "h_index": 9
    },
    {
        "id": "RWR024", "name": "Dr. Immaculee Nyirahabimana",
        "institution": "University of Rwanda", "department": "School of Public Health",
        "position": "Associate Professor", "career_stage": "mid",
        "email": "i.nyirahabimana@ur.ac.rw", "orcid": "0000-0024-5678-9012",
        "publication_ids": ["PUB068","PUB069","PUB070"], "h_index": 6
    },
    {
        "id": "RWR025", "name": "Dr. Gaspard Maniraho",
        "institution": "University of Rwanda", "department": "School of Finance",
        "position": "Lecturer", "career_stage": "junior",
        "email": "g.maniraho@ur.ac.rw", "orcid": "0000-0025-6789-0123",
        "publication_ids": ["PUB071","PUB072"], "h_index": 3
    },
    {
        "id": "RWR026", "name": "Prof. Leonidas Nzaramba",
        "institution": "University of Rwanda", "department": "School of ICT",
        "position": "Professor", "career_stage": "senior",
        "email": "l.nzaramba@ur.ac.rw", "orcid": "0000-0026-7890-1234",
        "publication_ids": ["PUB073","PUB074","PUB075","PUB076"], "h_index": 13
    },
    {
        "id": "RWR027", "name": "Dr. Clarisse Umutoniwase",
        "institution": "Adventist University of Central Africa (AUCA)", "department": "Faculty of Education",
        "position": "Lecturer", "career_stage": "junior",
        "email": "c.umutoniwase@auca.ac.rw", "orcid": "0000-0027-8901-2345",
        "publication_ids": ["PUB077","PUB078"], "h_index": 2
    },
    {
        "id": "RWR028", "name": "Dr. Norbert Bizimana",
        "institution": "University of Rwanda", "department": "School of Environment and Natural Resources",
        "position": "Associate Professor", "career_stage": "mid",
        "email": "n.bizimana@ur.ac.rw", "orcid": "0000-0028-9012-3456",
        "publication_ids": ["PUB079","PUB080","PUB081"], "h_index": 5
    },
    {
        "id": "RWR029", "name": "Prof. Therese Nyinawumuntu",
        "institution": "University of Global Health Equity (UGHE)", "department": "Maternal and Child Health",
        "position": "Professor", "career_stage": "senior",
        "email": "t.nyinawumuntu@ughe.org", "orcid": "0000-0029-0123-4567",
        "publication_ids": ["PUB082","PUB083","PUB084"], "h_index": 11
    },
    {
        "id": "RWR030", "name": "Dr. Jean-Paul Habineza",
        "institution": "INES-Ruhengeri", "department": "Department of Engineering",
        "position": "Senior Lecturer", "career_stage": "mid",
        "email": "jp.habineza@ines.ac.rw", "orcid": "0000-0030-1234-5678",
        "publication_ids": ["PUB085","PUB086"], "h_index": 4
    },
]

PUBLICATIONS: List[Dict[str, Any]] = [
    # Agriculture & Food Security
    {
        "id": "PUB001", "title": "Improving Cassava Yield Through Integrated Pest Management in Rwanda's Northern Province",
        "abstract": "This study investigates the effectiveness of integrated pest management (IPM) strategies on cassava yield in Rwanda's Northern Province. Smallholder farmers implementing IPM showed a 34% increase in yield compared to conventional methods. The study examined soil health indicators, pest pressure reduction, and farmer adoption rates across 120 households in Musanze and Rulindo districts. Results indicate that combining biological control agents with traditional farming knowledge significantly reduces post-harvest losses.",
        "keywords": ["cassava","integrated pest management","food security","Rwanda","Northern Province","smallholder farmers","post-harvest"],
        "authors": ["RWR001","RWR021"], "year": 2022,
        "journal": "Rwanda Journal of Agricultural Sciences", "citations": 8,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/rjas.2022.001"
    },
    {
        "id": "PUB002", "title": "Soil Fertility Management Practices Among Bean Farmers in Southern Rwanda",
        "abstract": "Bean cultivation is central to food security and household nutrition in Southern Rwanda. This research evaluates the impact of organic and inorganic soil fertility management on climbing bean productivity in Huye and Nyamagabe districts. Soil samples from 85 plots were analyzed for nitrogen, phosphorus, and potassium levels. Findings demonstrate that integrated soil fertility management combining compost with microdosing of inorganic fertilizer improved yields by 41% while maintaining long-term soil health.",
        "keywords": ["soil fertility","bean farming","food security","compost","Rwanda","Southern Province","fertilizer","nutrition"],
        "authors": ["RWR001","RWR002"], "year": 2021,
        "journal": "African Journal of Agricultural Research", "citations": 14,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/ajar.2021.002"
    },
    {
        "id": "PUB003", "title": "Climate-Resilient Maize Varieties Adoption in Eastern Rwanda: Barriers and Enablers",
        "abstract": "Climate change poses significant threats to maize production in Rwanda's Eastern Province. This study examines adoption rates of drought-tolerant and flood-resistant maize varieties among 200 farming households in Kayonza and Rwamagana districts. Using logistic regression, we identify key barriers including seed access, extension services, and credit availability. Male-headed and female-headed households show different adoption patterns, with gender-responsive extension services improving adoption by 28%.",
        "keywords": ["climate resilience","maize","drought tolerance","Eastern Rwanda","seed adoption","gender","extension services","climate change"],
        "authors": ["RWR001"], "year": 2023,
        "journal": "Climate and Development", "citations": 5,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/cd.2023.003"
    },
    {
        "id": "PUB004", "title": "Post-Harvest Losses in Sorghum Value Chains in Western Rwanda",
        "abstract": "Sorghum is a vital crop for food security and traditional brewing in Western Rwanda. This research quantifies post-harvest losses at storage, transportation, and processing stages across Rubavu and Nyamasheke districts. Grain moisture content, storage infrastructure quality, and market access are the primary determinants of losses averaging 23% of total harvest. Low-cost hermetic storage technologies reduced losses to under 8% in pilot interventions among 60 farming groups.",
        "keywords": ["post-harvest losses","sorghum","value chain","storage","food security","Western Rwanda","hermetic storage"],
        "authors": ["RWR001","RWR019"], "year": 2020,
        "journal": "Food Security Journal", "citations": 11,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/fsj.2020.004"
    },
    {
        "id": "PUB005", "title": "Agroforestry Systems and Carbon Sequestration Potential in Rwanda's Highland Districts",
        "abstract": "Rwanda's Vision 2050 includes ambitious targets for forest cover and carbon neutrality. This study evaluates the carbon sequestration potential of agroforestry systems integrating Grevillea robusta and Calliandra calothyrsus with food crops across highland districts in the Northern Province. Above and below-ground biomass measurements from 320 plots reveal that well-managed agroforestry systems sequester between 3.2 and 7.8 tonnes CO2 per hectare annually while improving farm income through diversified outputs.",
        "keywords": ["agroforestry","carbon sequestration","Rwanda","highlands","Grevillea","climate change mitigation","Vision 2050","biomass"],
        "authors": ["RWR002","RWR007"], "year": 2022,
        "journal": "Agroforestry Systems", "citations": 19,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/as.2022.005"
    },
    {
        "id": "PUB006", "title": "Irrigation Schemes and Smallholder Productivity in the Nyabarongo River Basin",
        "abstract": "This study examines the effect of smallholder irrigation schemes in the Nyabarongo River Basin on agricultural productivity, income, and food security outcomes. Households with irrigation access produced 2.3 additional cropping cycles per year compared to rainfed farmers. Irrigation access reduced household-level food insecurity by 45% as measured by the Household Food Insecurity Access Scale (HFIAS). Infrastructure maintenance and water user association governance are identified as critical success factors.",
        "keywords": ["irrigation","Nyabarongo","smallholder","food security","Rwanda","water management","productivity","HFIAS"],
        "authors": ["RWR002","RWR001"], "year": 2021,
        "journal": "Agricultural Water Management", "citations": 22,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/awm.2021.006"
    },
    {
        "id": "PUB007", "title": "Biofortification of Sweet Potato Varieties for Vitamin A Deficiency Reduction in Rwanda",
        "abstract": "Vitamin A deficiency remains a significant public health challenge among children under five in rural Rwanda. This study evaluates the bioavailability and consumer acceptance of orange-fleshed sweet potato (OFSP) varieties in Muhanga and Karongi districts. Randomized controlled trial data from 480 children over 6 months showed that OFSP consumption three times weekly reduced VAD prevalence by 32%. Taste preference, color, and cooking properties influence household adoption.",
        "keywords": ["biofortification","sweet potato","vitamin A","malnutrition","Rwanda","food security","nutrition","public health"],
        "authors": ["RWR002","RWR004"], "year": 2020,
        "journal": "Maternal and Child Nutrition", "citations": 31,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/mcn.2020.007"
    },
    {
        "id": "PUB008", "title": "Land Use Change and Agricultural Biodiversity Loss in Pre-Urban Kigali Periphery",
        "abstract": "Rapid urbanization around Kigali is converting agricultural land and threatening crop genetic diversity maintained by smallholder farmers. This study documents land use change over 15 years using satellite imagery and interviews with 140 farming households in Gasabo and Kicukiro districts. Results show 38% reduction in agricultural land and significant decline in locally adapted crop varieties. Policy recommendations address zoning regulations and ex-situ conservation of traditional seed varieties.",
        "keywords": ["land use change","urbanization","agricultural biodiversity","Kigali","seed diversity","conservation","Rwanda","zoning"],
        "authors": ["RWR002"], "year": 2019,
        "journal": "Land Use Policy", "citations": 17,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/lup.2019.008"
    },
    {
        "id": "PUB009", "title": "Women Farmer Groups and Technology Adoption in Rwanda's One Cow Per Family Programme",
        "abstract": "Rwanda's Girinka (One Cow Per Family) programme has transformed livestock ownership and dairy production among rural poor households. This study analyzes the role of women farmer groups in dairy technology adoption and household nutrition outcomes across Gatsibo and Kayonza districts. Women-led farmer groups demonstrate higher adoption of improved feeding and milking hygiene practices. Households receiving a cow through women-led groups show 28% better nutrition outcomes than those through individual male ownership.",
        "keywords": ["Girinka","women farmers","dairy","technology adoption","Rwanda","nutrition","livestock","farmer groups"],
        "authors": ["RWR002","RWR009"], "year": 2023,
        "journal": "World Development", "citations": 9,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/wd.2023.009"
    },
    # Health & Biomedical Sciences
    {
        "id": "PUB010", "title": "Community Health Worker Programme Effectiveness in Reducing Under-5 Mortality in Rural Rwanda",
        "abstract": "Rwanda's community health worker (CHW) system is widely recognized as a model for Sub-Saharan Africa. This study evaluates CHW effectiveness in reducing under-5 mortality across 30 health centers in Kayonza, Kirehe, and Ngoma districts. Multivariate analysis of 5,200 household records shows that active CHW engagement is associated with a 42% reduction in under-5 mortality. Integrated community case management (iCCM) training significantly improves CHW effectiveness for diarrhea, malaria, and pneumonia treatment.",
        "keywords": ["community health workers","CHW","child mortality","Rwanda","iCCM","malaria","diarrhea","pneumonia","rural health"],
        "authors": ["RWR003","RWR004"], "year": 2022,
        "journal": "The Lancet Global Health", "citations": 45,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/lgh.2022.010"
    },
    {
        "id": "PUB011", "title": "HIV Treatment Adherence and Social Support Networks Among PLHIV in Kigali",
        "abstract": "Antiretroviral therapy (ART) adherence is critical to HIV treatment outcomes. This mixed-methods study examines the role of social support networks on ART adherence among 380 people living with HIV (PLHIV) attending Kigali district hospitals. Social network analysis reveals that patients with strong peer support show 89% medication adherence versus 67% in socially isolated patients. Community-based adherence clubs reduce virological failure by 37%. Stigma reduction remains a key barrier at family and community level.",
        "keywords": ["HIV","ART","adherence","social support","Kigali","PLHIV","stigma","community health","antiretroviral"],
        "authors": ["RWR003"], "year": 2021,
        "journal": "AIDS and Behavior", "citations": 28,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/ab.2021.011"
    },
    {
        "id": "PUB012", "title": "Malaria Rapid Diagnostic Test Implementation Across Rwanda's Health Sector",
        "abstract": "Rwanda achieved significant progress in malaria control through nationwide rapid diagnostic test (RDT) deployment. This implementation research evaluates the quality, accuracy, and cost-effectiveness of RDT-based diagnosis across 45 health facilities in high-burden districts including Rutsiro, Karongi, and Nyamagabe. RDT implementation reduced unnecessary antimalarial prescriptions by 61% and improved treatment targeting. Cold chain management and quality assurance mechanisms are evaluated alongside provider training protocols.",
        "keywords": ["malaria","rapid diagnostic test","RDT","diagnosis","Rwanda","health facilities","antimalarial","implementation research"],
        "authors": ["RWR003","RWR016"], "year": 2020,
        "journal": "Malaria Journal", "citations": 33,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/mj.2020.012"
    },
    {
        "id": "PUB013", "title": "Obstetric Fistula Surgical Repair Outcomes at Rwandan Referral Hospitals",
        "abstract": "Obstetric fistula remains a significant maternal health challenge in Sub-Saharan Africa. This study analyzes surgical repair outcomes and quality-of-life improvements among 145 women treated at CHUK and CHUB referral hospitals in Rwanda between 2018 and 2022. Post-repair closure rates of 86% are achieved under standardized protocols. Social reintegration and psychosocial support programs significantly improve long-term patient outcomes. Trained midwives and skilled birth attendance are the primary prevention strategies.",
        "keywords": ["obstetric fistula","maternal health","surgical repair","Rwanda","referral hospital","skilled birth attendance","quality of life"],
        "authors": ["RWR004","RWR029"], "year": 2023,
        "journal": "BJOG: International Journal of Obstetrics and Gynaecology", "citations": 12,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/bjog.2023.013"
    },
    {
        "id": "PUB014", "title": "Mental Health Integration Into Primary Healthcare in Post-Genocide Rwanda",
        "abstract": "Rwanda's post-genocide mental health burden requires integrated care approaches at primary health level. This study evaluates a task-sharing model integrating depression and PTSD screening and treatment into 25 health centers across three provinces. Mental health nurses trained in cognitive behavioral therapy (CBT) techniques achieved significant symptom reduction (PHQ-9 scores) in 71% of patients at 6-month follow-up. Community-based sociotherapy complements clinical approaches, particularly for genocide trauma survivors.",
        "keywords": ["mental health","post-genocide","PTSD","depression","Rwanda","primary healthcare","task sharing","CBT","trauma"],
        "authors": ["RWR004","RWR010"], "year": 2021,
        "journal": "Global Mental Health", "citations": 38,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/gmh.2021.014"
    },
    {
        "id": "PUB015", "title": "Non-Communicable Disease Burden and Risk Factors Among Adults in Urban Rwanda",
        "abstract": "Non-communicable diseases (NCDs) are an emerging health challenge as Rwanda undergoes epidemiological transition. This cross-sectional study of 1,200 adults in Kigali and Huye cities examines prevalence of hypertension, diabetes, and obesity. Hypertension prevalence of 28.4% and diabetes prevalence of 5.2% are detected. Sedentary lifestyle, salt intake, and tobacco use are primary modifiable risk factors. NCD integration into community health worker programs is evaluated as a cost-effective prevention strategy.",
        "keywords": ["non-communicable disease","NCD","hypertension","diabetes","obesity","Rwanda","urban health","risk factors","epidemiology"],
        "authors": ["RWR004","RWR024"], "year": 2022,
        "journal": "BMC Public Health", "citations": 21,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/bph.2022.015"
    },
    {
        "id": "PUB016", "title": "Skilled Birth Attendance and Maternal Mortality Reduction in Rwanda 2000-2022",
        "abstract": "Rwanda has achieved remarkable reductions in maternal mortality, from 1071 per 100,000 live births in 2000 to 203 in 2020. This longitudinal analysis examines the contribution of skilled birth attendance, facility deliveries, and emergency obstetric care (EmOC) availability to this achievement. Multivariable analysis of national health facility data shows skilled birth attendance accounts for 48% of the variance in district-level maternal mortality. Mutuelle de Sante health insurance coverage significantly predicts facility delivery uptake.",
        "keywords": ["maternal mortality","skilled birth attendance","Rwanda","facility delivery","EmOC","health insurance","Mutuelle de Sante"],
        "authors": ["RWR004"], "year": 2023,
        "journal": "The Lancet", "citations": 52,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/tl.2023.016"
    },
    # ICT & Digital Innovation
    {
        "id": "PUB017", "title": "Mobile Money Adoption and Financial Inclusion Among Rural Households in Rwanda",
        "abstract": "Mobile money services, particularly MTN Mobile Money and Airtel Money, have transformed financial inclusion in Rwanda. This study examines adoption determinants and usage patterns among 450 rural households in Bugesera and Rulindo districts. Trust, mobile literacy, and agent network density are primary adoption predictors. Mobile money users show 34% higher savings rates and 28% better ability to manage financial shocks compared to non-users. Gender gaps in adoption are narrowing but persist, with women 18% less likely to be active users.",
        "keywords": ["mobile money","financial inclusion","Rwanda","MTN","digital payments","rural households","gender","fintech"],
        "authors": ["RWR005","RWR008"], "year": 2022,
        "journal": "Journal of Development Economics", "citations": 29,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/jde.2022.017"
    },
    {
        "id": "PUB018", "title": "E-Government Service Adoption and Citizen Satisfaction in Rwanda: The Irembo Platform",
        "abstract": "Rwanda's Irembo e-government platform has digitized over 100 public services since its launch in 2015. This study evaluates citizen adoption patterns, satisfaction levels, and barriers among 800 users and non-users in Kigali, Muhanga, and Nyagatare. Technology acceptance model (TAM) analysis reveals perceived usefulness and ease of use as primary adoption drivers. Citizens with higher digital literacy show 3.2x higher satisfaction. Last-mile connectivity and digital literacy training are critical for inclusive e-government adoption.",
        "keywords": ["e-government","Irembo","Rwanda","digital services","citizen satisfaction","TAM","digital literacy","technology adoption"],
        "authors": ["RWR005","RWR006"], "year": 2021,
        "journal": "Government Information Quarterly", "citations": 17,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/giq.2021.018"
    },
    {
        "id": "PUB019", "title": "Cybersecurity Readiness of Rwandan Financial Institutions in the Digital Transformation Era",
        "abstract": "Rwanda's rapid digital transformation has created new cybersecurity vulnerabilities in the financial sector. This study assesses cybersecurity maturity of 18 commercial banks and microfinance institutions using the NIST Cybersecurity Framework. Findings reveal significant gaps in incident response capabilities (maturity level 1.8/5) and third-party risk management (1.6/5). Smaller institutions are disproportionately exposed due to limited technical capacity. Rwanda's National Cybersecurity Authority (NCSA) regulations compliance rates are evaluated.",
        "keywords": ["cybersecurity","fintech","Rwanda","banking","NIST","digital transformation","risk management","NCSA","financial sector"],
        "authors": ["RWR005"], "year": 2023,
        "journal": "Computers and Security", "citations": 8,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/cs.2023.019"
    },
    {
        "id": "PUB020", "title": "Machine Learning for Agricultural Disease Detection Using Drone Imagery in Rwanda",
        "abstract": "Early detection of crop diseases is critical for food security in Rwanda. This study develops and validates a convolutional neural network (CNN) model for detecting cassava mosaic disease and banana xanthomonas wilt from drone imagery. The model achieves 94.3% detection accuracy on a dataset of 12,000 aerial images collected from farms in Musanze, Burera, and Gakenke districts. Transfer learning from ImageNet significantly reduces training data requirements. Integration with farmer mobile apps is demonstrated through a pilot with 150 farmers.",
        "keywords": ["machine learning","drone","disease detection","cassava","Rwanda","CNN","deep learning","precision agriculture","food security"],
        "authors": ["RWR006","RWR001"], "year": 2023,
        "journal": "Computers and Electronics in Agriculture", "citations": 22,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/cea.2023.020"
    },
    {
        "id": "PUB021", "title": "Blockchain Technology for Transparent Land Registry Management in Rwanda",
        "abstract": "Rwanda's land tenure system has been transformed through the Land Administration Information System (LAIS). This study evaluates a blockchain-based extension for improving transparency, immutability, and dispute resolution in land registry transactions across Kigali and Musanze districts. Smart contracts automate transfer of ownership processes, reducing processing time from 14 to 2 days. Distributed ledger technology prevents fraudulent alterations, which previously accounted for 12% of land disputes.",
        "keywords": ["blockchain","land registry","Rwanda","LAIS","smart contracts","transparency","land tenure","distributed ledger"],
        "authors": ["RWR006","RWR020"], "year": 2022,
        "journal": "Land Use Policy", "citations": 15,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/lup.2022.021"
    },
    {
        "id": "PUB022", "title": "Artificial Intelligence in Rwanda's Healthcare: Opportunities and Ethical Challenges",
        "abstract": "AI integration in Rwanda's healthcare system presents transformative opportunities but raises important ethical and regulatory questions. This systematic review synthesizes evidence from 45 AI health deployments in Rwanda and comparable low-middle income countries. Diagnostic AI for tuberculosis, cervical cancer, and maternal health shows sensitivity and specificity comparable to specialists. Algorithmic bias, data privacy under Rwanda's Data Protection Law (2021), and digital divide concerns are critically examined.",
        "keywords": ["artificial intelligence","healthcare","Rwanda","ethics","data privacy","AI bias","tuberculosis","cervical cancer","health system"],
        "authors": ["RWR006","RWR003"], "year": 2023,
        "journal": "npj Digital Medicine", "citations": 31,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/ndm.2023.022"
    },
    {
        "id": "PUB023", "title": "Internet of Things (IoT) for Smart Agriculture in Rwanda's Crop Monitoring",
        "abstract": "Precision agriculture enabled by IoT sensors offers new opportunities for smallholder farmers in Rwanda. This study deploys low-cost soil moisture, temperature, and weather sensors across 80 plots in Rwamagana and Bugesera districts. A mobile app provides real-time alerts and irrigation recommendations to farmers. IoT-based crop monitoring reduced water use by 31% while maintaining comparable yields. Connectivity limitations in rural areas and sensor durability during the rainy season are key technical challenges addressed.",
        "keywords": ["IoT","smart agriculture","Rwanda","precision farming","soil moisture","mobile app","sensor","irrigation","connectivity"],
        "authors": ["RWR006","RWR005"], "year": 2021,
        "journal": "Sensors", "citations": 18,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/s.2021.023"
    },
    # Environment & Natural Resources
    {
        "id": "PUB024", "title": "Deforestation Drivers and Forest Cover Change in Rwanda's Nyungwe Buffer Zone",
        "abstract": "Nyungwe National Park, Rwanda's largest montane rainforest, faces deforestation pressure from agricultural encroachment and charcoal production. This study analyzes forest cover change from 2005 to 2020 using Landsat imagery and interviews with 320 households in the buffer zone. Agricultural expansion accounts for 58% of forest loss, followed by charcoal production (27%). Payment for ecosystem services (PES) schemes in Nyamagabe district show 40% reduction in illegal encroachment among participating households.",
        "keywords": ["deforestation","Nyungwe","Rwanda","forest cover","agricultural expansion","charcoal","PES","conservation","biodiversity"],
        "authors": ["RWR007","RWR014"], "year": 2022,
        "journal": "Forest Ecology and Management", "citations": 24,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/fem.2022.024"
    },
    {
        "id": "PUB025", "title": "Water Quality Assessment of Lake Muhazi Under Agricultural and Urban Pressures",
        "abstract": "Lake Muhazi is a critical water resource for domestic use and irrigation in Eastern Rwanda. This study conducts comprehensive water quality assessment including physicochemical parameters, heavy metals, and microbiological indicators at 18 sampling points during wet and dry seasons. Agricultural runoff elevates nitrates (mean 18.4 mg/L) and phosphates (mean 2.8 mg/L) above WHO drinking water guidelines. Increased urbanization in Rwamagana contributes to fecal coliform contamination. Wetland restoration and buffer strips are recommended.",
        "keywords": ["water quality","Lake Muhazi","Rwanda","agricultural runoff","urbanization","nitrates","phosphates","wetland","Eastern Province"],
        "authors": ["RWR007","RWR028"], "year": 2021,
        "journal": "Water Research", "citations": 16,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/wr.2021.025"
    },
    {
        "id": "PUB026", "title": "Methane Gas Extraction from Lake Kivu: Environmental Risk Assessment",
        "abstract": "Lake Kivu holds approximately 60 billion cubic meters of dissolved methane, actively exploited for power generation. This study conducts a comprehensive environmental risk assessment of methane extraction operations covering lake stratification stability, aquatic biodiversity impacts, and carbonic acid effects on fish populations. Findings indicate that current extraction rates are within safe ecological limits but cumulative impact modeling predicts threshold risks beyond 200 MW extraction capacity. Monitoring protocols and adaptive management frameworks are proposed.",
        "keywords": ["Lake Kivu","methane","energy","environmental risk","Rwanda","lake stratification","biodiversity","gas extraction","aquatic ecosystem"],
        "authors": ["RWR007"], "year": 2020,
        "journal": "Environmental Science and Technology", "citations": 29,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/est.2020.026"
    },
    # Economics & Finance
    {
        "id": "PUB027", "title": "Special Economic Zones and Industrial Development in Rwanda: The Kigali SEZ Experience",
        "abstract": "Rwanda's Kigali Special Economic Zone (KSEZ) represents a flagship investment in industrial policy and economic diversification. This study evaluates KSEZ performance using enterprise surveys of 95 operating firms and macro-level economic data from 2010 to 2022. Total employment in KSEZ grew from 850 to 14,200 jobs over the study period. Technology transfer spillovers to domestic firms are modest but measurable. Tax incentives, single-window services, and infrastructure quality are primary location determinants for foreign investors.",
        "keywords": ["special economic zone","SEZ","Kigali","Rwanda","industrial policy","investment","employment","economic development","FDI"],
        "authors": ["RWR008","RWR015"], "year": 2023,
        "journal": "World Development", "citations": 13,
        "research_area": "Economics & Finance", "doi": "10.1234/wd.2023.027"
    },
    {
        "id": "PUB028", "title": "Microfinance Impact on Women Entrepreneurship in Rwanda's Informal Economy",
        "abstract": "Access to microfinance has been central to Rwanda's poverty reduction strategy. This randomized evaluation examines the impact of UMURENGE SACCO microfinance loans on 600 women-owned micro-enterprises in Muhanga, Ruhango, and Kamonyi districts. Loan recipients show 41% increase in business revenue and 28% improvement in asset accumulation over 18 months. Social capital through savings groups (ibimina) enhances loan repayment rates to 97%. Skills training combined with credit produces stronger outcomes than credit alone.",
        "keywords": ["microfinance","SACCO","women entrepreneurship","Rwanda","ibimina","poverty reduction","business development","rural finance"],
        "authors": ["RWR008","RWR012"], "year": 2021,
        "journal": "Journal of Development Economics", "citations": 35,
        "research_area": "Economics & Finance", "doi": "10.1234/jde.2021.028"
    },
    {
        "id": "PUB029", "title": "Rwanda's Economic Transformation: Service Sector Growth and Structural Change 2000-2022",
        "abstract": "Rwanda has achieved one of Africa's fastest economic transformations, with GDP per capita growing from $220 to $935 between 2000 and 2022. This study analyzes structural transformation patterns focusing on the service sector's rise to 46% of GDP. Tourism, financial services, and ICT have driven service sector growth. Export diversification from traditional coffee and tea exports toward non-traditional goods and services is examined using trade data analysis. Skills gaps and infrastructure bottlenecks constraining further transformation are identified.",
        "keywords": ["economic transformation","Rwanda","structural change","service sector","tourism","ICT","export diversification","GDP growth"],
        "authors": ["RWR008"], "year": 2022,
        "journal": "African Development Review", "citations": 27,
        "research_area": "Economics & Finance", "doi": "10.1234/adr.2022.029"
    },
    {
        "id": "PUB030", "title": "Public Debt Sustainability and Fiscal Space in Post-COVID Rwanda",
        "abstract": "The COVID-19 pandemic significantly increased Rwanda's public debt-to-GDP ratio from 54% to 71% between 2019 and 2021. This study analyzes debt sustainability using IMF debt sustainability analysis (DSA) framework and scenario modeling under different growth and interest rate assumptions. Rwanda maintains a moderate risk of debt distress. Concessional borrowing terms and sustained export growth are critical for maintaining fiscal sustainability. Social spending protection and infrastructure investment prioritization frameworks are evaluated.",
        "keywords": ["public debt","fiscal sustainability","Rwanda","COVID-19","IMF","debt sustainability","social spending","post-pandemic"],
        "authors": ["RWR008","RWR025"], "year": 2023,
        "journal": "Journal of African Economies", "citations": 7,
        "research_area": "Economics & Finance", "doi": "10.1234/jae.2023.030"
    },
    # Education
    {
        "id": "PUB031", "title": "Competency-Based Curriculum Reform Outcomes in Rwanda's Basic Education System",
        "abstract": "Rwanda implemented a competency-based curriculum (CBC) in 2015, shifting from rote learning to skills-based education. This longitudinal study evaluates CBC outcomes across 120 primary and secondary schools in all five provinces over five years. Student critical thinking scores improved by 24% in CBC schools versus control schools using traditional curriculum. Teacher professional development quality is the strongest predictor of CBC implementation fidelity. Persistent challenges include large class sizes (mean 58 students) and limited teaching-learning materials.",
        "keywords": ["competency-based curriculum","Rwanda","basic education","CBC","teacher training","critical thinking","education reform","learning outcomes"],
        "authors": ["RWR009","RWR027"], "year": 2022,
        "journal": "International Journal of Educational Development", "citations": 19,
        "research_area": "Education & Social Sciences", "doi": "10.1234/ijed.2022.031"
    },
    {
        "id": "PUB032", "title": "TVET Outcomes and Youth Employment in Rwanda: Evidence from Sector Skills Councils",
        "abstract": "Technical and Vocational Education and Training (TVET) is central to Rwanda's human capital development strategy. This study tracks employment outcomes for 1,200 TVET graduates from construction, ICT, hospitality, and agriculture sectors over three years post-graduation. Employment rate of 72% is achieved at 12 months, with private sector placement 18% higher than public sector. Work-based learning components and industry certification programs significantly improve employment outcomes. Gender equity in TVET enrollment has reached 48% female participation.",
        "keywords": ["TVET","vocational education","youth employment","Rwanda","skills development","gender equity","private sector","human capital"],
        "authors": ["RWR009"], "year": 2021,
        "journal": "Journal of Vocational Education and Training", "citations": 14,
        "research_area": "Education & Social Sciences", "doi": "10.1234/jvet.2021.032"
    },
    # Peace & Reconciliation
    {
        "id": "PUB033", "title": "Gacaca Courts and Long-Term Social Cohesion in Rwanda: A 20-Year Retrospective",
        "abstract": "The gacaca community justice system processed 1.9 million genocide cases between 2001 and 2012. This 20-year retrospective study examines the long-term contribution of gacaca to social cohesion and reconciliation using longitudinal survey data from 2,400 survivors, perpetrators, and community members across all provinces. Communities with higher gacaca case resolution rates show significantly higher social trust indices (Spearman's r=0.68). However, contested testimonies and unresolved property restitution cases continue to hinder full reconciliation.",
        "keywords": ["gacaca","reconciliation","Rwanda","genocide","social cohesion","justice","transitional justice","peacebuilding","community justice"],
        "authors": ["RWR010","RWR020"], "year": 2022,
        "journal": "Transitional Justice Review", "citations": 41,
        "research_area": "Peace, Security & Governance", "doi": "10.1234/tjr.2022.033"
    },
    {
        "id": "PUB034", "title": "Intermarriage Patterns and Social Integration in Post-Genocide Rwanda",
        "abstract": "Post-genocide social integration in Rwanda has been promoted through national identity policies discouraging ethnic categorization. This study examines intermarriage patterns between Hutu and Tutsi communities using household survey data from 3,800 households in Kigali, Huye, and Musanze. Intermarriage rates have increased from 9% in 1994 to 22% in 2020. Younger generations (under 35) show significantly higher rates of cross-ethnic marriage. Economic status, education, and urban residence are positive predictors of intermarriage, while genocide trauma exposure is negatively associated.",
        "keywords": ["reconciliation","intermarriage","Rwanda","social integration","post-genocide","identity","ethnic relations","peacebuilding"],
        "authors": ["RWR010"], "year": 2021,
        "journal": "African Affairs", "citations": 23,
        "research_area": "Peace, Security & Governance", "doi": "10.1234/aa.2021.034"
    },
    {
        "id": "PUB035", "title": "Women's Political Participation and Post-Conflict Governance in Rwanda",
        "abstract": "Rwanda has the world's highest proportion of women in parliament at 61%. This study analyzes how post-genocide gender policies have transformed political participation and governance quality. Qualitative interviews with 80 female parliamentarians, district mayors, and village leaders reveal structural and cultural enablers of women's leadership. The 30% gender quota in the constitution, combined with women's councils (Inararibonye), creates pipeline effects. Policy outcomes in health, education, and social protection improve measurably with higher female representation.",
        "keywords": ["women's political participation","Rwanda","governance","gender quota","post-conflict","parliament","gender policy","leadership"],
        "authors": ["RWR010","RWR009"], "year": 2023,
        "journal": "Journal of Democracy", "citations": 34,
        "research_area": "Peace, Security & Governance", "doi": "10.1234/jd.2023.035"
    },
    # AUCA researchers
    {
        "id": "PUB036", "title": "Solar Energy Microgrids for Rural Electrification in Western Rwanda",
        "abstract": "Off-grid solar microgrids represent a transformative technology for Rwanda's electrification goals. This study evaluates the technical performance and social impact of 15 solar microgrid installations in Nyamasheke and Rusizi districts. System reliability (uptime 94%), household satisfaction, and productive use of electricity in small enterprises are assessed. Solar home systems using pay-as-you-go (PAYG) financing models achieve 78% adoption rates. Productive use enterprises (milling, charging stations, refrigeration) emerge as key economic catalysts beyond household lighting.",
        "keywords": ["solar energy","microgrid","rural electrification","Rwanda","PAYG","renewable energy","Western Province","productive use"],
        "authors": ["RWR011","RWR023"], "year": 2022,
        "journal": "Energy for Sustainable Development", "citations": 20,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/esd.2022.036"
    },
    {
        "id": "PUB037", "title": "Deep Learning for Kinyarwanda Speech Recognition in Healthcare Applications",
        "abstract": "Natural language processing tools for Kinyarwanda language remain limited despite Rwanda's digital ambitions. This study develops a transformer-based automatic speech recognition (ASR) system for Kinyarwanda using a corpus of 180 hours of clean speech from health consultations. The model achieves word error rate (WER) of 12.3%, comparable to leading ASR systems for low-resource African languages. Integration with SAMU (medical emergency service) dispatch systems demonstrates clinical utility. Data augmentation techniques address the limited labeled training data challenge.",
        "keywords": ["Kinyarwanda","speech recognition","deep learning","NLP","healthcare","transformer","low-resource language","Rwanda","ASR"],
        "authors": ["RWR011","RWR026"], "year": 2023,
        "journal": "ACL Anthology", "citations": 11,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/acl.2023.037"
    },
    {
        "id": "PUB038", "title": "Biogas Energy Systems and Household Welfare in Rural Rwandan Communities",
        "abstract": "Biogas digesters converting agricultural waste and human excreta to cooking fuel represent a sustainable energy solution for Rwanda's rural households. This study evaluates the welfare impacts of Rwanda Biogas Programme installations across 340 households in Huye, Ruhango, and Kamonyi districts. Households with biogas reduce firewood consumption by 70% and indoor air pollution by 64%. Women spend 3.2 fewer hours weekly on fuel collection. Health outcomes improve significantly with respiratory disease incidence declining 41% in biogas households.",
        "keywords": ["biogas","renewable energy","rural Rwanda","household welfare","indoor air pollution","women's time","health outcomes","energy access"],
        "authors": ["RWR011"], "year": 2020,
        "journal": "Biomass and Bioenergy", "citations": 25,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/bb.2020.038"
    },
    # More publications for completeness
    {
        "id": "PUB039", "title": "Impact of Rwanda's Business Environment Reforms on SME Growth",
        "abstract": "Rwanda has consistently ranked among Africa's top business environments in the World Bank Doing Business Index. This study examines the causal impact of specific regulatory reforms on SME growth and survival using a difference-in-differences design with administrative data from 4,500 firms registered between 2010 and 2020. Company registration reforms reduced time-to-operate from 24 to 4 days. VAT filing digitization cut compliance costs by 60%. Reforms disproportionately benefit formal micro-enterprises while informal sector barriers remain high.",
        "keywords": ["business environment","SME","Rwanda","regulatory reform","entrepreneurship","formalization","Doing Business","economic growth"],
        "authors": ["RWR012","RWR008"], "year": 2022,
        "journal": "Small Business Economics", "citations": 16,
        "research_area": "Economics & Finance", "doi": "10.1234/sbe.2022.039"
    },
    {
        "id": "PUB040", "title": "Corporate Governance and Performance of Rwanda Stock Exchange Listed Companies",
        "abstract": "The Rwanda Stock Exchange (RSE) has grown from 3 to 12 listed companies between 2011 and 2022. This study examines the relationship between board composition, governance quality, and financial performance using panel data from all listed companies. Board gender diversity (at least 30% women) is positively associated with return on equity (ROE) and Tobin's Q. Family ownership concentration negatively affects minority shareholder protection. Capital Markets Authority (CMA) Rwanda disclosure requirements compliance has improved to 87%.",
        "keywords": ["corporate governance","Rwanda Stock Exchange","RSE","board diversity","financial performance","capital markets","CMA Rwanda"],
        "authors": ["RWR012"], "year": 2021,
        "journal": "Journal of African Business", "citations": 8,
        "research_area": "Economics & Finance", "doi": "10.1234/jab.2021.040"
    },
    # Health (AUCA & UGHE)
    {
        "id": "PUB041", "title": "Nutrition Status of School-Age Children in Urban and Peri-Urban Kigali",
        "abstract": "Urbanization is changing nutritional profiles in Rwandan cities, with both undernutrition and overnutrition emerging as public health concerns. This cross-sectional survey of 1,800 school-age children (6-14 years) in Kigali City assesses anthropometric status, dietary diversity, and micronutrient deficiencies. Stunting prevalence of 18.4% coexists with overweight/obesity at 12.1%, representing a double burden. Children from low-income households in Nyamirambo and Kimisagara show highest stunting rates. School feeding program coverage and dietary diversity scores are evaluated.",
        "keywords": ["nutrition","stunting","overweight","Kigali","children","school feeding","dietary diversity","Rwanda","double burden"],
        "authors": ["RWR013","RWR004"], "year": 2023,
        "journal": "Public Health Nutrition", "citations": 9,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/phn.2023.041"
    },
    {
        "id": "PUB042", "title": "Cervical Cancer Screening Uptake and HPV Vaccination Coverage Among Rwandan Women",
        "abstract": "Rwanda became the first African country to achieve 90%+ HPV vaccination coverage in girls. This study evaluates cervical cancer screening uptake alongside vaccination coverage trends from 2011 to 2022 using national health management information system (HMIS) data. Visual inspection with acetic acid (VIA) screening remains below 25% among eligible women despite free service provision. Barriers include stigma, lack of awareness, and limited clinic hours. HPV vaccination's prophylactic effects are projected to reduce cervical cancer burden by 67% by 2040.",
        "keywords": ["cervical cancer","HPV","vaccination","screening","Rwanda","women's health","VIA","HMIS","cancer prevention"],
        "authors": ["RWR013","RWR016"], "year": 2022,
        "journal": "The Lancet Oncology", "citations": 44,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/tlo.2022.042"
    },
    {
        "id": "PUB043", "title": "Tuberculosis Treatment Outcomes and Drug Resistance in Rwanda's National TB Programme",
        "abstract": "Rwanda's National Tuberculosis Programme (NTP) has achieved 87% treatment success rate. This retrospective cohort study analyzes treatment outcomes for 3,200 TB patients diagnosed between 2018 and 2022 across 12 districts. MDR-TB prevalence is 1.8% among new cases and 4.2% among previously treated cases. Contact tracing and directly observed treatment (DOT) are independently associated with treatment success. Digital adherence technologies (99DOTS) piloted in Kigali show 23% improvement in treatment completion among challenging cases.",
        "keywords": ["tuberculosis","MDR-TB","treatment outcomes","Rwanda","NTP","DOT","drug resistance","digital health","adherence"],
        "authors": ["RWR013","RWR003"], "year": 2022,
        "journal": "International Journal of Tuberculosis and Lung Disease", "citations": 18,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/ijtld.2022.043"
    },
    # Environment (ALU)
    {
        "id": "PUB044", "title": "Mountain Gorilla Conservation and Community Livelihoods in Volcanoes National Park Buffer Zone",
        "abstract": "Volcanoes National Park (VNP) hosts one-third of the world's remaining mountain gorillas and generates $35M in annual tourism revenue. This study evaluates the effectiveness of community revenue-sharing programs (5% of park tourism revenue) in reducing human-wildlife conflict and poaching pressure. Analysis of 15 years of park incident data and 280 household surveys in the buffer zone reveals 72% reduction in crop raiding incidents associated with revenue-sharing participation. Eco-enterprise development for women and youth creates alternative livelihoods reducing resource extraction pressure.",
        "keywords": ["mountain gorilla","conservation","Volcanoes National Park","Rwanda","community livelihoods","human-wildlife conflict","ecotourism","biodiversity"],
        "authors": ["RWR014","RWR007"], "year": 2023,
        "journal": "Conservation Biology", "citations": 28,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/cb.2023.044"
    },
    {
        "id": "PUB045", "title": "Wetland Degradation and Ecosystem Services Loss in Rwanda's Marshlands",
        "abstract": "Rwanda's wetlands cover approximately 165,000 hectares and provide critical ecosystem services including water purification, flood control, and carbon storage. This study quantifies ecosystem service degradation from agricultural conversion of wetlands across Southern and Eastern provinces using remote sensing and economic valuation methods. Approximately 40% of wetland area has been converted to agriculture since 2000. Water purification services valued at $180/hectare/year are being lost, with downstream water quality impacts costing an estimated $12M annually in treatment costs.",
        "keywords": ["wetland","ecosystem services","Rwanda","degradation","water quality","flood control","carbon storage","agricultural conversion","marshland"],
        "authors": ["RWR014","RWR028"], "year": 2021,
        "journal": "Ecological Economics", "citations": 21,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/ee.2021.045"
    },
    # Business (ALU)
    {
        "id": "PUB046", "title": "Startup Ecosystem Development in Kigali: Innovation Hubs and Venture Capital",
        "abstract": "Kigali has emerged as a leading startup hub in Sub-Saharan Africa, with innovation hubs including kLab, BNKR, and the Rwanda ICT Chamber supporting over 400 active startups. This study maps the startup ecosystem using survey data from 180 founders and investment data from 2015 to 2022. Fintech, agri-tech, and health-tech are dominant sectors. Early-stage funding gap is the critical constraint for startup growth, with median seed investment of $35,000 being insufficient for product development. Government procurement of startup products remains underdeveloped.",
        "keywords": ["startup","entrepreneurship","Kigali","Rwanda","innovation hub","venture capital","fintech","agritech","healthtech","ecosystem"],
        "authors": ["RWR015","RWR012"], "year": 2023,
        "journal": "Journal of Small Business and Enterprise Development", "citations": 12,
        "research_area": "Economics & Finance", "doi": "10.1234/jsbed.2023.046"
    },
    {
        "id": "PUB047", "title": "Tourism Revenue Diversification and Destination Competitiveness in Rwanda",
        "abstract": "Tourism is Rwanda's largest foreign exchange earner, growing from $63M in 2004 to $498M in 2019 before COVID-19 disruption. This study evaluates destination competitiveness using Ritchie-Crouch's competitive model and tourist satisfaction surveys among 520 international visitors. Gorilla trekking (42% of revenue) creates concentration risk. Emerging segments including MICE tourism, cultural tourism, and adventure tourism are analyzed for diversification potential. Brand Rwanda positioning and airlift connectivity through Kigali International Airport are strategic assets.",
        "keywords": ["tourism","Rwanda","destination competitiveness","gorilla trekking","MICE","revenue diversification","Kigali","hospitality"],
        "authors": ["RWR015"], "year": 2022,
        "journal": "Tourism Management", "citations": 19,
        "research_area": "Economics & Finance", "doi": "10.1234/tm.2022.047"
    },
    # UGHE publications
    {
        "id": "PUB048", "title": "Universal Health Coverage Progress in Rwanda: Lessons for Sub-Saharan Africa",
        "abstract": "Rwanda's Mutuelle de Sante community-based health insurance has achieved 95% population coverage, making Rwanda a UHC model for Sub-Saharan Africa. This policy analysis evaluates the design features, financing mechanisms, and health outcome improvements associated with Mutuelle. Premium stratification by income (5 tiers) balances financial protection with fiscal sustainability. Health service utilization increased 3.8-fold since 2004. Catastrophic health expenditure dropped from 22% to 8% of households. Sustainability challenges from premium collection and government subsidy requirements are examined.",
        "keywords": ["universal health coverage","Mutuelle de Sante","Rwanda","health insurance","UHC","health financing","Sub-Saharan Africa","primary health care"],
        "authors": ["RWR016","RWR003"], "year": 2023,
        "journal": "Health Policy and Planning", "citations": 56,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/hpp.2023.048"
    },
    {
        "id": "PUB049", "title": "Global Health Equity and the Decolonization of Medical Education in Rwanda",
        "abstract": "UGHE's Butaro campus represents a radical reimagining of medical education rooted in the health challenges of low-resource settings. This descriptive study evaluates the UGHE Master of Science in Global Health Delivery (MGHD) curriculum's effectiveness in training practitioner-scholars who transform health systems. Graduate tracking study of 280 alumni shows 85% implementation of quality improvement projects in their home health systems. Partnership-based education models and lived experience pedagogy are evaluated as decolonizing approaches to global health training.",
        "keywords": ["global health equity","medical education","Rwanda","UGHE","decolonization","health delivery","curriculum","training","capacity building"],
        "authors": ["RWR016"], "year": 2022,
        "journal": "The Lancet Global Health", "citations": 33,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/lgh.2022.049"
    },
    {
        "id": "PUB050", "title": "Quality Improvement Collaborative for Surgical Safety in Rwandan District Hospitals",
        "abstract": "Surgical safety remains a significant challenge in Rwanda's district hospitals. This study evaluates a quality improvement collaborative implementing WHO Surgical Safety Checklist across 14 district hospitals. Pre-post design with 24-month follow-up shows 34% reduction in surgical complications and 28% reduction in post-operative infections. Team-based training, morning morbidity reviews, and hospital leadership engagement are critical implementation success factors. Supply chain reliability for surgical consumables is the major barrier to sustainment.",
        "keywords": ["surgical safety","quality improvement","Rwanda","district hospital","WHO checklist","post-operative infections","patient safety","healthcare quality"],
        "authors": ["RWR016","RWR004"], "year": 2021,
        "journal": "BJS Open", "citations": 22,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/bjso.2021.050"
    },
    {
        "id": "PUB051", "title": "Social Determinants of Health and Chronic Disease in Rwanda's Aging Population",
        "abstract": "Rwanda's aging population (over-65s growing at 4.2% annually) faces increasing chronic disease burden with limited geriatric care capacity. This longitudinal study follows 800 adults over 60 in Kigali, Musanze, and Rusizi over three years. Social isolation, food insecurity, and lack of pension income are the strongest social determinants of poor health status. Only 12% of elderly Rwandans access formal geriatric services. Community-based elderly care models and intergenerational support programs are evaluated as scalable solutions.",
        "keywords": ["aging","chronic disease","social determinants","Rwanda","elderly care","geriatric","food insecurity","social isolation","community health"],
        "authors": ["RWR016","RWR024"], "year": 2023,
        "journal": "The Gerontologist", "citations": 10,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/tg.2023.051"
    },
    {
        "id": "PUB052", "title": "COVID-19 Vaccine Hesitancy Among Healthcare Workers in Rwanda",
        "abstract": "Healthcare worker (HCW) vaccine acceptance is critical for COVID-19 vaccination program success. This survey of 1,100 HCWs across 20 hospitals and health centers in Rwanda assesses vaccine hesitancy drivers. Overall hesitancy rate of 18.3% is lower than regional averages. Concerns about vaccine side effects (45%), speed of development (38%), and mRNA technology (32%) are primary hesitancy factors. Trusted leadership communication and peer vaccination visibility significantly reduce hesitancy. Social media misinformation is associated with 2.4x higher hesitancy odds.",
        "keywords": ["COVID-19","vaccine hesitancy","healthcare workers","Rwanda","vaccination","misinformation","social media","public health"],
        "authors": ["RWR017","RWR016"], "year": 2021,
        "journal": "Vaccine", "citations": 37,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/vac.2021.052"
    },
    {
        "id": "PUB053", "title": "Spatial Epidemiology of Malaria Transmission Hotspots in Rwanda's Western Province",
        "abstract": "Despite significant progress in malaria control, transmission hotspots persist in Rwanda's Western Province. This study uses spatial analysis of malaria incidence data from 85 health facilities (2015-2022) to identify persistent hotspots and associated risk factors. Areas surrounding Lake Kivu and Rusizi river valley show 3-8x higher incidence than the national mean. Elevation, temperature, and proximity to water bodies are significant environmental predictors. Targeted indoor residual spraying (IRS) in hotspot areas achieves 68% transmission reduction.",
        "keywords": ["malaria","spatial epidemiology","hotspot","Rwanda","Western Province","IRS","Lake Kivu","transmission","GIS"],
        "authors": ["RWR017","RWR003"], "year": 2022,
        "journal": "PLOS One", "citations": 16,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/plos.2022.053"
    },
    # INES publications
    {
        "id": "PUB054", "title": "Wireless Sensor Networks for Real-Time Environmental Monitoring in Rwandan Factories",
        "abstract": "Industrial pollution monitoring in Rwanda's manufacturing sector is limited by manual inspection systems. This study develops and deploys a wireless sensor network (WSN) for real-time air quality, noise, and effluent monitoring across 8 manufacturing facilities in Kigali and Musanze Special Economic Zones. The system achieves 96.8% data transmission reliability with low-cost LoRa connectivity. Integration with Rwanda Environment Management Authority (REMA) reporting systems enables automated compliance monitoring. Energy harvesting from factory vibrations powers sensor nodes.",
        "keywords": ["wireless sensor network","environmental monitoring","Rwanda","IoT","air quality","industrial pollution","LoRa","factory","REMA"],
        "authors": ["RWR018","RWR006"], "year": 2022,
        "journal": "IEEE Sensors Journal", "citations": 7,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/iesj.2022.054"
    },
    {
        "id": "PUB055", "title": "Distributed Renewable Energy Systems for Post-Harvest Processing in Northern Rwanda",
        "abstract": "Post-harvest processing is energy-intensive and largely reliant on expensive diesel generators in northern Rwanda. This study evaluates hybrid solar-wind energy systems for powering grain mills, milk cooling, and crop drying in Musanze, Rulindo, and Gakenke districts. System sizing methodology for agricultural processing loads is developed. Levelized cost of energy (LCOE) of hybrid systems ($0.18/kWh) is 47% lower than diesel alternatives. Rural energy entrepreneurs managing community processing facilities create sustainable business models.",
        "keywords": ["renewable energy","post-harvest processing","Northern Rwanda","hybrid solar","wind energy","LCOE","agro-processing","rural energy"],
        "authors": ["RWR018","RWR023"], "year": 2021,
        "journal": "Renewable Energy", "citations": 13,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/re.2021.055"
    },
    # INES Agriculture
    {
        "id": "PUB056", "title": "Banana Xanthomonas Wilt Management Through Community-Based Surveillance in Northern Rwanda",
        "abstract": "Banana xanthomonas wilt (BXW) caused by Xanthomonas vasicola pv. musacearum has devastated banana production across northern Rwanda. This community-based participatory research engaged 180 farmer groups in Musanze, Burera, and Gicumbi districts in BXW surveillance and management. Single stem removal as a control measure adopted by 78% of farmer groups reduced disease incidence by 64% over two seasons. Early warning systems using mobile phone-based reporting increased response speed from 14 to 3 days.",
        "keywords": ["banana","BXW","xanthomonas wilt","plant disease","Rwanda","community surveillance","food security","Northern Province","participatory research"],
        "authors": ["RWR019","RWR001"], "year": 2022,
        "journal": "Plant Pathology", "citations": 20,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/pp.2022.056"
    },
    {
        "id": "PUB057", "title": "Pyrethrum Production and Export Value Chain Development in Rwanda",
        "abstract": "Rwanda produces approximately 4,000 tonnes of pyrethrum annually, representing a significant export commodity and income source for highland farmers. This study analyzes the pyrethrum value chain from production in Musanze and Burera through processing at Sopyrwa to export markets. Farmer income from pyrethrum averages $280/tonne compared to $180 for alternative crops. Quality standards, pest pressure from thrips, and contract enforcement mechanisms are key value chain bottlenecks analyzed. Organic certification premium markets offer 40% price premium.",
        "keywords": ["pyrethrum","export","value chain","Rwanda","highlands","Sopyrwa","organic","contract farming","Northern Province"],
        "authors": ["RWR019","RWR002"], "year": 2020,
        "journal": "Journal of Agribusiness in Developing and Emerging Economies", "citations": 9,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/jadee.2020.057"
    },
    {
        "id": "PUB058", "title": "Avocado Value Chain and Export Market Penetration for Rwandan Smallholders",
        "abstract": "Hass avocado has emerged as a high-value export crop for Rwandan smallholders following government-led value chain development since 2015. This study evaluates the performance of 280 smallholder farmers integrated into export-oriented avocado value chains in Bugesera and Rulindo districts. Export market integration increases farm income by 180% compared to domestic market sales. Cold chain infrastructure, food safety certification (Global G.A.P.), and collective marketing through cooperatives are critical success factors. Climate suitability mapping identifies expansion zones in Eastern Province.",
        "keywords": ["avocado","export","value chain","Rwanda","smallholders","Hass","food safety","cooperative","cold chain","Eastern Province"],
        "authors": ["RWR019","RWR021"], "year": 2023,
        "journal": "Food Policy", "citations": 6,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/fp.2023.058"
    },
    # ULK
    {
        "id": "PUB059", "title": "Land Tenure Security and Investment Incentives Among Rwandan Smallholders",
        "abstract": "Rwanda's comprehensive land registration programme (2009-2013) formalized land tenure for 10.4 million parcels. This study examines whether land tenure security from registration increases farm investment using a regression discontinuity design exploiting the sequential rollout across districts. Land-registered farmers invest 34% more in soil improvement, irrigation, and permanent crops than unregistered counterparts. Women's separate title (21% of registered parcels) shows stronger investment effects than joint male-female titles, suggesting women's bargaining power mediates investment.",
        "keywords": ["land tenure","land registration","Rwanda","smallholder investment","women's land rights","agriculture","property rights","land policy"],
        "authors": ["RWR020","RWR008"], "year": 2022,
        "journal": "Journal of Development Economics", "citations": 26,
        "research_area": "Economics & Finance", "doi": "10.1234/jde.2022.059"
    },
    {
        "id": "PUB060", "title": "Legal Framework for Data Protection and Privacy in Rwanda's Digital Economy",
        "abstract": "Rwanda's Law No. 058/2021 on Data Protection and Privacy establishes the regulatory framework for personal data processing. This legal analysis examines the law's alignment with international standards (GDPR), gaps in enforcement mechanisms, and implications for the digital economy. The National Cyber Security Authority (NCSA) as supervisory authority faces capacity constraints in investigations and sanctions. Cross-border data transfer provisions create uncertainty for cloud service providers. Comparative analysis with Kenya, South Africa, and Mauritius informs recommendations for regulatory strengthening.",
        "keywords": ["data protection","privacy","Rwanda","GDPR","NCSA","digital economy","law","cybersecurity","data governance"],
        "authors": ["RWR020"], "year": 2023,
        "journal": "Computer Law and Security Review", "citations": 4,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/clsr.2023.060"
    },
    # More UR researchers
    {
        "id": "PUB061", "title": "Coffee Value Chain Upgrading and Specialty Market Access for Rwandan Cooperatives",
        "abstract": "Rwanda produces high-quality Bourbon arabica coffee with growing recognition in specialty markets. This study analyzes value chain upgrading pathways for 45 coffee cooperatives across Huye, Nyamagabe, and Muhanga districts. Washing station quality improvements enabling specialty grade certification increased farmer prices from $0.80 to $2.20/kg. Direct trade relationships with specialty roasters in European and North American markets eliminate intermediary margins. Women's participation in coffee processing cooperatives reaches 52%, improving household income equity.",
        "keywords": ["coffee","specialty","value chain","Rwanda","cooperative","Bourbon arabica","washing station","fair trade","export"],
        "authors": ["RWR021","RWR019"], "year": 2022,
        "journal": "World Development", "citations": 17,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/wd.2022.061"
    },
    {
        "id": "PUB062", "title": "Soil Carbon Stocks Under Different Land Use Systems in Southern Rwanda",
        "abstract": "Land use change significantly affects soil carbon stocks and climate change mitigation potential. This study measures soil organic carbon (SOC) stocks under forest, agroforestry, annual cropping, and degraded land systems across 180 plots in Southern Province (Huye, Nyamagabe, Gisagara). Forest systems store 3.8x more SOC than annual crop systems. Agroforestry systems sequester carbon at 2.4x the rate of monoculture annual crops. Restoration of degraded lands through agroforestry increases SOC by 1.2 tonnes/hectare/year.",
        "keywords": ["soil carbon","land use","Rwanda","Southern Province","agroforestry","carbon sequestration","climate change","soil organic matter"],
        "authors": ["RWR021","RWR007"], "year": 2021,
        "journal": "Geoderma", "citations": 14,
        "research_area": "Agriculture & Food Security", "doi": "10.1234/geo.2021.062"
    },
    {
        "id": "PUB063", "title": "Natural Language Processing for Automated Kinyarwanda Text Classification",
        "abstract": "Text classification for Kinyarwanda presents unique challenges due to agglutinative morphology and limited digital corpora. This study develops a morphology-aware text classifier using a combination of character-level CNNs and word-level transformers trained on 50,000 labeled Kinyarwanda news articles and social media posts. The hybrid model achieves 91.2% accuracy on a 8-class news topic classification benchmark, outperforming multilingual BERT by 7.3%. The annotated dataset is released as the first large-scale Kinyarwanda text benchmark.",
        "keywords": ["Kinyarwanda","NLP","text classification","CNN","transformer","BERT","low-resource language","Rwanda","natural language processing"],
        "authors": ["RWR022","RWR026"], "year": 2023,
        "journal": "Computational Linguistics", "citations": 15,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/cl.2023.063"
    },
    {
        "id": "PUB064", "title": "Edge Computing for Healthcare Data Processing in Resource-Limited Rwandan Settings",
        "abstract": "Cloud-dependent health information systems face connectivity challenges in Rwanda's rural areas where internet access is intermittent. This study evaluates edge computing architectures for primary healthcare data processing at community health post level in Ngoma, Kirehe, and Bugesera districts. Raspberry Pi-based edge nodes processing patient registration, vital signs, and diagnostic data locally achieve 99.1% data availability versus 78.3% for cloud-only systems. Data synchronization algorithms handle intermittent connectivity with zero data loss. Total cost of ownership is 34% lower than equivalent cloud solutions.",
        "keywords": ["edge computing","healthcare","Rwanda","connectivity","resource-limited","Raspberry Pi","health information system","rural health","IoT"],
        "authors": ["RWR022","RWR005"], "year": 2022,
        "journal": "Journal of Medical Internet Research", "citations": 11,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/jmir.2022.064"
    },
    # Energy
    {
        "id": "PUB065", "title": "Rwanda's Electricity Access Trajectory: Challenges and Innovations on the Path to Universal Access",
        "abstract": "Rwanda aims for universal electricity access by 2024 under its National Energy Policy. This study analyzes the trajectory from 5% electrification in 2009 to 72% in 2022, evaluating the contribution of grid extension, solar home systems, and solar microgrids. Off-grid solutions (SHS and microgrids) serve 45% of electrified households. Densification of existing connections and productive use promotion are critical for economic sustainability. Last-mile electrification of geographically isolated households in Nyungwe and Volcanoes buffer zones presents the highest unit costs.",
        "keywords": ["electricity access","Rwanda","electrification","solar home system","microgrid","universal access","energy policy","off-grid","renewable energy"],
        "authors": ["RWR023","RWR011"], "year": 2023,
        "journal": "Nature Energy", "citations": 31,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/ne.2023.065"
    },
    {
        "id": "PUB066", "title": "Energy Efficiency in Rwandan Industry: Barriers, Opportunities, and Policy Instruments",
        "abstract": "Industrial energy efficiency is critical for Rwanda's economic competitiveness and climate targets. This study assesses energy intensity across 65 manufacturing, agro-processing, and service firms using energy audits and management system evaluation. Average energy intensity of 0.42 kWh per dollar of output is 2.3x higher than South African benchmarks. Compressed air system optimization, efficient motor drives, and process heat recovery represent the highest-value efficiency opportunities. Green loans from BRD (Development Bank of Rwanda) for energy efficiency investments show 18-month average payback periods.",
        "keywords": ["energy efficiency","industry","Rwanda","manufacturing","energy audit","BRD","green finance","process heat","competitive"],
        "authors": ["RWR023"], "year": 2021,
        "journal": "Energy Policy", "citations": 16,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/ep.2021.066"
    },
    {
        "id": "PUB067", "title": "Peatland Carbon Stocks and Degradation in Rwanda's Southern Province Wetlands",
        "abstract": "Rwanda's peatland ecosystems in Southern Province represent significant carbon stocks rarely accounted for in national carbon inventories. This study measures peat depth and carbon density across 12,000 hectares of marshland in Nyamagabe and Gisagara districts using a combination of ground-truthed remote sensing and field sampling. Peat carbon stocks average 280 tonnes CO2e/hectare. Conversion to agriculture releases 85% of surface carbon stocks within 3 years. Peatland restoration and rewetting through changed drainage management is evaluated as a cost-effective climate mitigation measure.",
        "keywords": ["peatland","carbon stocks","wetland","Rwanda","Southern Province","carbon inventory","climate mitigation","rewetting","ecosystem"],
        "authors": ["RWR023","RWR028"], "year": 2022,
        "journal": "Global Change Biology", "citations": 24,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/gcb.2022.067"
    },
    # Public Health UR
    {
        "id": "PUB068", "title": "Stunting Determinants Among Under-5 Children in Rwanda: National Nutrition Survey Analysis",
        "abstract": "Despite significant economic growth, stunting prevalence among Rwandan children under 5 remains at 33%, well above the 20% target. This study analyzes determinants of stunting using Rwanda Demographic and Health Survey (DHS) data from 5,400 children. Multivariate logistic regression identifies maternal education, household wealth index, child dietary diversity, and access to safe water as primary determinants. Children in rural areas and from female-headed households with no male partner show highest stunting prevalence. Nutrition-sensitive agriculture and social protection programs show the strongest policy leverage points.",
        "keywords": ["stunting","malnutrition","under-5","Rwanda","DHS","determinants","maternal education","dietary diversity","public health"],
        "authors": ["RWR024","RWR004"], "year": 2022,
        "journal": "Maternal and Child Nutrition", "citations": 28,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/mcn.2022.068"
    },
    {
        "id": "PUB069", "title": "Indoor Air Pollution and Respiratory Health Among Rwandan Households Using Biomass Fuel",
        "abstract": "Approximately 64% of Rwandan households rely on biomass fuels for cooking, exposing household members to harmful indoor air pollution. This study measures PM2.5 and CO concentrations in 320 kitchens across Nyamasheke, Karongi, and Rubavu using real-time monitors over 48-hour periods. Median PM2.5 of 185 μg/m³ exceeds WHO guidelines (15 μg/m³) by 12-fold. Women and children under 5 have highest exposure. Improved biomass cookstoves reduce PM2.5 by 51% but liquefied petroleum gas (LPG) achieves WHO-guideline levels. Clean cooking transitions require financing mechanisms and consumer awareness programs.",
        "keywords": ["indoor air pollution","biomass","cookstove","Rwanda","respiratory health","PM2.5","women","clean cooking","LPG"],
        "authors": ["RWR024","RWR011"], "year": 2021,
        "journal": "Environmental Health Perspectives", "citations": 19,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/ehp.2021.069"
    },
    {
        "id": "PUB070", "title": "One Health Approach to Zoonotic Disease Surveillance at the Human-Animal Interface in Rwanda",
        "abstract": "Rwanda's dense human-livestock-wildlife interactions create significant zoonotic disease transmission risk. This study implements One Health surveillance protocols across 24 sentinel sites at the human-animal interface in Eastern, Northern, and Western provinces. Brucellosis seroprevalence of 12.4% in cattle-owning households is identified as an underrecognized public health burden. Rift Valley Fever antibody detection in 4.8% of livestock farmers shows active circulation. Integrated human and veterinary disease surveillance through District One Health Committees reduces outbreak investigation time by 60%.",
        "keywords": ["One Health","zoonotic disease","brucellosis","Rift Valley Fever","Rwanda","human-animal interface","surveillance","livestock","wildlife"],
        "authors": ["RWR024","RWR003"], "year": 2023,
        "journal": "PLOS Neglected Tropical Diseases", "citations": 13,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/pntd.2023.070"
    },
    # Finance
    {
        "id": "PUB071", "title": "Pension System Development and Long-Term Savings Mobilization in Rwanda",
        "abstract": "Rwanda Social Security Board (RSSB) manages pension assets of $1.2 billion representing 8.3% of GDP. This study analyzes pension coverage expansion, investment performance, and economic development contribution of RSSB. Formal sector pension coverage reached 45% of workers by 2022. RSSB real estate investments in affordable housing (25,000 units) and infrastructure bonds ($200M) demonstrate developmental mandate alongside financial returns. Informal sector voluntary pension schemes achieve only 8% enrolment, representing a coverage gap for 72% of the workforce.",
        "keywords": ["pension","RSSB","Rwanda","social security","savings","investment","informal sector","housing finance","financial sector"],
        "authors": ["RWR025","RWR008"], "year": 2022,
        "journal": "Development Policy Review", "citations": 7,
        "research_area": "Economics & Finance", "doi": "10.1234/dpr.2022.071"
    },
    {
        "id": "PUB072", "title": "Crypto-Assets and Central Bank Digital Currency Considerations for Rwanda",
        "abstract": "Rwanda's National Bank (BNR) is evaluating central bank digital currency (CBDC) issuance as a complement to mobile money. This policy research analyzes global CBDC implementations (China, Nigeria, Bahamas) and their applicability to Rwanda's financial system context. Tokenized mobile money (Wholesale CBDC) is identified as the most appropriate Rwanda implementation pathway, compatible with existing MTN and Airtel infrastructure. Consumer education, AML/CFT compliance, and offline functionality for rural areas are critical design requirements.",
        "keywords": ["CBDC","central bank digital currency","Rwanda","BNR","cryptocurrency","mobile money","fintech","financial inclusion","monetary policy"],
        "authors": ["RWR025"], "year": 2023,
        "journal": "Journal of Financial Regulation", "citations": 5,
        "research_area": "Economics & Finance", "doi": "10.1234/jfr.2023.072"
    },
    # UR ICT Senior
    {
        "id": "PUB073", "title": "Federated Machine Learning for Privacy-Preserving Health Data Analysis in Rwanda",
        "abstract": "Health data privacy concerns limit AI model training across Rwanda's fragmented health information systems. This study implements federated learning across 12 district hospital health management systems to train diagnostic models for diabetes and hypertension without centralizing patient data. Federated models achieve 91.4% diagnostic accuracy versus 93.2% for centralized training, with the 1.8% trade-off acceptable given privacy benefits. Differential privacy mechanisms are integrated to prevent inference attacks. Communication efficiency is optimized for Rwanda's limited bandwidth contexts.",
        "keywords": ["federated learning","health data privacy","Rwanda","machine learning","diabetes","hypertension","differential privacy","distributed AI","health informatics"],
        "authors": ["RWR026","RWR006"], "year": 2023,
        "journal": "Nature Communications", "citations": 24,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/nc.2023.073"
    },
    {
        "id": "PUB074", "title": "Digital Twin Technology for Smart City Infrastructure Management in Kigali",
        "abstract": "Kigali's smart city vision requires integrated infrastructure management beyond siloed sectoral systems. This study develops a digital twin prototype for Kigali's water distribution, traffic, and energy distribution networks in the Kacyiru and Kimihurura districts. Real-time IoT sensor data from 2,400 nodes feeds the digital twin model predicting infrastructure failures with 87% accuracy 48 hours in advance. Integration with Kigali City Council's service dispatch systems reduces mean incident response time from 6.2 to 2.1 hours. Data governance for multi-stakeholder smart city platforms is analyzed.",
        "keywords": ["digital twin","smart city","Kigali","IoT","infrastructure management","water","traffic","energy","Rwanda","urban planning"],
        "authors": ["RWR026","RWR022"], "year": 2022,
        "journal": "Cities", "citations": 19,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/cit.2022.074"
    },
    {
        "id": "PUB075", "title": "Large Language Models for Low-Resource African Languages: The Kinyarwanda Case",
        "abstract": "Large language models (LLMs) represent a transformative capability largely inaccessible to Kinyarwanda speakers. This study fine-tunes and evaluates LLaMA-2 and mT5 models on a curated 2.8 billion token Kinyarwanda corpus assembled from digitized government documents, newspapers, and web text. Benchmark evaluation across question answering, summarization, and translation tasks shows the fine-tuned models outperform GPT-4 on Kinyarwanda-specific tasks by 23.4%. The models are deployed through a public API serving 12 Rwandan civil society applications.",
        "keywords": ["large language model","LLM","Kinyarwanda","African language","NLP","fine-tuning","LLaMA","low-resource","language model","Rwanda"],
        "authors": ["RWR026","RWR011"], "year": 2024,
        "journal": "EMNLP Proceedings", "citations": 8,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/emnlp.2024.075"
    },
    {
        "id": "PUB076", "title": "Explainable AI for Credit Scoring in Rwanda's Microfinance Sector",
        "abstract": "Credit scoring models using machine learning are being adopted by Rwandan microfinance institutions, but lack of interpretability creates regulatory and fairness concerns. This study develops and evaluates SHAP-based explainability for gradient boosted credit scoring models trained on 85,000 loan records from UMURENGE SACCOs. The explainable model achieves 88.3% AUC versus 89.1% for the black-box model, a marginal accuracy trade-off for significant interpretability gains. Gender and geographic bias in training data is detected and mitigated through fairness-aware retraining.",
        "keywords": ["explainable AI","XAI","credit scoring","microfinance","Rwanda","SHAP","fairness","SACCO","machine learning","bias"],
        "authors": ["RWR026","RWR025"], "year": 2023,
        "journal": "Expert Systems with Applications", "citations": 16,
        "research_area": "ICT & Digital Innovation", "doi": "10.1234/esa.2023.076"
    },
    # AUCA Education
    {
        "id": "PUB077", "title": "Tablet-Based Learning and Student Achievement in Rwandan Primary Schools",
        "abstract": "Rwanda's Smart Classroom Initiative has distributed tablets to primary schools since 2017. This quasi-experimental study compares learning outcomes in 40 tablet-equipped schools with 40 matched comparison schools in Kigali and Muhanga districts over two academic years. Students in tablet-equipped schools show 18% improvement in mathematics scores and 12% improvement in reading comprehension. Teacher digital literacy moderates the effectiveness of tablets, with high-literacy teachers showing 2.6x stronger student outcome effects. Content quality and offline functionality are identified as key success factors.",
        "keywords": ["tablet learning","ICT in education","Rwanda","primary school","mathematics","reading","teacher training","digital literacy","Smart Classroom"],
        "authors": ["RWR027","RWR009"], "year": 2022,
        "journal": "Computers and Education", "citations": 14,
        "research_area": "Education & Social Sciences", "doi": "10.1234/ce.2022.077"
    },
    {
        "id": "PUB078", "title": "Early Childhood Development Outcomes and ECD Center Quality in Rwanda",
        "abstract": "Early childhood development (ECD) centers have expanded rapidly in Rwanda under the Integrated Child Development Service (ICDS) policy. This study assesses the quality of 80 ECD centers across Gasabo, Nyarugenge, and Kicukiro districts using the Environment Rating Scales (ECERS-R) and links quality scores to child developmental outcomes at school entry. Higher quality ECD centers (ECERS-R score above 5) are associated with 0.4 SD improvement in school readiness. Caregiver training, structured play materials, and child-to-caregiver ratios below 8:1 are primary quality determinants.",
        "keywords": ["early childhood development","ECD","Rwanda","child development","school readiness","ECERS","caregiver training","ICDS","preschool"],
        "authors": ["RWR027","RWR009"], "year": 2021,
        "journal": "Early Childhood Research Quarterly", "citations": 11,
        "research_area": "Education & Social Sciences", "doi": "10.1234/ecrq.2021.078"
    },
    # Environment UR
    {
        "id": "PUB079", "title": "Participatory Watershed Management and Erosion Control in Rwanda's Hillside Landscapes",
        "abstract": "Rwanda's steep hillside terrain is highly susceptible to soil erosion under intensive cultivation. This participatory action research engages 240 farming households across 8 micro-catchments in Nyabihu and Rutsiro districts in designing and implementing erosion control measures. Radical and progressive terraces combined with vetiver grass contour strips reduce soil loss by 78% compared to control areas. Community-managed watershed committees (akarere k'ibidukikije) show superior maintenance outcomes compared to government-managed structures. Soil conservation adoption scales inversely with land fragmentation.",
        "keywords": ["watershed management","erosion control","terracing","Rwanda","hillside","participatory research","soil conservation","Nyabihu","community management"],
        "authors": ["RWR028","RWR007"], "year": 2022,
        "journal": "Land Degradation and Development", "citations": 17,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/ldd.2022.079"
    },
    {
        "id": "PUB080", "title": "Urban Green Space Provision and Wellbeing in Kigali's Rapidly Growing Residential Areas",
        "abstract": "Kigali's population has grown from 600,000 to 1.5 million between 2010 and 2022, creating pressure on green space provision. This study maps urban green space coverage using high-resolution satellite imagery and surveys 900 residents across 6 sectors on park access, usage patterns, and self-reported wellbeing. Green space coverage of 4.2 m²/person in informal settlements is 12x lower than formal areas and well below WHO recommendations. Walking access to parks within 300m reduces depression symptoms by 31%. Master Plan green corridor protections are evaluated.",
        "keywords": ["urban green space","wellbeing","Kigali","Rwanda","urbanization","park access","mental health","urban planning","satellite imagery"],
        "authors": ["RWR028","RWR014"], "year": 2023,
        "journal": "Urban Forestry and Urban Greening", "citations": 9,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/ufug.2023.080"
    },
    {
        "id": "PUB081", "title": "Plastic Waste Management and Extended Producer Responsibility in Rwanda",
        "abstract": "Rwanda banned single-use plastics in 2008, making it a global pioneer in plastic waste regulation. This study evaluates the long-term effectiveness of Rwanda's plastic ban and extended producer responsibility (EPR) framework. Plastic waste in Kigali has decreased by 88% since 2008, but informal sector recycling rates remain low at 34% of post-consumer plastics. EPR regulation requiring producers to finance recycling infrastructure is analyzed for 18 multinational companies. Formal recycling sector employment grows at 24% annually but informality creates compliance monitoring gaps.",
        "keywords": ["plastic waste","Rwanda","EPR","extended producer responsibility","recycling","plastic ban","waste management","Kigali","circular economy"],
        "authors": ["RWR028"], "year": 2021,
        "journal": "Resources, Conservation and Recycling", "citations": 33,
        "research_area": "Environment & Natural Resources", "doi": "10.1234/rcr.2021.081"
    },
    # UGHE Maternal Health
    {
        "id": "PUB082", "title": "Respectful Maternity Care and Facility Delivery in Rural Rwanda",
        "abstract": "Disrespect and abuse during childbirth deters facility delivery uptake in rural Rwanda. This mixed-methods study assesses respectful maternity care (RMC) practices in 18 health centers in Karongi, Nyamasheke, and Rutsiro districts. Structured observation of 580 deliveries and exit interviews reveal that 34% of women experienced at least one form of disrespect or abuse. Delay in receiving care (28%) and physical abuse (8%) are most prevalent. A standardized RMC training intervention for midwives and nurses reduces disrespect incidence by 61% at 12-month follow-up.",
        "keywords": ["respectful maternity care","facility delivery","Rwanda","midwifery","abuse","childbirth","maternal health","rural health","Western Province"],
        "authors": ["RWR029","RWR004"], "year": 2022,
        "journal": "Global Health Action", "citations": 21,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/gha.2022.082"
    },
    {
        "id": "PUB083", "title": "Kangaroo Mother Care Scaling in Rwanda's Neonatal Units",
        "abstract": "Kangaroo mother care (KMC) reduces mortality among preterm and low-birthweight newborns by 40% through skin-to-skin contact and exclusive breastfeeding. This implementation science study evaluates the scale-up of KMC from 4 to 28 hospitals across Rwanda between 2017 and 2022. Facility-level KMC adoption reaches 86% among eligible newborns at teaching hospitals but only 52% at district hospitals. Mentor mother programs and dedicated KMC spaces improve adoption. Hospital-level implementation fidelity scoring predicts mortality reduction outcomes with r²=0.72.",
        "keywords": ["kangaroo mother care","KMC","neonatal","preterm","Rwanda","newborn","mortality","implementation science","breastfeeding","low birthweight"],
        "authors": ["RWR029","RWR016"], "year": 2023,
        "journal": "Pediatrics", "citations": 18,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/ped.2023.083"
    },
    {
        "id": "PUB084", "title": "Community-Based Antenatal Care Integration in Rwanda's Village Health Team Model",
        "abstract": "Rwanda's village health teams (VHTs) conduct home visits complementing facility-based antenatal care (ANC). This cluster randomized trial across 60 cells evaluates adding structured ANC components to VHT home visits in Nyagatare and Kirehe districts. Intervention cells show 91% ANC4+ completion versus 72% in control cells. Blood pressure monitoring and birth preparedness counseling by VHTs significantly predict facility delivery. Integration of VHT and facility-based care reduces missed antenatal complications by 44%. Cost per additional ANC4 visit achieved is $8.20.",
        "keywords": ["antenatal care","VHT","village health team","Rwanda","maternal health","ANC","home visit","cluster randomized trial","Eastern Province"],
        "authors": ["RWR029","RWR003"], "year": 2021,
        "journal": "BMC Pregnancy and Childbirth", "citations": 24,
        "research_area": "Health & Biomedical Sciences", "doi": "10.1234/bpc.2021.084"
    },
    # Engineering INES
    {
        "id": "PUB085", "title": "Low-Cost Construction Materials from Industrial Waste for Affordable Housing in Rwanda",
        "abstract": "Rwanda's affordable housing deficit of 344,000 units requires innovative low-cost construction material solutions. This study evaluates compressed earth blocks (CEB) incorporating industrial waste from Kigali cement factory slag, rice husk ash, and recycled aggregate from demolition waste. CEBs with 15% slag and 10% rice husk ash achieve compressive strength of 8.2 MPa, meeting Rwanda Building Code requirements. Material cost savings of 42% compared to fired brick make CEB construction viable for low-income housing. Thermal comfort performance in Kigali's climate is superior to conventional masonry.",
        "keywords": ["affordable housing","construction materials","Rwanda","compressed earth block","industrial waste","cement slag","rice husk","low-cost housing","Kigali"],
        "authors": ["RWR030","RWR023"], "year": 2022,
        "journal": "Construction and Building Materials", "citations": 12,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/cbm.2022.085"
    },
    {
        "id": "PUB086", "title": "Flood Risk Mapping and Early Warning Systems for Kigali's Informal Settlements",
        "abstract": "Flooding affects approximately 800 households annually in Kigali's low-lying informal settlements in Kimicanga and Gitega. This study develops an integrated flood risk map using 10-meter DEM analysis, drainage network mapping, and rainfall-runoff modeling calibrated against 15 historical flood events. Community-based early warning using SMS alerts from automated rainfall stations achieves 94% household alert receipt within 30 minutes of threshold exceedance. Risk map integration into Kigali Master Plan revision is evaluated. Structural flood mitigation through drainage channel rehabilitation has a benefit-cost ratio of 4.2.",
        "keywords": ["flood risk","early warning","Kigali","informal settlements","SMS alert","DEM","drainage","urban flooding","Rwanda","disaster risk reduction"],
        "authors": ["RWR030","RWR028"], "year": 2021,
        "journal": "Natural Hazards and Earth System Sciences", "citations": 20,
        "research_area": "Energy & Infrastructure", "doi": "10.1234/nhess.2021.086"
    },
]

FUNDING_OPPORTUNITIES: List[Dict[str, Any]] = [
    {
        "id": "FUND001",
        "title": "NCST Research Grant for Agricultural Innovation",
        "funder": "National Council for Science and Technology (NCST), Rwanda",
        "description": "Supports applied research in agricultural productivity, food security, and sustainable farming practices. Priority areas include drought-resilient crop varieties, post-harvest technology, irrigation efficiency, and agro-processing value chain development in Rwanda.",
        "keywords": ["agriculture","food security","crop improvement","irrigation","post-harvest","Rwanda","agro-processing","sustainable farming"],
        "areas": ["Agriculture & Food Security"], "amount": "15,000,000 RWF",
        "deadline": "2025-09-30", "eligibility": "Rwandan university researchers and research institutions"
    },
    {
        "id": "FUND002",
        "title": "Gates Foundation Grand Challenges Africa: Digital Health Innovation",
        "funder": "Bill and Melinda Gates Foundation",
        "description": "Funding for digital health innovations addressing child and maternal health, infectious diseases, and primary care strengthening in Sub-Saharan Africa. AI-powered diagnostics, telemedicine, and mobile health platforms are priorities.",
        "keywords": ["digital health","AI","maternal health","child health","mobile health","telemedicine","diagnostics","infectious disease","Sub-Saharan Africa"],
        "areas": ["Health & Biomedical Sciences","ICT & Digital Innovation"], "amount": "USD 100,000",
        "deadline": "2025-11-15", "eligibility": "Institutions in Sub-Saharan Africa"
    },
    {
        "id": "FUND003",
        "title": "USAID Rwanda Feed the Future Research Grant",
        "funder": "USAID Rwanda Mission",
        "description": "Supports research advancing food security and agricultural transformation in Rwanda. Focuses on technology transfer to smallholder farmers, market systems development, nutrition-sensitive agriculture, and climate-smart farming practices in the context of Rwanda's food systems.",
        "keywords": ["food security","smallholder farmers","nutrition","climate-smart agriculture","market systems","technology transfer","Rwanda","USAID"],
        "areas": ["Agriculture & Food Security"], "amount": "USD 250,000",
        "deadline": "2025-10-31", "eligibility": "Rwandan institutions with US partner"
    },
    {
        "id": "FUND004",
        "title": "World Bank Rwanda Skills and Employment Program Research",
        "funder": "World Bank Group",
        "description": "Research supporting Rwanda's human capital development, TVET system improvement, and labor market integration. Priorities include skills gap analysis, private sector employment pathways, and workforce development for Rwanda's priority sectors.",
        "keywords": ["TVET","skills development","employment","human capital","labor market","Rwanda","workforce","private sector","education"],
        "areas": ["Education & Social Sciences","Economics & Finance"], "amount": "USD 180,000",
        "deadline": "2025-12-31", "eligibility": "Academic institutions and think tanks"
    },
    {
        "id": "FUND005",
        "title": "NCST ICT and Digital Innovation Research Grant",
        "funder": "National Council for Science and Technology (NCST), Rwanda",
        "description": "Supports ICT research addressing Rwanda's digital transformation agenda. Priority areas include artificial intelligence, blockchain, IoT applications, cybersecurity, and digital services for key sectors including health, agriculture, and education.",
        "keywords": ["ICT","artificial intelligence","blockchain","IoT","cybersecurity","digital transformation","Rwanda","machine learning","innovation"],
        "areas": ["ICT & Digital Innovation"], "amount": "20,000,000 RWF",
        "deadline": "2025-08-31", "eligibility": "Rwandan researchers with institutional affiliation"
    },
    {
        "id": "FUND006",
        "title": "African Development Bank Climate Change Adaptation Fund",
        "funder": "African Development Bank (AfDB)",
        "description": "Research on climate change adaptation strategies for African contexts. Priority areas include ecosystem-based adaptation, climate-resilient infrastructure, early warning systems, water security under climate change, and nature-based solutions.",
        "keywords": ["climate change","adaptation","ecosystem","water security","early warning","nature-based solutions","Africa","infrastructure","resilience"],
        "areas": ["Environment & Natural Resources","Agriculture & Food Security"], "amount": "USD 150,000",
        "deadline": "2026-01-31", "eligibility": "African research institutions"
    },
    {
        "id": "FUND007",
        "title": "Wellcome Trust Africa Programme: Infectious Disease Research",
        "funder": "Wellcome Trust",
        "description": "Supports research into infectious diseases of major public health importance in Africa. Priority areas include malaria, HIV, tuberculosis, neglected tropical diseases, and emerging infectious diseases. One Health approaches are specifically encouraged.",
        "keywords": ["malaria","HIV","tuberculosis","infectious disease","One Health","neglected tropical diseases","Africa","public health","vaccine"],
        "areas": ["Health & Biomedical Sciences"], "amount": "USD 200,000",
        "deadline": "2025-09-15", "eligibility": "African research institutions with Wellcome Trust approval"
    },
    {
        "id": "FUND008",
        "title": "European Research Council Africa Partnership: Governance and Development",
        "funder": "European Research Council (ERC)",
        "description": "Research on governance, peacebuilding, and development in post-conflict African contexts. Topics include transitional justice, social cohesion, political participation, and institutional development with particular relevance to Great Lakes region.",
        "keywords": ["governance","peacebuilding","transitional justice","post-conflict","social cohesion","Africa","Great Lakes","institutional development","Rwanda"],
        "areas": ["Peace, Security & Governance","Education & Social Sciences"], "amount": "EUR 300,000",
        "deadline": "2025-11-30", "eligibility": "Joint Africa-Europe research teams"
    },
    {
        "id": "FUND009",
        "title": "NCST Public Health and Biomedical Research Grant",
        "funder": "National Council for Science and Technology (NCST), Rwanda",
        "description": "Supports biomedical and public health research addressing Rwanda's disease burden and health system strengthening. Priorities include non-communicable diseases, maternal and child health, health system quality improvement, and community health models.",
        "keywords": ["public health","biomedical","NCD","maternal health","child health","health system","Rwanda","community health","quality improvement"],
        "areas": ["Health & Biomedical Sciences"], "amount": "12,000,000 RWF",
        "deadline": "2025-10-15", "eligibility": "Rwanda-based health researchers"
    },
    {
        "id": "FUND010",
        "title": "Rwanda Green Fund (FONERWA) Environmental Research Grant",
        "funder": "Rwanda Green Fund (FONERWA)",
        "description": "Research supporting Rwanda's green growth and climate resilience objectives. Funding areas include forest conservation, wetland management, watershed restoration, biodiversity monitoring, and green infrastructure development.",
        "keywords": ["green growth","forest","wetland","biodiversity","watershed","climate resilience","Rwanda","FONERWA","conservation","environment"],
        "areas": ["Environment & Natural Resources"], "amount": "8,000,000 RWF",
        "deadline": "2025-07-31", "eligibility": "Rwandan institutions and NGOs"
    },
    {
        "id": "FUND011",
        "title": "Mastercard Foundation Scholars Program Research",
        "funder": "Mastercard Foundation",
        "description": "Research supporting Africa's economic transformation through education, skills, and employment. Priority areas include higher education quality, youth employment pathways, women's economic empowerment, and digital skills development across Sub-Saharan Africa.",
        "keywords": ["education","youth employment","women empowerment","digital skills","economic transformation","Africa","higher education","scholarships"],
        "areas": ["Education & Social Sciences","Economics & Finance"], "amount": "USD 120,000",
        "deadline": "2025-08-15", "eligibility": "African universities and research institutions"
    },
    {
        "id": "FUND012",
        "title": "SIDA (Swedish International Development) Research Cooperation Rwanda",
        "funder": "Swedish International Development Cooperation Agency (SIDA)",
        "description": "Long-term research cooperation for sustainable development in Rwanda. Focus areas include gender equality, environment and climate, agricultural development, and health system strengthening through joint Rwanda-Sweden research partnerships.",
        "keywords": ["gender equality","environment","sustainable development","agriculture","health","Sweden","Rwanda","development cooperation","research partnership"],
        "areas": ["Agriculture & Food Security","Health & Biomedical Sciences","Environment & Natural Resources"], "amount": "SEK 2,000,000",
        "deadline": "2025-12-15", "eligibility": "Rwandan institutions with Swedish partner"
    },
    {
        "id": "FUND013",
        "title": "Rwanda Energy Group Research and Development Fund",
        "funder": "Rwanda Energy Group (REG)",
        "description": "Applied research supporting Rwanda's energy sector transformation. Priority areas include off-grid renewable energy, energy efficiency, smart grid technologies, electricity access for productive uses, and methane gas extraction safety.",
        "keywords": ["energy","renewable","off-grid","smart grid","energy efficiency","electricity access","Rwanda","REG","methane","solar"],
        "areas": ["Energy & Infrastructure"], "amount": "10,000,000 RWF",
        "deadline": "2025-09-01", "eligibility": "Rwandan technical institutions"
    },
    {
        "id": "FUND014",
        "title": "GIZ Rwanda Digital Transformation and Innovation Research",
        "funder": "Deutsche Gesellschaft fur Internationale Zusammenarbeit (GIZ) Rwanda",
        "description": "Research on digital transformation, innovation ecosystems, and ICT for development in Rwanda. Topics include e-government effectiveness, startup ecosystem development, digital financial services, and technology transfer to smallholder farmers.",
        "keywords": ["digital transformation","e-government","startup","fintech","ICT4D","Rwanda","GIZ","innovation","technology"],
        "areas": ["ICT & Digital Innovation","Economics & Finance"], "amount": "EUR 80,000",
        "deadline": "2025-10-01", "eligibility": "Rwandan research institutions"
    },
    {
        "id": "FUND015",
        "title": "EDCTP (European and Developing Countries Clinical Trials Partnership) East Africa",
        "funder": "EDCTP",
        "description": "Clinical research on infectious diseases in East Africa including HIV, malaria, tuberculosis, and emerging infections. Randomized controlled trials, implementation science, and vaccine development in partnership with European institutions.",
        "keywords": ["clinical trials","HIV","malaria","tuberculosis","vaccine","infectious disease","East Africa","RCT","implementation science"],
        "areas": ["Health & Biomedical Sciences"], "amount": "EUR 500,000",
        "deadline": "2026-02-28", "eligibility": "East African institutions with European partner"
    },
    {
        "id": "FUND016",
        "title": "International Fund for Agricultural Development (IFAD) Rwanda Research",
        "funder": "IFAD (International Fund for Agricultural Development)",
        "description": "Research supporting rural poverty reduction through agricultural development in Rwanda. Priorities include value chain development, rural finance access, land tenure security, post-harvest management, and climate-smart agriculture for smallholder farmers.",
        "keywords": ["rural poverty","value chain","rural finance","land tenure","smallholder","climate-smart agriculture","Rwanda","IFAD","cooperatives"],
        "areas": ["Agriculture & Food Security","Economics & Finance"], "amount": "USD 175,000",
        "deadline": "2025-11-01", "eligibility": "Research institutions working with rural communities"
    },
    {
        "id": "FUND017",
        "title": "Peace & Security Fund for the Great Lakes Region",
        "funder": "International Conference on the Great Lakes Region (ICGLR)",
        "description": "Research on peacebuilding, conflict prevention, and security in the Great Lakes region including Rwanda. Topics include reconciliation mechanisms, natural resource conflict, gender in peacebuilding, and regional integration.",
        "keywords": ["peacebuilding","conflict prevention","Great Lakes","reconciliation","gender","security","Rwanda","regional integration","transitional justice"],
        "areas": ["Peace, Security & Governance"], "amount": "USD 60,000",
        "deadline": "2025-08-01", "eligibility": "Great Lakes region institutions"
    },
    {
        "id": "FUND018",
        "title": "Population Council East and Southern Africa Research Grant",
        "funder": "Population Council",
        "description": "Research on reproductive health, adolescent girls' empowerment, gender-based violence prevention, and population-level health interventions in East and Southern Africa. Mixed-methods and implementation science approaches preferred.",
        "keywords": ["reproductive health","adolescent","gender-based violence","women empowerment","Africa","population","implementation science","HIV","family planning"],
        "areas": ["Health & Biomedical Sciences","Peace, Security & Governance"], "amount": "USD 90,000",
        "deadline": "2025-09-30", "eligibility": "African research institutions"
    },
    {
        "id": "FUND019",
        "title": "International Growth Centre (IGC) Rwanda Research Program",
        "funder": "International Growth Centre (IGC) - LSE",
        "description": "Rigorous economic policy research for Rwanda's growth and poverty reduction agenda. Priorities include public finance, trade, urbanization, firm productivity, financial inclusion, and labor market interventions with policy-relevant implications.",
        "keywords": ["economic policy","growth","poverty","trade","urbanization","financial inclusion","labor market","Rwanda","IGC","public finance"],
        "areas": ["Economics & Finance"], "amount": "USD 50,000",
        "deadline": "Rolling", "eligibility": "Researchers working on Rwanda policy questions"
    },
    {
        "id": "FUND020",
        "title": "NCST Environment and Natural Resources Research Grant",
        "funder": "National Council for Science and Technology (NCST), Rwanda",
        "description": "Supports environmental research on Rwanda's natural resource management and climate change challenges. Priority areas include forest ecosystem assessment, wetland conservation, soil degradation, water resources management, and urban environmental quality.",
        "keywords": ["environment","natural resources","forest","wetland","soil degradation","water resources","urban environment","Rwanda","NCST","climate"],
        "areas": ["Environment & Natural Resources"], "amount": "10,000,000 RWF",
        "deadline": "2025-10-31", "eligibility": "Rwandan academic and research institutions"
    },
]

def get_researcher_by_id(researcher_id: str):
    return next((r for r in RESEARCHERS if r["id"] == researcher_id), None)

def get_publication_by_id(pub_id: str):
    return next((p for p in PUBLICATIONS if p["id"] == pub_id), None)

def get_researcher_publications(researcher_id: str):
    researcher = get_researcher_by_id(researcher_id)
    if not researcher:
        return []
    return [p for p in PUBLICATIONS if p["id"] in researcher["publication_ids"]]

def get_all_abstracts():
    return [(p["id"], p["abstract"], p.get("keywords", []), p.get("research_area", "")) for p in PUBLICATIONS]

def get_co_authors(researcher_id: str):
    pubs = get_researcher_publications(researcher_id)
    co_authors = set()
    for pub in pubs:
        for author in pub.get("authors", []):
            if author != researcher_id:
                co_authors.add(author)
    return list(co_authors)
