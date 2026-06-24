import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Card } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const trendYears = [
  { year: '2022', pubs: 4, cites: 112 },
  { year: '2023', pubs: 6, cites: 178 },
  { year: '2024', pubs: 8, cites: 265 },
  { year: '2025', pubs: 9, cites: 302 },
  { year: '2026', pubs: 11, cites: 341 },
];

export function ResearcherAnalyticsPage() {
  const navigate = useNavigate();
  const { user, research, researchers } = useApp();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const myPubs = useMemo(() => research.filter(r => r.researcherId === user?.id), [research, user?.id]);

  const topJournals = useMemo(
    () => [
      { journal: 'Nature Climate Change', count: 3 },
      { journal: 'IEEE TPAMI', count: 2 },
      { journal: 'J. Research Administration', count: 2 },
      { journal: 'ACM Computing Surveys', count: 1 },
    ],
    []
  );

  const topCollabs = useMemo(() => {
    if (!user) return [];
    const coauth = new Map<string, number>();
    myPubs.forEach(p => {
      p.authors.forEach(a => {
        if (!a.includes(user.name.split(' ').pop() || '')) {
          coauth.set(a, (coauth.get(a) || 0) + 1);
        }
      });
    });
    return [...coauth.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));
  }, [myPubs, user]);

  const deptAvg = useMemo(() => {
    if (!user?.department) return { pubs: 7, cites: 210, score: 78 };
    const peers = researchers.filter(r => r.role === 'researcher' && r.department === user.department);
    const n = peers.length || 1;
    const pubs = peers.reduce((s, r) => s + (r.publications || 0), 0) / n;
    const cites = peers.reduce((s, r) => s + (r.citations || 0), 0) / n;
    const score = peers.reduce((s, r) => s + (r.researchScore || 75), 0) / n;
    return { pubs: Math.round(pubs), cites: Math.round(cites), score: Math.round(score) };
  }, [researchers, user]);

  if (!user) return null;

  const kwFreq = keywordFrequencyFromPublications(user.id, research);

  return (
    <ResearcherLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Your research output, citation trends, and departmental benchmarks.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Publications', value: user.publications ?? myPubs.length },
            { label: 'Citations', value: user.citations ?? myPubs.reduce((s, p) => s + p.citations, 0) },
            { label: 'h-index', value: user.hIndex ?? '—' },
            { label: 'Research score', value: user.researchScore ?? '—' },
          ].map(card => (
            <Card key={card.label} className="p-5 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="text-3xl font-bold text-blue-900 mt-1">{card.value}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-4">Publication & citation trends</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendYears}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pubs" stroke="#1e3a8a" name="Publications" strokeWidth={2} />
                  <Line type="monotone" dataKey="cites" stroke="#64748b" name="Citations" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-4">Top journals</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topJournals} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="journal" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-3">Top collaborators</h2>
            <ul className="space-y-2 text-sm">
              {topCollabs.length ? (
                topCollabs.map(c => (
                  <li key={c.name} className="flex justify-between border-b border-gray-100 pb-2">
                    <span>{c.name}</span>
                    <span className="text-gray-500">{c.count} shared papers</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Co-authorship network builds as you add publications.</li>
              )}
            </ul>
          </Card>

          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-3">Benchmark vs department average</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-2">Metric</th>
                  <th className="pb-2">You</th>
                  <th className="pb-2">Dept avg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2">Publications</td>
                  <td className="font-medium">{user.publications ?? myPubs.length}</td>
                  <td>{deptAvg.pubs}</td>
                </tr>
                <tr>
                  <td className="py-2">Citations</td>
                  <td className="font-medium">{user.citations ?? '—'}</td>
                  <td>{deptAvg.cites}</td>
                </tr>
                <tr>
                  <td className="py-2">Research score</td>
                  <td className="font-medium">{user.researchScore ?? '—'}</td>
                  <td>{deptAvg.score}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">Department: {user.department || '—'}</p>
          </Card>
        </div>

        <Card className="p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-2">Extracted keyword frequency (from your publications)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Counts reflect how many of your indexed publications mention each keyword.
          </p>
          <div className="flex flex-wrap gap-2">
            {kwFreq.slice(0, 12).map(k => (
              <span key={k.keyword} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-gray-800">
                {k.keyword}{' '}
                <span className="text-gray-500">({k.publicationCount} publication{k.publicationCount > 1 ? 's' : ''})</span>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </ResearcherLayout>
  );
}
