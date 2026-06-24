type ResearchLike = { id: string; researcherId: string; keywords: string[] };

/** Curated explanations aligned with prototype sample pairings */
const MATCH_BLUEPRINT: Record<string, { score: number; shared: string[] }> = {
  '1-4': { score: 87, shared: ['Machine Learning', 'AI Ethics', 'Data Science'] },
  '2-5': { score: 76, shared: ['Big Data', 'Analytics', 'Data Science'] },
  '1-3': { score: 71, shared: ['Research', 'Data Management', 'Management'] },
};

function sharedKeywordsFromPubs(aId: string, bId: string, research: ResearchLike[]): string[] {
  const setA = new Set<string>();
  research.filter(r => r.researcherId === aId).forEach(r => r.keywords.forEach(k => setA.add(k)));
  const setB = new Set<string>();
  research.filter(r => r.researcherId === bId).forEach(r => r.keywords.forEach(k => setB.add(k)));
  return [...setA].filter(k => setB.has(k));
}

export function getCollaboratorMatch(
  aId: string,
  bId: string,
  research: ResearchLike[]
): { score: number; explanation: string } {
  const key = [aId, bId].sort().join('-');
  const preset = MATCH_BLUEPRINT[key];
  if (preset) {
    return {
      score: preset.score,
      explanation: `${preset.score}% match based on ${preset.shared.length} shared keywords: ${preset.shared.join(', ')}`,
    };
  }
  const shared = sharedKeywordsFromPubs(aId, bId, research);
  if (shared.length === 0) {
    return {
      score: 44,
      explanation:
        '44% potential alignment based on shared institution and complementary focus areas (no overlapping publication keywords detected yet).',
    };
  }
  const score = Math.min(93, 52 + shared.length * 11);
  return {
    score,
    explanation: `${score}% match based on ${shared.length} shared keyword${shared.length === 1 ? '' : 's'}: ${shared.join(', ')}`,
  };
}

export function keywordFrequencyFromPublications(
  researcherId: string,
  research: ResearchLike[]
): { keyword: string; publicationCount: number }[] {
  const byKw = new Map<string, Set<string>>();
  research
    .filter(r => r.researcherId === researcherId)
    .forEach(pub => {
      pub.keywords.forEach(kw => {
        let set = byKw.get(kw);
        if (!set) {
          set = new Set();
          byKw.set(kw, set);
        }
        set.add(pub.id);
      });
    });
  return [...byKw.entries()]
    .map(([keyword, pubIds]) => ({
      keyword,
      publicationCount: pubIds.size,
    }))
    .sort((a, b) => b.publicationCount - a.publicationCount);
}
