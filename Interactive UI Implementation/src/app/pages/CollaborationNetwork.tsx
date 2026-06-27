import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { tabClass, CHART_COLORS } from '../components/layout';
import { usePageHeaderActions, usePageHeaderMeta } from '../context/PageHeaderContext';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { Network, Download, TrendingUp, AlertCircle } from 'lucide-react';
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

  const networkMetrics = useMemo(() => {
    const researcherList = researchers.filter(r => r.role === 'researcher');
    return researcherList.map(r => {
      const connections = coAuthorshipEdges.filter(e => e.a === r.id || e.b === r.id);
      const degree = connections.length;
      const kwCount = keywordFrequencyFromPublications(r.id, research).length;
      const centrality = researcherList.length > 1
        ? Math.round((degree / (researcherList.length - 1)) * 100)
        : 0;
      return { researcher: r, degree, totalWeight: connections.reduce((s, e) => s + e.weight, 0), kwCount, centrality };
    }).sort((a, b) => b.degree - a.degree);
  }, [researchers, coAuthorshipEdges, research]);

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

  const networkGrowthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const base = researchers.filter(r => r.role === 'researcher').length;
    return months.map((month, i) => ({
      month,
      connections: Math.max(1, coAuthorshipEdges.length + i),
      researchers: Math.max(1, base - (4 - i)),
    }));
  }, [researchers, coAuthorshipEdges]);

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
        colorIndex: i,
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

  const researcherCount = researchers.filter(r => r.role === 'researcher').length;

  usePageHeaderMeta(
    undefined,
    `${coAuthorshipEdges.length} co-authorship link${coAuthorshipEdges.length !== 1 ? 's' : ''} across ${researcherCount} researchers`,
  );

  const headerActions = useMemo(
    () => (
      <Button variant="outline" onClick={handleExport}>
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
    ),
    [networkMetrics],
  );
  usePageHeaderActions(headerActions);

  if (!user) return null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Researchers', value: researcherCount, color: 'text-brand-dark' },
          { label: 'Co-authorship Links', value: coAuthorshipEdges.length, color: 'text-success' },
          { label: 'Collaboration Requests', value: collaborationRequests.length, color: 'text-brand' },
          { label: 'Isolated Researchers', value: collaborationGaps.length, color: 'text-warning' },
        ].map(m => (
          <Card key={m.label} className="p-6">
            <div className={`text-2xl font-semibold tabular-nums sm:text-3xl ${m.color} mb-1`}>{m.value}</div>
            <div className="text-sm text-muted-foreground">{m.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {([
          { id: 'network', label: 'Network Graph', icon: Network },
          { id: 'metrics', label: 'Network Metrics', icon: TrendingUp },
          { id: 'gaps', label: 'Gap Analysis', icon: AlertCircle },
        ] as const).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={tabClass(activeTab === tab.id)}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'network' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Co-authorship Network Visualization</h3>
            <div className="bg-brand-muted/50 rounded-xl overflow-hidden border border-border">
              <svg width="100%" viewBox="0 0 600 440" className="w-full">
                {coAuthorshipEdges.map((edge, i) => {
                  const nodeA = svgNodes.find(n => n.id === edge.a);
                  const nodeB = svgNodes.find(n => n.id === edge.b);
                  if (!nodeA || !nodeB) return null;
                  return (
                    <line
                      key={i}
                      x1={nodeA.x} y1={nodeA.y}
                      x2={nodeB.x} y2={nodeB.y}
                      stroke={CHART_COLORS[0]}
                      strokeWidth={edge.weight + 1}
                      opacity={0.35}
                    />
                  );
                })}
                {svgNodes.map(node => {
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
                        fill={hasEdge ? CHART_COLORS[node.colorIndex % CHART_COLORS.length] : CHART_COLORS[3]}
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
                          fill={CHART_COLORS[2]}
                          fontSize={10}
                          fontWeight="600"
                        >
                          {node.name.split(' ').slice(-1)[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text x="300" y="420" textAnchor="middle" fill={CHART_COLORS[3]} fontSize={11}>
                  Click a node to view researcher profile · Edge thickness = collaboration strength
                </text>
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {svgNodes.map(node => (
                <div key={node.id} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[node.colorIndex % CHART_COLORS.length] }} />
                  <span className="text-muted-foreground">{node.name.split(' ').slice(-1)[0]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Network Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={networkGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="connections" stroke={CHART_COLORS[0]} strokeWidth={2} name="Connections" />
                <Line type="monotone" dataKey="researchers" stroke={CHART_COLORS[1]} strokeWidth={2} name="Researchers" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-2">Network Centrality & Influence Metrics</h3>
            <p className="text-sm text-muted-foreground mb-6">Researchers ranked by degree centrality (number of direct co-authorship connections).</p>
            <div className="space-y-4">
              {networkMetrics.map((m, idx) => (
                <div
                  key={m.researcher.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-brand/20 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/researcher/profile/${m.researcher.id}`)}
                >
                  <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {m.researcher.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{m.researcher.name}</div>
                    <div className="text-sm text-muted-foreground">{m.researcher.department}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center">
                    <div>
                      <div className="text-base font-semibold text-brand-dark">{m.degree}</div>
                      <div className="text-xs text-muted-foreground">Connections</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-success">{m.centrality}%</div>
                      <div className="text-xs text-muted-foreground">Centrality</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-brand">{m.kwCount}</div>
                      <div className="text-xs text-muted-foreground">Keywords</div>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-dark rounded-full"
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

      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-2">Collaboration Gap Analysis</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Researchers with no recorded co-authorship connections. These represent opportunities for new collaborations.
            </p>
            {collaborationGaps.length === 0 ? (
              <div className="text-center py-12">
                <Network className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-base font-semibold mb-2 text-success-foreground">No gaps detected!</h3>
                <p className="text-muted-foreground">All researchers have at least one co-authorship connection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborationGaps.map(({ researcher: r, keywords }) => (
                  <Card key={r.id} className="p-5 border-2 border-warning-muted bg-warning-muted/40">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-sm text-muted-foreground">{r.department}</div>
                      </div>
                    </div>
                    {keywords.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Expertise areas (potential collaboration topics):</p>
                        <div className="flex flex-wrap gap-1">
                          {keywords.slice(0, 4).map(k => (
                            <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="w-full bg-brand-dark hover:bg-brand-dark/90"
                      onClick={() => navigate(`/researcher/profile/${r.id}`)}
                    >
                      View Profile & Connect
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
