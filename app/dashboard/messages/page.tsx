'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { 
  Search, 
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useMessageContacts, useMessages, useSendMessage, useUnreadMessageCount } from '@/lib/queries';
import { formatRelativeTime, getInitials } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  
  const { data: contactsData, isLoading: contactsLoading } = useMessageContacts();
  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedContact?.user?.id || '');
  const sendMessage = useSendMessage();

  const contacts = contactsData?.data || [];
  const messages = messagesData?.data || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedContact) return;
    
    try {
      await sendMessage.mutateAsync({
        receiverId: selectedContact.user.id,
        content: message,
      });
      setMessage('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send', variant: 'destructive' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredContacts = contacts.filter((contact: any) =>
    contact.user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    contact.user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
        {/* Contacts List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {contactsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {search ? 'No contacts found' : 'No messages yet'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredContacts.map((contact: any) => (
                  <button
                    key={contact.user.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedContact?.user.id === contact.user.id
                        ? 'bg-purple-100'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-<AvatarImage src={10">
                        contact.user.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(contact.user.firstName, contact.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.unreadCount > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center"
                          variant="destructive"
                        >
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {contact.user.firstName} {contact.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.lastMessage?.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(contact.lastMessage?.createdAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedContact.user.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(selectedContact.user.firstName, selectedContact.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedContact.user.firstName} {selectedContact.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedContact.user.role === 'BRAND' ? 'Brand' : 'Influencer'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet, start a conversation!
                  </div>
                ) : (
                  messages.map((msg: any, index: number) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                          {!isOwn && (
                            <Avatar className="w-8 h-8 mb-1">
                              <AvatarFallback>
                                {getInitials(
                                  msg.sender?.firstName,
                                  msg.sender?.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSend}
                    disabled={!message.trim() || sendMessage.isPending}
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
