import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw } from 'lucide-react';

export default function OutboxModal({ isOpen, onClose }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeEmail, setActiveEmail] = useState(null);

  const fetchOutbox = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/outbox');
      const data = await res.json();
      if (data.success) {
        setEmails(data.outbox || []);
        if (data.outbox.length > 0 && !activeEmail) setActiveEmail(data.outbox[0]);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (isOpen) fetchOutbox(); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[75vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sent Emails ({emails.length})</h3>
              <p className="text-xs text-gray-500">All login alerts, parking confirmations, and guest passes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOutbox} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium">
              Close ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-3 overflow-hidden">
          {/* Email List */}
          <div className="col-span-1 border-r border-gray-200 overflow-y-auto">
            {emails.length === 0 ? (
              <p className="p-4 text-center text-gray-400 text-sm">No emails sent yet.</p>
            ) : (
              emails.map(mail => (
                <div key={mail.id} onClick={() => setActiveEmail(mail)}
                  className={`p-3.5 border-b border-gray-100 cursor-pointer transition ${
                    activeEmail && activeEmail.id === mail.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                  }`}>
                  <p className="text-xs text-gray-400 truncate">{mail.to}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{mail.subject}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{mail.type}</span>
                    <span className="text-[10px] text-gray-400">{new Date(mail.sentAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Email Preview */}
          <div className="col-span-2 overflow-y-auto p-5">
            {activeEmail ? (
              <div className="space-y-3">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-bold text-gray-900">{activeEmail.subject}</h4>
                  <p className="text-sm text-gray-500">To: {activeEmail.to}</p>
                  <p className="text-xs text-gray-400">Sent: {new Date(activeEmail.sentAt).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm" dangerouslySetInnerHTML={{ __html: activeEmail.html }} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Select an email to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
