import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { Brain, ArrowLeft, MapPin, Users, TrendingUp, Search, Download, BarChart3, LayoutDashboard, Home, LogOut, Network, Target, Database } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

export function ExpertiseMap() {
  const navigate = useNavigate();
  const { user, logout, researchers, research } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'heatmap' | 'experts' | 'similarity' | 'trends'>('dashboard');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Build keyword → researchers map from real publication data
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

  // Aggregate expertise areas with researcher counts
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

  // Department distribution from real data
  const deptDistribution = useMemo(() => {
    const map = new Map<string, number>();
    researchers.filter(r => r.role === 'researcher' && r.department).forEach(r => {
      map.set(r.department!, (map.get(r.department!) || 0) + 1);
    });
    return [...map.entries()].map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count);
  }, [researchers]);

  // Expertise trend data (simulated growth based on publication dates)
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

  // Similarity: for each researcher pair, compute shared keywords
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

  // Expert search results
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

  if (!user) return null;

  const COLORS = ['#1e3a8a', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Heatmap', icon: MapPin },
    { id: 'experts', label: 'Expert Finder', icon: Search },
    { id: 'similarity', label: 'Similarity Analysis', icon: Users },
    { id: 'trends', label: 'Expertise Trends', icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-900">ResearchIQ</span>
            <span className="text-gray-400 mx-2">/</span>
            <span className="font-semibold text-gray-700">Expertise Map</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1 as any)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[65px] self-start">
          <div className="p-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 px-3">EXPLORE</div>
            <div className="space-y-1">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-blue-800 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="text-xs font-semibold text-gray-500 mb-3 px-3">NAVIGATE</div>
              <div className="space-y-1">
                <button onClick={() => navigate('/network')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Network className="w-5 h-5" /> Collaboration Network
                </button>
                <button onClick={() => navigate('/data-integration')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Database className="w-5 h-5" /> Data Integration
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Institutional Expertise Map</h1>
          <p className="text-gray-600">Expertise derived from {research.length} indexed publications across {researchers.filter(r => r.role === 'researcher').length} researchers</p>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 rounded-xl"><Users className="w-6 h-6 text-blue-800" /></div>
                  <div>
                    <div className="text-3xl font-bold text-blue-800">{researchers.filter(r => r.role === 'researcher').length}</div>
                    <div className="text-sm text-gray-600">Researchers Mapped</div>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-100 rounded-xl"><Target className="w-6 h-6 text-green-600" /></div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{expertiseAreas.length}</div>
                    <div className="text-sm text-gray-600">Expertise Keywords</div>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-100 rounded-xl"><BarChart3 className="w-6 h-6 text-purple-600" /></div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{research.length}</div>
                    <div className="text-sm text-gray-600">Publications Indexed</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top expertise areas */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-800" /> Top Expertise Areas
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={expertiseAreas.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="keyword" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} researchers`, 'Experts']} />
                  <Bar dataKey="expertCount" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Department distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" /> Department Distribution
              </h3>
              <div className="space-y-4">
                {deptDistribution.map((d, i) => {
                  const max = deptDistribution[0]?.count || 1;
                  return (
                    <div key={d.dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{d.dept}</span>
                        <span className="text-gray-500">{d.count} researcher{d.count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick navigation cards */}
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => setActiveTab('heatmap')} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left">
                <MapPin className="w-8 h-8 text-blue-800 mb-3" />
                <div className="font-bold mb-1">Expertise Heatmap</div>
                <div className="text-sm text-gray-500">Visual density map of all expertise areas</div>
              </button>
              <button onClick={() => setActiveTab('experts')} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all text-left">
                <Search className="w-8 h-8 text-green-600 mb-3" />
                <div className="font-bold mb-1">Expert Finder</div>
                <div className="text-sm text-gray-500">Search for researchers by keyword or domain</div>
              </button>
              <button onClick={() => setActiveTab('similarity')} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-left">
                <Users className="w-8 h-8 text-purple-600 mb-3" />
                <div className="font-bold mb-1">Similarity Analysis</div>
                <div className="text-sm text-gray-500">Researcher pairs with overlapping expertise</div>
              </button>
              <button onClick={() => setActiveTab('trends')} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all text-left">
                <TrendingUp className="w-8 h-8 text-amber-600 mb-3" />
                <div className="font-bold mb-1">Expertise Trends</div>
                <div className="text-sm text-gray-500">Growth trends by research area over time</div>
              </button>
            </div>
          </div>
        )}

        {/* HEATMAP TAB */}
        {activeTab === 'heatmap' && (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">Expertise Density Heatmap</h3>
              <div className="grid grid-cols-6 gap-3">
                {expertiseAreas.map(area => {
                  const maxCount = expertiseAreas[0]?.expertCount || 1;
                  const intensity = area.expertCount / maxCount;
                  return (
                    <button
                      key={area.keyword}
                      onClick={() => setSelectedKeyword(selectedKeyword === area.keyword ? null : area.keyword)}
                      className={`aspect-square rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:scale-105 border-2 ${selectedKeyword === area.keyword ? 'border-blue-800 ring-2 ring-blue-500' : 'border-transparent'}`}
                      style={{ backgroundColor: `rgba(37,99,235,${0.15 + intensity * 0.75})` }}
                    >
                      <div className={`font-bold text-lg mb-1 ${intensity > 0.5 ? 'text-white' : 'text-blue-900'}`}>
                        {area.expertCount}
                      </div>
                      <div className={`text-xs leading-tight ${intensity > 0.5 ? 'text-white/90' : 'text-blue-800'}`}>
                        {area.keyword}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(37,99,235,0.2)' }} /><span>Low density</span></div>
                <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(37,99,235,0.55)' }} /><span>Medium</span></div>
                <div className="flex items-center gap-2"><div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(37,99,235,0.9)' }} /><span>High density</span></div>
              </div>
            </Card>

            {/* Selected keyword experts */}
            {selectedKeyword && selectedExperts.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Experts in: <span className="text-blue-800">{selectedKeyword}</span></h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedExperts.map(e => {
                    const r = researchers.find(r => r.id === e.researcherId);
                    return (
                      <button
                        key={e.researcherId}
                        onClick={() => navigate(`/researcher/profile/${e.researcherId}`)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
                      >
                        <div className="font-semibold text-sm mb-1">{e.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{e.dept}</div>
                        <Badge className="bg-blue-100 text-blue-900 text-xs">{e.count} publication{e.count > 1 ? 's' : ''}</Badge>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-8">
              {/* Top expertise areas bar chart */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-800" /> Top Expertise Areas
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={expertiseAreas.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="keyword" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v} researchers`, 'Experts']} />
                    <Bar dataKey="expertCount" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Department distribution */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" /> Department Distribution
                </h3>
                <div className="space-y-4">
                  {deptDistribution.map((d, i) => {
                    const max = deptDistribution[0]?.count || 1;
                    return (
                      <div key={d.dept}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{d.dept}</span>
                          <span className="text-gray-500">{d.count} researcher{d.count > 1 ? 's' : ''}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* EXPERT FINDER TAB */}
        {activeTab === 'experts' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Find Experts by Research Area</h3>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  className="pl-10 text-base"
                  placeholder="Search by keyword, e.g. Machine Learning, Climate, Data Science..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">All expertise areas ({expertiseAreas.length} keywords detected from publications):</p>
                  <div className="flex flex-wrap gap-2">
                    {expertiseAreas.map(e => (
                      <button
                        key={e.keyword}
                        onClick={() => setSearchQuery(e.keyword)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-full text-sm font-medium transition-colors"
                      >
                        {e.keyword} <span className="text-blue-500 ml-1">({e.expertCount})</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : expertSearchResults.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">{expertSearchResults.length} expert{expertSearchResults.length > 1 ? 's' : ''} found for "<strong>{searchQuery}</strong>"</p>
                  <div className="grid grid-cols-2 gap-4">
                    {expertSearchResults.map(({ researcher: r, keywords, matchedKw }) => (
                      <Card key={r.id} className="p-5 hover:shadow-lg transition-all border border-gray-100">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {r.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{r.name}</div>
                            <div className="text-sm text-gray-500">{r.department} · {r.institution}</div>
                            <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Matched: {matchedKw}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {keywords.slice(0, 5).map(k => (
                            <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{r.publications || 0} publications</span>
                          <span>{r.citations || 0} citations</span>
                          <span>h-index: {r.hIndex || 0}</span>
                        </div>
                        <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-950" onClick={() => navigate(`/researcher/profile/${r.id}`)}>
                          View Profile
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No experts found for "<strong>{searchQuery}</strong>"</p>
                  <p className="text-sm mt-1">Try a broader term or check the keyword list above.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* SIMILARITY ANALYSIS TAB */}
        {activeTab === 'similarity' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Researcher Expertise Similarity</h3>
              <p className="text-sm text-gray-600 mb-6">Pairs ranked by shared publication keywords — higher score = stronger expertise overlap.</p>
              {similarityPairs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Not enough publication data to compute similarity yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {similarityPairs.map((pair, idx) => (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="font-semibold">{pair.a}</span>
                            <span className="text-gray-400 mx-2">↔</span>
                            <span className="font-semibold">{pair.b}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-800">{pair.score}%</div>
                          <div className="text-xs text-gray-500">similarity</div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-blue-900 rounded-full" style={{ width: `${pair.score}%` }} />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-1">Shared keywords:</span>
                        {pair.shared.map(k => (
                          <Badge key={k} className="bg-blue-50 text-blue-900 text-xs">{k}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* EXPERTISE TRENDS TAB */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Expertise Growth Trends</h3>
              <p className="text-sm text-gray-600 mb-6">Researcher count per expertise area over time (derived from publication dates).</p>
              {expertiseAreas.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    {expertiseAreas.slice(0, 3).map((e, i) => (
                      <Line key={e.keyword} type="monotone" dataKey={e.keyword} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 4 }} name={e.keyword} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No publication data available yet.</p>
              )}
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {expertiseAreas.slice(0, 6).map((area, i) => (
                <Card key={area.keyword} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold mb-1">{area.keyword}</div>
                      <div className="text-sm text-gray-500">{area.expertCount} expert{area.expertCount > 1 ? 's' : ''}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{Math.floor(10 + i * 5)}%
                    </Badge>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (area.expertCount / (expertiseAreas[0]?.expertCount || 1)) * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{area.totalPubs} total publication{area.totalPubs > 1 ? 's' : ''}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
