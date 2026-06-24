import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import { Search, Send, Paperclip, Smile, Phone, Video, Info, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BLUE  = '#1E40AF';
const GREEN = '#047857';

const EMOJIS = ['👍', '🙂', '✅', '🎯', '📎', '🙏', '👏', '🔥'];

export function MessagesPage() {
  const navigate  = useNavigate();
  const { user, researchers, chatMessages, sendChatMessage, markConversationRead } = useApp();

  const [search,       setSearch]       = useState('');
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [draft,        setDraft]        = useState('');
  const [showEmoji,    setShowEmoji]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  if (!user) { navigate('/login'); return null; }

  const peers = useMemo(() => {
    const ids = new Set<string>();
    chatMessages.forEach(m => {
      if (m.senderId === user.id) ids.add(m.receiverId);
      if (m.receiverId === user.id) ids.add(m.senderId);
    });
    researchers.forEach(r => { if (r.id !== user.id) ids.add(r.id); });
    return [...ids]
      .map(id => researchers.find(r => r.id === id))
      .filter(Boolean) as typeof researchers;
  }, [chatMessages, researchers, user]);

  const filteredPeers = peers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.department ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const conversation = useMemo(() => {
    if (!selectedPeer) return [];
    return chatMessages
      .filter(m =>
        (m.senderId === user.id && m.receiverId === selectedPeer) ||
        (m.receiverId === user.id && m.senderId === selectedPeer)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [chatMessages, selectedPeer, user.id]);

  const unreadFor = (peerId: string) =>
    chatMessages.filter(m => m.senderId === peerId && m.receiverId === user.id && !m.read).length;

  const lastMessage = (peerId: string) => {
    const msgs = chatMessages.filter(m =>
      (m.senderId === user.id && m.receiverId === peerId) ||
      (m.receiverId === user.id && m.senderId === peerId)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return msgs[0] ?? null;
  };

  const handleSelectPeer = (id: string) => {
    setSelectedPeer(id);
    markConversationRead(id);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedPeer) return;
    sendChatMessage(selectedPeer, draft.trim());
    setDraft('');
    setShowEmoji(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const peerUser = selectedPeer ? researchers.find(r => r.id === selectedPeer) : null;

  return (
    <AppShell>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* ── Peer List ───────────────────────────────────────────────── */}
        <Box
          sx={{
            width: 300, flexShrink: 0,
            borderRight: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', mb: 1.5 }}>Messages</Typography>
            <TextField
              size="small"
              placeholder="Search conversations…"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Search size={15} color="#94A3B8" /></InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#F8FAFC' } }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {filteredPeers.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <MessageSquare size={32} color="#CBD5E1" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No conversations yet</Typography>
              </Box>
            ) : filteredPeers.map(p => {
              const last    = lastMessage(p.id);
              const unread  = unreadFor(p.id);
              const isActive = p.id === selectedPeer;

              return (
                <Box
                  key={p.id}
                  onClick={() => handleSelectPeer(p.id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 2, py: 1.5, cursor: 'pointer',
                    bgcolor: isActive ? '#EFF6FF' : 'transparent',
                    borderLeft: isActive ? `3px solid ${BLUE}` : '3px solid transparent',
                    '&:hover': { bgcolor: isActive ? '#EFF6FF' : '#F8FAFC' },
                    transition: 'all 0.1s',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: BLUE, fontWeight: 700, fontSize: '0.9375rem' }}>
                      {p.name.charAt(0)}
                    </Avatar>
                    {unread > 0 && (
                      <Box sx={{
                        position: 'absolute', top: -2, right: -2,
                        width: 16, height: 16, borderRadius: '50%',
                        bgcolor: '#DC2626', border: '2px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ fontSize: '0.5rem', color: '#fff', fontWeight: 700 }}>{unread}</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={unread > 0 ? 700 : 500} sx={{ color: '#0F172A' }} noWrap>
                        {p.name}
                      </Typography>
                      {last && (
                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 0.5, fontSize: '0.6875rem' }}>
                          {new Date(last.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.6875rem' }}>
                      {last ? last.content : `${p.department ?? 'Researcher'}`}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ── Chat Window ─────────────────────────────────────────────── */}
        {selectedPeer && peerUser ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', minWidth: 0 }}>

            {/* Chat header */}
            <Box sx={{
              px: 3, py: 1.75,
              bgcolor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 38, height: 38, bgcolor: BLUE, fontWeight: 700 }}>
                  {peerUser.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>{peerUser.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {peerUser.department} · {peerUser.institution}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Call (demo)">
                  <IconButton size="small" onClick={() => toast.info('Voice call — coming soon')}>
                    <Phone size={17} color="#64748B" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Video (demo)">
                  <IconButton size="small" onClick={() => toast.info('Video call — coming soon')}>
                    <Video size={17} color="#64748B" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View profile">
                  <IconButton size="small" onClick={() => navigate(`/researcher/profile/${peerUser.id}`)}>
                    <Info size={17} color="#64748B" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {conversation.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <MessageSquare size={48} color="#CBD5E1" />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No messages yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Start the conversation!
                  </Typography>
                </Box>
              ) : (
                conversation.map(msg => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <Box
                      key={msg.id}
                      sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}
                    >
                      {!isMe && (
                        <Avatar sx={{ width: 28, height: 28, bgcolor: BLUE, fontSize: '0.75rem', fontWeight: 700, mr: 1, alignSelf: 'flex-end', mb: 0.25 }}>
                          {peerUser.name.charAt(0)}
                        </Avatar>
                      )}
                      <Box sx={{ maxWidth: '68%' }}>
                        <Box
                          sx={{
                            px: 2, py: 1.25,
                            bgcolor: isMe ? BLUE : '#FFFFFF',
                            color: isMe ? '#FFFFFF' : '#0F172A',
                            borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.55 }}>{msg.content}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block', textAlign: isMe ? 'right' : 'left', fontSize: '0.625rem' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <span style={{ marginLeft: 4 }}>✓</span>}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={bottomRef} />
            </Box>

            {/* Emoji picker (simple) */}
            {showEmoji && (
              <Box sx={{
                px: 3, pb: 1,
                display: 'flex', gap: 1, flexWrap: 'wrap',
                bgcolor: '#FFFFFF', borderTop: '1px solid #F1F5F9',
              }}>
                {EMOJIS.map(e => (
                  <Button
                    key={e}
                    size="small"
                    onClick={() => setDraft(d => d + e)}
                    sx={{ minWidth: 0, p: 0.5, fontSize: '1.25rem' }}
                  >
                    {e}
                  </Button>
                ))}
              </Box>
            )}

            {/* Input bar */}
            <Box sx={{
              px: 3, py: 2,
              bgcolor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'flex-end', gap: 1.25,
            }}>
              <Tooltip title="Emoji">
                <IconButton size="small" onClick={() => setShowEmoji(v => !v)} sx={{ color: showEmoji ? BLUE : '#94A3B8' }}>
                  <Smile size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Attach file (demo)">
                <IconButton size="small" onClick={() => toast.info('File attachments — coming soon')} sx={{ color: '#94A3B8' }}>
                  <Paperclip size={20} />
                </IconButton>
              </Tooltip>
              <TextField
                multiline
                maxRows={4}
                size="small"
                placeholder={`Message ${peerUser.name}…`}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKey}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: '#F8FAFC',
                    '&:focus-within': { bgcolor: '#FFF', borderColor: BLUE },
                  },
                }}
              />
              <Tooltip title="Send (Enter)">
                <span>
                  <IconButton
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    sx={{
                      bgcolor: BLUE, color: '#FFF',
                      width: 40, height: 40,
                      '&:hover': { bgcolor: '#1E3A8A' },
                      '&:disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
                    }}
                  >
                    <Send size={18} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, bgcolor: '#F8FAFC' }}>
            <MessageSquare size={56} color="#CBD5E1" />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>Select a conversation</Typography>
            <Typography variant="body2" color="text.secondary">Choose someone from the list to start messaging</Typography>
          </Box>
        )}
      </Box>
    </AppShell>
  );
}
