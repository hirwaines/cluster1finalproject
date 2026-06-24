"""
Shared NLP and text processing utilities for all ResearchIQ AI services.
"""

import re
import math
from collections import Counter
from typing import List, Tuple, Dict

STOPWORDS = {
    "a","an","the","and","or","but","in","on","at","to","for","of","with",
    "by","from","is","are","was","were","be","been","being","have","has","had",
    "do","does","did","will","would","could","should","may","might","shall",
    "that","this","these","those","it","its","we","our","they","their","he","his",
    "she","her","i","my","you","your","as","if","so","than","then","when","which",
    "who","whom","what","how","where","there","here","not","no","nor","also",
    "both","either","each","all","any","some","such","more","most","other",
    "further","once","into","through","during","before","after","above","below",
    "between","out","off","over","under","again","few","very","just","while",
    "study","research","paper","results","findings","data","analysis","using",
    "used","shows","show","across","within","among","between","well","significantly",
    "significant","however","therefore","thus","hence","moreover","furthermore",
    "although","despite","based","compared","associated","related","including",
    "use","uses","number","numbers","high","low","higher","lower","new","two",
    "three","four","five","six","first","second","third","per","cent","percent",
    "approximately","about","around","nearly","over","under","less","more",
    "mean","average","total","sample","population","group","groups",
}

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s\-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def tokenize(text: str) -> List[str]:
    return [w for w in clean_text(text).split() if len(w) > 2 and w not in STOPWORDS]

def ngrams(tokens: List[str], n: int) -> List[str]:
    return [" ".join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]

def extract_keywords_tfidf(texts: List[str], top_n: int = 15) -> List[Tuple[str, float]]:
    """
    Lightweight TF-IDF keyword extraction without sklearn dependency.
    Works on a list of documents and returns top keywords with scores.
    """
    if not texts:
        return []

    tokenized = [tokenize(t) for t in texts]
    N = len(tokenized)

    # Document frequency
    df: Dict[str, int] = {}
    for tokens in tokenized:
        for w in set(tokens):
            df[w] = df.get(w, 0) + 1

    # TF-IDF for each document, then average across corpus
    scores: Dict[str, float] = {}
    for tokens in tokenized:
        tf = Counter(tokens)
        total = max(len(tokens), 1)
        for word, count in tf.items():
            tfidf = (count / total) * math.log((N + 1) / (df.get(word, 0) + 1))
            scores[word] = scores.get(word, 0) + tfidf

    # Normalize by number of documents
    scores = {w: s / N for w, s in scores.items()}

    sorted_kw = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_kw[:top_n]

def extract_keywords_from_text(text: str, top_n: int = 12) -> List[str]:
    """Extract keywords from a single text using statistical co-occurrence."""
    tokens = tokenize(text)
    unigrams = Counter(tokens)
    bigrams = Counter(ngrams(tokens, 2))

    combined: Dict[str, float] = {}
    total_tokens = max(len(tokens), 1)
    for w, c in unigrams.items():
        combined[w] = c / total_tokens
    for bg, c in bigrams.items():
        if c >= 2:
            combined[bg] = (c / total_tokens) * 1.5

    sorted_kw = sorted(combined.items(), key=lambda x: x[1], reverse=True)
    return [kw for kw, _ in sorted_kw[:top_n]]

def cosine_similarity(vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
    """Compute cosine similarity between two TF-IDF dictionaries."""
    if not vec1 or not vec2:
        return 0.0
    common = set(vec1.keys()) & set(vec2.keys())
    dot = sum(vec1[k] * vec2[k] for k in common)
    mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
    mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)

def build_tfidf_vector(text: str, idf: Dict[str, float]) -> Dict[str, float]:
    tokens = tokenize(text)
    tf = Counter(tokens)
    total = max(len(tokens), 1)
    return {w: (c / total) * idf.get(w, 1.0) for w, c in tf.items()}

def build_corpus_idf(texts: List[str]) -> Dict[str, float]:
    N = len(texts)
    df: Dict[str, int] = {}
    for text in texts:
        for w in set(tokenize(text)):
            df[w] = df.get(w, 0) + 1
    return {w: math.log((N + 1) / (count + 1)) for w, count in df.items()}

def classify_research_area(text: str) -> str:
    """Rule-based research area classifier using keyword matching."""
    text_lower = text.lower()
    area_keywords = {
        "Agriculture & Food Security": [
            "agriculture","cassava","maize","bean","crop","farming","soil","irrigation",
            "food security","harvest","fertilizer","seed","livestock","dairy","sorghum",
            "coffee","tea","avocado","pyrethrum","banana","agricultural"
        ],
        "Health & Biomedical Sciences": [
            "health","malaria","hiv","aids","tuberculosis","maternal","child mortality",
            "hospital","clinic","disease","treatment","medicine","vaccine","nutrition",
            "diabetes","hypertension","cancer","mental health","public health","epidemiology",
            "biomedical","community health","antenatal","neonatal","obstetric"
        ],
        "ICT & Digital Innovation": [
            "ict","digital","mobile","internet","software","algorithm","machine learning",
            "artificial intelligence","blockchain","iot","sensor","data","computing",
            "cybersecurity","e-government","app","platform","network","technology",
            "kinyarwanda","nlp","language model","fintech","mobile money"
        ],
        "Environment & Natural Resources": [
            "environment","forest","deforestation","conservation","biodiversity","wetland",
            "lake","river","water","climate","ecosystem","erosion","soil degradation",
            "methane","carbon","pollution","wildlife","gorilla","peatland","wetland"
        ],
        "Economics & Finance": [
            "economic","finance","gdp","investment","trade","market","poverty","income",
            "sacco","microfinance","bank","insurance","debt","fiscal","employment","sme",
            "tourism","startup","entrepreneurship","value chain","export","import"
        ],
        "Education & Social Sciences": [
            "education","school","curriculum","teacher","student","learning","tvet",
            "vocational","university","literacy","ecd","early childhood","tablet",
            "competency","gender","social","community","household","survey"
        ],
        "Energy & Infrastructure": [
            "energy","solar","electricity","power","grid","biogas","renewable","fuel",
            "electrification","infrastructure","construction","housing","flood",
            "drainage","building","microgrid","methane","off-grid","hybrid"
        ],
        "Peace, Security & Governance": [
            "peace","reconciliation","genocide","gacaca","transitional justice","governance",
            "conflict","security","political","parliament","women leadership","law","legal",
            "policy","corruption","accountability","post-conflict","social cohesion"
        ],
    }
    scores = {}
    for area, keywords in area_keywords.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[area] = score
    if not scores:
        return "General Research"
    return max(scores, key=scores.get)

def extract_named_entities(text: str) -> Dict[str, List[str]]:
    """Simple pattern-based NER for Rwanda research context."""
    institutions = [
        "University of Rwanda", "AUCA", "INES-Ruhengeri", "ULK", "ALU",
        "UGHE", "African Leadership University", "Kigali Independent University",
        "Rwanda Polytechnic", "IPRC", "University of Global Health Equity"
    ]
    locations = [
        "Kigali", "Musanze", "Huye", "Rubavu", "Gisenyi", "Butare",
        "Ruhengeri", "Byumba", "Kibungo", "Nyanza", "Rusizi",
        "Northern Province", "Southern Province", "Eastern Province",
        "Western Province", "Kigali City", "Nyungwe", "Volcanoes",
        "Lake Kivu", "Lake Muhazi", "Nyabarongo", "Bugesera", "Kayonza",
        "Gakenke", "Gatsibo", "Kirehe", "Ngoma", "Rulindo", "Gicumbi",
        "Nyagatare", "Rwamagana", "Karongi", "Nyamasheke", "Muhanga",
        "Kamonyi", "Ruhango", "Nyamagabe", "Gisagara", "Nyaruguru",
        "Burera", "Rutsiro", "Nyabihu", "Ngororero", "Rubavu"
    ]
    funders = [
        "NCST", "Gates Foundation", "USAID", "World Bank", "SIDA", "GIZ",
        "FONERWA", "AfDB", "African Development Bank", "Wellcome Trust",
        "EDCTP", "IFAD", "UNICEF", "WHO", "EU", "European Union"
    ]

    found_institutions = [i for i in institutions if i.lower() in text.lower()]
    found_locations = [l for l in locations if l in text]
    found_funders = [f for f in funders if f in text]

    return {
        "institutions": list(set(found_institutions)),
        "locations": list(set(found_locations)),
        "funders": list(set(found_funders)),
    }
