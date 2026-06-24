import { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import { MessageCircle, Paperclip, Search, Smile } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

const EMOJIS = ['👍', '👏', '🙂', '🙏', '✅', '📎', '🎯'];

export function ChatPanel() {
  const {
    user,
    researchers,
    chatMessages,
    sendChatMessage,
    markConversationRead,
    chatDrawerOpen,
    setChatDrawerOpen,
    chatPeerId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [typingPreview, setTypingPreview] = useState(false);

  const messagingPeers = useMemo(() => {
    if (!user) return [];
    const ids = new Set<string>();
    chatMessages.forEach(m => {
      if (m.senderId === user.id) ids.add(m.receiverId);
      if (m.receiverId === user.id) ids.add(m.senderId);
    });
    researchers.forEach(r => {
      if (r.id !== user.id) ids.add(r.id);
    });
    return [...ids]
      .map(id => researchers.find(r => r.id === id))
      .filter(Boolean) as typeof researchers;
  }, [chatMessages, researchers, user]);

  useEffect(() => {
    if (chatDrawerOpen && chatPeerId) {
      setSelectedPeerId(chatPeerId);
      markConversationRead(chatPeerId);
    }
  }, [chatDrawerOpen, chatPeerId, markConversationRead]);

  useEffect(() => {
    if (!typingPreview) return;
    const t = window.setTimeout(() => setTypingPreview(false), 1600);
    return () => window.clearTimeout(t);
  }, [typingPreview]);

  if (!user) return null;

  const unreadFor = (peerId: string) =>
    chatMessages.filter(m => m.senderId === peerId && m.receiverId === user.id && !m.read).length;

  const filteredPeers = messagingPeers.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const threadPeer = selectedPeerId
    ? researchers.find(r => r.id === selectedPeerId)
    : null;

  const threadMessages = threadPeer
    ? chatMessages
        .filter(
          m =>
            (m.senderId === user.id && m.receiverId === threadPeer.id) ||
            (m.senderId === threadPeer.id && m.receiverId === user.id)
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const handleSend = (content: string) => {
    if (!threadPeer || !content.trim()) return;
    sendChatMessage(threadPeer.id, content.trim());
    setDraft('');
    setTypingPreview(true);
  };

  const handleAttach = () => {
    if (!threadPeer) return;
    sendChatMessage(threadPeer.id, '(Attachment)', 'sample-proposal.pdf');
  };

  return (
    <Sheet open={chatDrawerOpen} onOpenChange={setChatDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col bg-white border-l border-gray-200"
      >
        <SheetHeader className="px-4 py-3 border-b border-gray-100 shrink-0">
          <SheetTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#1E40AF]" />
            Messages
          </SheetTitle>
          <p className="text-sm text-gray-500 font-normal">
            Institutional messaging (demo — persisted in session mock store).
          </p>
        </SheetHeader>

        <div className="flex flex-1 min-h-0">
          <div className="w-[280px] border-r border-gray-100 flex flex-col bg-gray-50/80">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations"
                  className="pl-8 h-9 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPeers.map(peer => {
                const unread = unreadFor(peer.id);
                const online = peer.id.charCodeAt(peer.id.length - 1) % 2 === 0;
                return (
                  <button
                    key={peer.id}
                    type="button"
                    onClick={() => {
                      setSelectedPeerId(peer.id);
                      markConversationRead(peer.id);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white transition-colors ${
                      selectedPeerId === peer.id ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-9 h-9 bg-[#1E40AF]/15 text-[#1E40AF] font-semibold">
                        {peer.name.charAt(0)}
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          online ? 'bg-[#047857]' : 'bg-gray-300'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{peer.name}</span>
                        {unread > 0 && (
                          <Badge className="bg-[#1E40AF] text-white text-[10px] px-1.5 py-0 h-5">
                            {unread}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{peer.department}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {threadPeer ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-[#1E40AF]/15 text-[#1E40AF] font-semibold">
                    {threadPeer.name.charAt(0)}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{threadPeer.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#047857]" />
                      Typically replies within 24h (mock status)
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {threadMessages.map(m => {
                    const mine = m.senderId === user.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                            mine ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div>{m.content}</div>
                          {m.attachmentName && (
                            <div
                              className={`mt-1 text-xs flex items-center gap-1 ${
                                mine ? 'text-blue-100' : 'text-blue-700'
                              }`}
                            >
                              <Paperclip className="w-3 h-3" />
                              {m.attachmentName}
                            </div>
                          )}
                          <div
                            className={`text-[10px] mt-1 opacity-80 ${
                              mine ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(m.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {typingPreview && (
                    <div className="text-xs text-gray-500 italic px-1">
                      {threadPeer.name.split(' ')[0]} is typing…
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="icon" className="shrink-0">
                          <Smile className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2 flex gap-1 flex-wrap" align="start">
                        {EMOJIS.map(e => (
                          <button
                            key={e}
                            type="button"
                            className="text-xl hover:bg-gray-100 rounded p-1"
                            onClick={() => handleSend(e)}
                          >
                            {e}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={handleAttach}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Write a message…"
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(draft);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      className="bg-[#1E40AF] hover:bg-blue-900 shrink-0"
                      onClick={() => handleSend(draft)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-6 text-center gap-2">
                <MessageCircle className="w-12 h-12 text-gray-300" />
                <p className="font-medium text-gray-700">Select a conversation</p>
                <p className="text-sm">Choose a colleague from the list or open chat from Collaborators.</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ChatHeaderButton({ unreadTotal }: { unreadTotal: number }) {
  const { setChatDrawerOpen } = useApp();
  return (
    <button
      type="button"
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      aria-label="Open messages"
      onClick={() => setChatDrawerOpen(true)}
    >
      <MessageCircle className="w-5 h-5" />
      {unreadTotal > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1E40AF] text-white text-[10px] font-semibold flex items-center justify-center">
          {unreadTotal > 9 ? '9+' : unreadTotal}
        </span>
      )}
    </button>
  );
}
