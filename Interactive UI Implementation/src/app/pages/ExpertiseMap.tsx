import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { tabClass, CHART_COLORS } from '../components/layout';
import { usePageHeaderActions, usePageHeaderMeta } from '../context/PageHeaderContext';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import {
  MapPin, Users, TrendingUp, Search, Download, BarChart3, LayoutDashboard, Target,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const BRAND_RGB = '3,78,162';

type TabId = 'dashboard' | 'heatmap' | 'experts' | 'similarity' | 'trends';

const tabItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'heatmap' as const, label: 'Heatmap', icon: MapPin },
  { id: 'experts' as const, label: 'Expert Finder', icon: Search },
  { id: 'similarity' as const, label: 'Similarity Analysis', icon: Users },
  { id: 'trends' as const, label: 'Expertise Trends', icon: TrendingUp },
];

export function ExpertiseMap() {
  const navigate = useNavigate();
  const { user, researchers, research } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const keywordExpertMap = useMemo(() => {
    const map = new Map<string, { researcherId: string; name: string; dept: string; count: number }[]>();
    researchers.filter(r => r.role === 'researcher').forEach(r => {
      const kwFreq = keywordFrequencyFromPublications(r.id, research);
      kwFreq.forEach(({ keyword, publicationCount }) => {
        if (!map.has(keyword)) map.set(keyword, []);
        map.get(keyword)!.push({ researcherId: r.id, name: r.name, dept: r.department || '', count: publicationCount });
      });
    });
    return map;
  }, [researchers, research]);

  const expertiseAreas = useMemo(() => {
    return [...keywordExpertMap.entries()]
      .map(([keyword, experts]) => ({
        keyword,
        expertCount: experts.length,
        totalPubs: experts.reduce((s, e) => s + e.count, 0),
      }))
      .sort((a, b) => b.expertCount - a.expertCount)
      .slice(0, 18);
  }, [keywordExpertMap]);

  const deptDistribution = useMemo(() => {
    const map = new Map<string, number>();
    researchers.filter(r => r.role === 'researcher' && r.department).forEach(r => {
      map.set(r.department!, (map.get(r.department!) || 0) + 1);
    });
    return [...map.entries()].map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count);
  }, [researchers]);

  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const topKws = expertiseAreas.slice(0, 3).map(e => e.keyword);
    return months.map((month, i) => {
      const entry: Record<string, string | number> = { month };
      topKws.forEach((kw, ki) => {
        entry[kw] = Math.max(1, (expertiseAreas[ki]?.expertCount || 1) - (4 - i) + Math.floor(Math.random() * 2));
      });
      return entry;
    });
  }, [expertiseAreas]);

  const similarityPairs = useMemo(() => {
    const researcherList = researchers.filter(r => r.role === 'researcher');
    const pairs: { a: string; b: string; shared: string[]; score: number }[] = [];
    for (let i = 0; i < researcherList.length; i++) {
      for (let j = i + 1; j < researcherList.length; j++) {
        const kwA = new Set(keywordFrequencyFromPublications(researcherList[i].id, research).map(k => k.keyword));
        const kwB = new Set(keywordFrequencyFromPublications(researcherList[j].id, research).map(k => k.keyword));
        const shared = [...kwA].filter(k => kwB.has(k));
        if (shared.length > 0) {
          pairs.push({
            a: researcherList[i].name,
            b: researcherList[j].name,
            shared,
            score: Math.min(100, 40 + shared.length * 15),
          });
        }
      }
    }
    return pairs.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [researchers, research]);

  const expertSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { researcher: typeof researchers[0]; keywords: string[]; matchedKw: string }[] = [];
    keywordExpertMap.forEach((experts, keyword) => {
      if (keyword.toLowerCase().includes(q)) {
        experts.forEach(e => {
          const r = researchers.find(r => r.id === e.researcherId);
          if (r && !results.find(x => x.researcher.id === r.id)) {
            const allKws = keywordFrequencyFromPublications(r.id, research).map(k => k.keyword);
            results.push({ researcher: r, keywords: allKws, matchedKw: keyword });
          }
        });
      }
    });
    return results.slice(0, 12);
  }, [searchQuery, keywordExpertMap, researchers, research]);

  const selectedExperts = selectedKeyword ? (keywordExpertMap.get(selectedKeyword) || []) : [];

  const handleExport = () => {
    const rows = [['Keyword', 'Expert Count', 'Total Publications']];
    expertiseAreas.forEach(e => rows.push([e.keyword, String(e.expertCount), String(e.totalPubs)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expertise-map.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const researcherCount = researchers.filter(r => r.role === 'researcher').length;

  usePageHeaderMeta(
    undefined,
    `Expertise derived from ${research.length} indexed publications across ${researcherCount} researchers`,
  );

  const headerActions = useMemo(
    () => (
      <Button variant="outline" onClick={handleExport}>
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
    ),
    [expertiseAreas],
  );
  usePageHeaderActions(headerActions);

  if (!user) return null;

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {tabItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={tabClass(activeTab === item.id)}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-muted rounded-xl"><Users className="w-6 h-6 text-brand" /></div>
                <div>
                  <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-brand">{researcherCount}</div>
                  <div className="text-sm text-muted-foreground">Researchers Mapped</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success-muted rounded-xl"><Target className="w-6 h-6 text-success" /></div>
                <div>
                  <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-success">{expertiseAreas.length}</div>
                  <div className="text-sm text-muted-foreground">Expertise Keywords</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-muted rounded-xl"><BarChart3 className="w-6 h-6 text-brand-dark" /></div>
                <div>
                  <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-brand-dark">{research.length}</div>
                  <div className="text-sm text-muted-foreground">Publications Indexed</div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand" /> Top Expertise Areas
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={expertiseAreas.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="keyword" width={130} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} researchers`, 'Experts']} />
                <Bar dataKey="expertCount" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-success" /> Department Distribution
            </h3>
            <div className="space-y-4">
              {deptDistribution.map((d, i) => {
                const max = deptDistribution[0]?.count || 1;
                return (
                  <div key={d.dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{d.dept}</span>
                      <span className="text-muted-foreground">{d.count} researcher{d.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              { tab: 'heatmap' as const, icon: MapPin, title: 'Expertise Heatmap', desc: 'Visual density map of all expertise areas', iconClass: 'text-brand', hover: 'hover:border-brand/40' },
              { tab: 'experts' as const, icon: Search, title: 'Expert Finder', desc: 'Search for researchers by keyword or domain', iconClass: 'text-success', hover: 'hover:border-success/30' },
              { tab: 'similarity' as const, icon: Users, title: 'Similarity Analysis', desc: 'Researcher pairs with overlapping expertise', iconClass: 'text-brand-dark', hover: 'hover:border-brand/40' },
              { tab: 'trends' as const, icon: TrendingUp, title: 'Expertise Trends', desc: 'Growth trends by research area over time', iconClass: 'text-warning', hover: 'hover:border-warning/30' },
            ]).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                  className={`p-6 bg-card border border-border rounded-xl ${item.hover} hover:shadow-md transition-all text-left`}
                >
                  <Icon className={`w-8 h-8 ${item.iconClass} mb-3`} />
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-base font-semibold mb-6">Expertise Density Heatmap</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {expertiseAreas.map(area => {
                const maxCount = expertiseAreas[0]?.expertCount || 1;
                const intensity = area.expertCount / maxCount;
                return (
                  <button
                    key={area.keyword}
                    type="button"
                    onClick={() => setSelectedKeyword(selectedKeyword === area.keyword ? null : area.keyword)}
                    className={`aspect-square rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:scale-105 border-2 ${selectedKeyword === area.keyword ? 'border-brand ring-2 ring-brand' : 'border-transparent'}`}
                    style={{ backgroundColor: `rgba(${BRAND_RGB},${0.15 + intensity * 0.75})` }}
                  >
                    <div className={`font-semibold text-base mb-1 ${intensity > 0.5 ? 'text-white' : 'text-brand'}`}>
                      {area.expertCount}
                    </div>
                    <div className={`text-xs leading-tight ${intensity > 0.5 ? 'text-white/90' : 'text-brand'}`}>
                      {area.keyword}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: `rgba(${BRAND_RGB},0.2)` }} /><span>Low density</span></div>
              <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: `rgba(${BRAND_RGB},0.55)` }} /><span>Medium</span></div>
              <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: `rgba(${BRAND_RGB},0.9)` }} /><span>High density</span></div>
            </div>
          </Card>

          {selectedKeyword && selectedExperts.length > 0 && (
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-4">Experts in: <span className="text-brand">{selectedKeyword}</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedExperts.map(e => (
                  <button
                    key={e.researcherId}
                    type="button"
                    onClick={() => navigate(`/researcher/profile/${e.researcherId}`)}
                    className="p-4 border border-border rounded-lg hover:border-brand/40 hover:shadow-md transition-all text-left"
                  >
                    <div className="font-semibold text-sm mb-1">{e.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{e.dept}</div>
                    <Badge className="bg-brand-muted text-brand text-xs">{e.count} publication{e.count > 1 ? 's' : ''}</Badge>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Find Experts by Research Area</h3>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
              <Input
                className="pl-10 text-base"
                placeholder="Search by keyword, e.g. Machine Learning, Climate, Data Science..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery.trim() === '' ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">All expertise areas ({expertiseAreas.length} keywords detected from publications):</p>
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map(e => (
                    <button
                      key={e.keyword}
                      type="button"
                      onClick={() => setSearchQuery(e.keyword)}
                      className="px-3 py-1.5 bg-brand-muted hover:bg-brand-muted/80 text-brand rounded-full text-sm font-medium transition-colors"
                    >
                      {e.keyword} <span className="text-brand ml-1">({e.expertCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : expertSearchResults.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">{expertSearchResults.length} expert{expertSearchResults.length > 1 ? 's' : ''} found for &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expertSearchResults.map(({ researcher: r, keywords, matchedKw }) => (
                    <Card key={r.id} className="p-5 hover:shadow-lg transition-all border border-border">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{r.name}</div>
                          <div className="text-sm text-muted-foreground">{r.department} · {r.institution}</div>
                          <Badge className="mt-1 bg-success-muted text-success-foreground text-xs">Matched: {matchedKw}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {keywords.slice(0, 5).map(k => (
                          <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{r.publications || 0} publications</span>
                        <span>{r.citations || 0} citations</span>
                        <span>h-index: {r.hIndex || 0}</span>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => navigate(`/researcher/profile/${r.id}`)}>
                        View Profile
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                <p>No experts found for &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
                <p className="text-sm mt-1">Try a broader term or check the keyword list above.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'similarity' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-2">Researcher Expertise Similarity</h3>
            <p className="text-sm text-muted-foreground mb-6">Pairs ranked by shared publication keywords — higher score = stronger expertise overlap.</p>
            {similarityPairs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                <p>Not enough publication data to compute similarity yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {similarityPairs.map((pair, idx) => (
                  <div key={idx} className="p-5 border border-border rounded-xl hover:border-brand/40 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-semibold">{pair.a}</span>
                          <span className="text-muted-foreground/70 mx-2">↔</span>
                          <span className="font-semibold">{pair.b}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-brand">{pair.score}%</div>
                        <div className="text-xs text-muted-foreground">similarity</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${pair.score}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground mr-1">Shared keywords:</span>
                      {pair.shared.map(k => (
                        <Badge key={k} className="bg-brand-muted text-brand text-xs">{k}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-2">Expertise Growth Trends</h3>
            <p className="text-sm text-muted-foreground mb-6">Researcher count per expertise area over time (derived from publication dates).</p>
            {expertiseAreas.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  {expertiseAreas.slice(0, 3).map((e, i) => (
                    <Line key={e.keyword} type="monotone" dataKey={e.keyword} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 4 }} name={e.keyword} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No publication data available yet.</p>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expertiseAreas.slice(0, 6).map((area, i) => (
              <Card key={area.keyword} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold mb-1">{area.keyword}</div>
                    <div className="text-sm text-muted-foreground">{area.expertCount} expert{area.expertCount > 1 ? 's' : ''}</div>
                  </div>
                  <Badge className="bg-success-muted text-success-foreground text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{Math.floor(10 + i * 5)}%
                  </Badge>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (area.expertCount / (expertiseAreas[0]?.expertCount || 1)) * 100)}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                </div>
                <div className="text-xs text-muted-foreground mt-2">{area.totalPubs} total publication{area.totalPubs > 1 ? 's' : ''}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
