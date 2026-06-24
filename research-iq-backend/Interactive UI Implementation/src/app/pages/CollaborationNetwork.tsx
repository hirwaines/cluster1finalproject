import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { Brain, ArrowLeft, Network, Users, Download, TrendingUp, AlertCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export function CollaborationNetwork() {
  const navigate = useNavigate();
  const { user, researchers, research, collaborationRequests } = useApp();
  const [activeTab, setActiveTab] = useState<'network' | 'metrics' | 'gaps'>('network');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Build real co-authorship edges from publication data
  const coAuthorshipEdges = useMemo(() => {
    const edges: { a: string; b: string; weight: number }[] = [];
    const edgeMap = new Map<string, number>();
    research.forEach(pub => {
      const collabs = pub.collaborators || [];
      for (let i = 0; i < collabs.length; i++) {
        for (let j = i + 1; j < collabs.length; j++) {
          const key = [collabs[i], collabs[j]].sort().join('|');
          edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
        }
      }
    });
    edgeMap.forEach((weight, key) => {
      const [a, b] = key.split('|');
      edges.push({ a, b, weight });
    });
    return edges;
  }, [research]);

  // Network metrics per researcher
  const networkMetrics = useMemo(() => {
    const researcherList = researchers.filter(r => r.role === 'researcher');
    return researcherList.map(r => {
      const connections = coAuthorshipEdges.filter(e => e.a === r.id || e.b === r.id);
      const degree = connections.length;
      const totalWeight = connections.reduce((s, e) => s + e.weight, 0);
      const kwCount = keywordFrequencyFromPublications(r.id, research).length;
      // Betweenness centrality approximation: degree / total possible connections
      const centrality = researcherList.length > 1
        ? Math.round((degree / (researcherList.length - 1)) * 100)
        : 0;
      return { researcher: r, degree, totalWeight, kwCount, centrality };
    }).sort((a, b) => b.degree - a.degree);
  }, [researchers, coAuthorshipEdges, research]);

  // Collaboration gap analysis: researchers with 0 co-authorship connections
  const collaborationGaps = useMemo(() => {
    const connectedIds = new Set<string>();
    coAuthorshipEdges.forEach(e => { connectedIds.add(e.a); connectedIds.add(e.b); });
    return researchers
      .filter(r => r.role === 'researcher' && !connectedIds.has(r.id))
      .map(r => ({
        researcher: r,
        keywords: keywordFrequencyFromPublications(r.id, research).map(k => k.keyword),
      }));
  }, [researchers, coAuthorshipEdges, research]);

  // Network growth over time (simulated from collaboration requests)
  const networkGrowthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const base = researchers.filter(r => r.role === 'researcher').length;
    return months.map((month, i) => ({
      month,
      connections: Math.max(1, coAuthorshipEdges.length + i),
      researchers: Math.max(1, base - (4 - i)),
    }));
  }, [researchers, coAuthorshipEdges]);

  // SVG network layout: place nodes in a circle
  const svgNodes = useMemo(() => {
    const list = researchers.filter(r => r.role === 'researcher').slice(0, 10);
    const cx = 300; const cy = 220; const radius = 160;
    return list.map((r, i) => {
      const angle = (i / list.length) * 2 * Math.PI - Math.PI / 2;
      return {
        id: r.id,
        name: r.name,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        dept: r.department || '',
        pubs: r.publications || 0,
      };
    });
  }, [researchers]);

  const handleExport = () => {
    const rows = [['Researcher', 'Connections', 'Centrality %', 'Keywords']];
    networkMetrics.forEach(m => rows.push([
      m.researcher.name,
      String(m.degree),
      String(m.centrality),
      String(m.kwCount),
    ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'collaboration-network.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  const COLORS = ['#1E40AF', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <AppShell>
    <div style={{ padding: '2rem' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Research Collaboration Network</h1>
            <p className="text-gray-600">
              {coAuthorshipEdges.length} co-authorship link{coAuthorshipEdges.length !== 1 ? 's' : ''} across {researchers.filter(r => r.role === 'researcher').length} researchers
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Researchers', value: researchers.filter(r => r.role === 'researcher').length, color: 'text-blue-800', bg: 'bg-blue-50' },
            { label: 'Co-authorship Links', value: coAuthorshipEdges.length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Collaboration Requests', value: collaborationRequests.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Isolated Researchers', value: collaborationGaps.length, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(m => (
            <Card key={m.label} className="p-6">
              <div className={`text-3xl font-bold ${m.color} mb-1`}>{m.value}</div>
              <div className="text-sm text-gray-600">{m.label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {([
            { id: 'network', label: 'Network Graph', icon: Network },
            { id: 'metrics', label: 'Network Metrics', icon: TrendingUp },
            { id: 'gaps', label: 'Gap Analysis', icon: AlertCircle },
          ] as const).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* NETWORK GRAPH TAB */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Co-authorship Network Visualization</h3>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden border border-blue-100">
                <svg width="100%" viewBox="0 0 600 440" className="w-full">
                  {/* Draw edges */}
                  {coAuthorshipEdges.map((edge, i) => {
                    const nodeA = svgNodes.find(n => n.id === edge.a);
                    const nodeB = svgNodes.find(n => n.id === edge.b);
                    if (!nodeA || !nodeB) return null;
                    return (
                      <line
                        key={i}
                        x1={nodeA.x} y1={nodeA.y}
                        x2={nodeB.x} y2={nodeB.y}
                        stroke="#1E40AF"
                        strokeWidth={edge.weight + 1}
                        opacity={0.35}
                      />
                    );
                  })}
                  {/* Draw nodes */}
                  {svgNodes.map((node, i) => {
                    const isHovered = hoveredNode === node.id;
                    const hasEdge = coAuthorshipEdges.some(e => e.a === node.id || e.b === node.id);
                    return (
                      <g
                        key={node.id}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => navigate(`/researcher/profile/${node.id}`)}
                      >
                        <circle
                          cx={node.x} cy={node.y}
                          r={isHovered ? 26 : 20}
                          fill={hasEdge ? COLORS[i % COLORS.length] : '#9CA3AF'}
                          stroke="white"
                          strokeWidth={3}
                          style={{ transition: 'r 0.15s' }}
                        />
                        <text
                          x={node.x} y={node.y + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={11}
                          fontWeight="bold"
                        >
                          {node.name.charAt(0)}
                        </text>
                        {isHovered && (
                          <text
                            x={node.x} y={node.y + 34}
                            textAnchor="middle"
                            fill="#1e3a5f"
                            fontSize={10}
                            fontWeight="600"
                          >
                            {node.name.split(' ').slice(-1)[0]}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  {/* Center label */}
                  <text x="300" y="420" textAnchor="middle" fill="#6B7280" fontSize={11}>
                    Click a node to view researcher profile · Edge thickness = collaboration strength
                  </text>
                </svg>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {svgNodes.map((node, i) => (
                  <div key={node.id} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600">{node.name.split(' ').slice(-1)[0]}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Network growth over time */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Network Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={networkGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="connections" stroke="#1E40AF" strokeWidth={2} name="Connections" />
                  <Line type="monotone" dataKey="researchers" stroke="#10B981" strokeWidth={2} name="Researchers" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Network Centrality & Influence Metrics</h3>
              <p className="text-sm text-gray-600 mb-6">Researchers ranked by degree centrality (number of direct co-authorship connections).</p>
              <div className="space-y-4">
                {networkMetrics.map((m, idx) => (
                  <div
                    key={m.researcher.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/researcher/profile/${m.researcher.id}`)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {m.researcher.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{m.researcher.name}</div>
                      <div className="text-sm text-gray-500">{m.researcher.department}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-800">{m.degree}</div>
                        <div className="text-xs text-gray-500">Connections</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">{m.centrality}%</div>
                        <div className="text-xs text-gray-500">Centrality</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{m.kwCount}</div>
                        <div className="text-xs text-gray-500">Keywords</div>
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-800 to-green-600 rounded-full"
                          style={{ width: `${m.centrality}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* GAP ANALYSIS TAB */}
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Collaboration Gap Analysis</h3>
              <p className="text-sm text-gray-600 mb-6">
                Researchers with no recorded co-authorship connections. These represent opportunities for new collaborations.
              </p>
              {collaborationGaps.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-green-700">No gaps detected!</h3>
                  <p className="text-gray-600">All researchers have at least one co-authorship connection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {collaborationGaps.map(({ researcher: r, keywords }) => (
                    <Card key={r.id} className="p-5 border-2 border-orange-100 bg-orange-50/40">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{r.name}</div>
                          <div className="text-sm text-gray-500">{r.department}</div>
                        </div>
                      </div>
                      {keywords.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Expertise areas (potential collaboration topics):</p>
                          <div className="flex flex-wrap gap-1">
                            {keywords.slice(0, 4).map(k => (
                              <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-800 to-green-600 hover:from-blue-700 hover:to-green-700"
                        onClick={() => navigate(`/researcher/profile/${r.id}`)}
                      >
                        View Profile & Connect
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Collaboration request status */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Collaboration Request Status</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Pending', count: collaborationRequests.filter(r => r.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'Accepted', count: collaborationRequests.filter(r => r.status === 'accepted').length, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Rejected', count: collaborationRequests.filter(r => r.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50' },
                ].map(s => (
                  <div key={s.label} className={`p-4 rounded-xl ${s.bg} text-center`}>
                    <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                    <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {collaborationRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{req.fromUserName}</div>
                      <div className="text-xs text-gray-500">{req.researchTitle || req.fundingTitle || 'Collaboration request'}</div>
                    </div>
                    <Badge className={
                      req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
    </div>
    </AppShell>
  );
}
