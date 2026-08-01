import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, X, Sparkles, Image, Check } from 'lucide-react';

export const SupportChat: React.FC = () => {
  const { createTicket, addReplyToTicket, tickets, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Form values
  const [name, setName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [userReplyText, setUserReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync user info if auth changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Find active ticket details
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // Scroll to bottom of chat conversation
  useEffect(() => {
    if (activeTicket) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicket?.conversation]);

  // Handle support ticket creation
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    try {
      const ticket = await createTicket({
        name,
        email,
        subject,
        message,
        screenshot: screenshot || undefined
      });

      setActiveTicketId(ticket.id);
      setSuccessMsg(true);
      setSubject('');
      setMessage('');
      setScreenshot(null);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Convert uploaded image to Data URL for mock Cloudinary store
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // User reply in active ticket inbox
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !userReplyText.trim()) return;

    addReplyToTicket(
      activeTicketId,
      userReplyText.trim(),
      'user',
      currentUser?.fullName || name
    );
    setUserReplyText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button with Neumorphic Pulse */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center cursor-pointer animate-bounce"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping -z-10" />
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-sm font-semibold whitespace-nowrap ml-0 group-hover:ml-2">
            Contact Support
          </span>
        </button>
      )}

      {/* Floating Modern Popup Panel (Glassmorphic) */}
      {isOpen && (
        <div className="w-[360px] md:w-[400px] h-[520px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

          {/* Support Widget Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold tracking-wide">Nexela Saver Live Support</h3>
                <p className="text-[10px] text-blue-100 font-medium">Real-time SaaS Helper Inbox</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {activeTicketId && (
                <button
                  onClick={() => setActiveTicketId(null)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white font-medium transition"
                >
                  New Ticket
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat inbox / Form Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Active Ticket Mode */}
            {activeTicketId && activeTicket ? (
              <div className="flex flex-col h-full">

                {/* Active Ticket Status Indicator */}
                <div className="bg-blue-50/70 border border-blue-100 p-2 rounded-xl mb-3 flex items-center justify-between">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Ticket: {activeTicket.subject}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTicket.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                    activeTicket.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                    activeTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {activeTicket.status}
                  </span>
                </div>

                {/* Live Message Thread */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 text-sm">
                  {activeTicket.conversation.map((conv) => {
                    const isAdmin = conv.sender === 'admin';
                    return (
                      <div key={conv.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          isAdmin
                            ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 rounded-tl-none'
                            : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        }`}>
                          <p className="text-[9px] font-bold opacity-75 mb-1">{conv.senderName}</p>
                          <p className="text-xs leading-relaxed">{conv.message}</p>
                          <span className="text-[8px] opacity-60 block mt-1 text-right">
                            {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="flex items-center space-x-2 border-t border-slate-100 pt-3 mt-auto">
                  <input
                    type="text"
                    value={userReplyText}
                    onChange={(e) => setUserReplyText(e.target.value)}
                    placeholder="Type reply message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (

              // New Support Ticket Creation Form
              <div className="space-y-4">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-xs text-blue-700 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p>Our Super Admin will reply instantly in this secure floating live dashboard inbox.</p>
                </div>

                {successMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-semibold flex items-center space-x-2 animate-bounce">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Your Support Ticket was successfully registered!</span>
                  </div>
                )}

                <form onSubmit={handleSubmitTicket} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@savingsgroup.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Message</label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the issue, bug, or request..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Screenshot upload (Mocking Cloudinary upload) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attach Screenshot (Optional)</label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                      >
                        <Image className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload to Cloudinary</span>
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      {screenshot && (
                        <div className="relative">
                          <img src={screenshot} alt="Preview" className="w-8 h-8 rounded border object-cover" />
                          <button
                            type="button"
                            onClick={() => setScreenshot(null)}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 text-[8px]"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Quick FAQ footer inside widget */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 text-center text-[10px] text-slate-400 font-medium">
            Powered by Nexela Saver SaaS Engine • Secure End-to-End Encryption
          </div>
        </div>
      )}
    </div>
  );
};
