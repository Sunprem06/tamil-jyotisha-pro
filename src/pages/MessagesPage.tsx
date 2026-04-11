import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, User } from "lucide-react";

interface Conversation {
  userId: string;
  displayName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchConversations();

    // Realtime subscription
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (activeChat && (msg.sender_id === activeChat || msg.receiver_id === activeChat)) {
            setMessages((prev) => [...prev, msg]);
          }
          fetchConversations();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  async function fetchConversations() {
    if (!user) return;
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) return;

    const convMap = new Map<string, Conversation>();
    for (const m of msgs) {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          userId: otherId,
          displayName: otherId.slice(0, 8) + "...",
          lastMessage: m.content,
          lastAt: m.created_at,
          unread: 0,
        });
      }
      if (m.receiver_id === user.id && !m.is_read) {
        const conv = convMap.get(otherId)!;
        conv.unread++;
      }
    }

    // Fetch display names
    const userIds = [...convMap.keys()];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);
      profiles?.forEach((p) => {
        const conv = convMap.get(p.user_id);
        if (conv && p.display_name) conv.displayName = p.display_name;
      });
    }

    setConversations([...convMap.values()].sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()));
  }

  async function openChat(userId: string) {
    if (!user) return;
    setActiveChat(userId);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(data ?? []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", userId)
      .eq("receiver_id", user.id)
      .eq("is_read", false);

    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeChat || !newMsg.trim()) return;
    setSending(true);

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: activeChat,
      content: newMsg.trim(),
    });

    setNewMsg("");
    setSending(false);
  }

  const activeName = conversations.find((c) => c.userId === activeChat)?.displayName ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold font-tamil mb-4">செய்திகள் (Messages)</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Conversation List */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Conversations</CardTitle></CardHeader>
            <ScrollArea className="h-[520px]">
              <CardContent className="p-2 space-y-1">
                {conversations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">No conversations yet</p>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.userId}
                      onClick={() => openChat(c.userId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeChat === c.userId ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{c.displayName}</p>
                          {c.unread > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">{c.unread}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            {activeChat ? (
              <>
                <CardHeader className="pb-2 border-b border-border">
                  <CardTitle className="text-base">{activeName}</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          m.sender_id === user?.id
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}>
                          <p>{m.content}</p>
                          <p className={`text-[10px] mt-1 ${m.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(m.created_at).toLocaleTimeString("ta-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
                  <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1" />
                  <Button type="submit" size="icon" disabled={sending || !newMsg.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
