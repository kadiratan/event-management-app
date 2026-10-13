import React, { useState, useEffect } from 'react';

const cityOptions = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Adana', 'Eskişehir', 'Gaziantep', 'Kocaeli', 'Diyarbakır', 'Konya', 'Mersin', 'Samsun', 'Bodrum', 'Çanakkale', 'Denizli', 'Erzurum', 'Sakarya', 'Online'];
const platformOptions = ['Hibrit', 'Yüz Yüze', 'Online'];
const networkSeeds = [
  { id: 1, x: 10, y: 18, size: 4 },
  { id: 2, x: 20, y: 30, size: 5 },
  { id: 3, x: 32, y: 16, size: 4 },
  { id: 4, x: 45, y: 28, size: 5 },
  { id: 5, x: 58, y: 18, size: 4 },
  { id: 6, x: 72, y: 24, size: 5 },
  { id: 7, x: 83, y: 18, size: 4 },
  { id: 8, x: 16, y: 52, size: 5 },
  { id: 9, x: 30, y: 64, size: 4 },
  { id: 10, x: 42, y: 58, size: 5 },
  { id: 11, x: 57, y: 62, size: 4 },
  { id: 12, x: 68, y: 54, size: 5 },
  { id: 13, x: 80, y: 66, size: 4 },
  { id: 14, x: 90, y: 52, size: 5 },
  { id: 15, x: 24, y: 82, size: 4 },
  { id: 16, x: 46, y: 84, size: 5 },
  { id: 17, x: 62, y: 82, size: 4 },
  { id: 18, x: 82, y: 86, size: 5 }
];

export default function App() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('enterprise_events');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Global AI & Tech Summit 2026', date: '2026-11-15', location: 'İstanbul', platform: 'Hibrit', capacity: 350 },
      { id: 2, title: 'React Architecture Masterclass', date: '2026-12-01', location: 'Online', platform: 'Online', capacity: 500 }
    ];
  });

  const [attendees, setAttendees] = useState(() => {
    const saved = localStorage.getItem('enterprise_attendees');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Kadir Atan', email: 'kadir@atan.com', eventId: 1, ticketType: 'VIP' },
      { id: 2, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', eventId: 2, ticketType: 'Standard' }
    ];
  });

  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', platform: 'Hibrit', capacity: '' });
  const [attendeeForm, setAttendeeForm] = useState({ name: '', email: '', eventId: '', ticketType: 'Standard' });

  const [editingEventId, setEditingEventId] = useState(null);
  const [editingAttendeeId, setEditingAttendeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    localStorage.setItem('enterprise_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('enterprise_attendees', JSON.stringify(attendees));
  }, [attendees]);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = setTimeout(() => setFlashMessage(''), 2600);
    return () => clearTimeout(timer);
  }, [flashMessage]);

  const showToast = (message) => setFlashMessage(message);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.location) return;

    if (editingEventId) {
      setEvents(events.map(ev => ev.id === editingEventId ? { ...ev, ...eventForm, platform: eventForm.platform || 'Hibrit' } : ev));
      setEditingEventId(null);
      showToast('Etkinlik güncellendi');
    } else {
      setEvents([...events, { id: Date.now(), ...eventForm, platform: eventForm.platform || 'Hibrit' }]);
      showToast('Etkinlik oluşturuldu');
    }

    setEventForm({ title: '', date: '', location: '', platform: 'Hibrit', capacity: '' });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    setAttendees(attendees.filter(at => at.eventId !== id));
    showToast('Etkinlik silindi');
  };

  const handleAttendeeSubmit = (e) => {
    e.preventDefault();
    if (!attendeeForm.name || !attendeeForm.email || !attendeeForm.eventId) return;

    if (editingAttendeeId) {
      setAttendees(attendees.map(at => at.id === editingAttendeeId ? { ...at, ...attendeeForm } : at));
      setEditingAttendeeId(null);
      showToast('Katılımcı güncellendi');
    } else {
      setAttendees([...attendees, { id: Date.now(), ...attendeeForm }]);
      showToast('Katılımcı eklendi');
    }

    setAttendeeForm({ name: '', email: '', eventId: '', ticketType: 'Standard' });
  };

  const deleteAttendee = (id) => {
    setAttendees(attendees.filter(at => at.id !== id));
    showToast('Katılımcı silindi');
  };

  const filteredAttendees = attendees.filter(at =>
    at.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    at.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const interactiveNodes = [
    ...networkSeeds,
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `cursor-${index}`,
      x: pointer.x + Math.cos((Math.PI * 2 * index) / 6) * (6 + index * 1.8),
      y: pointer.y + Math.sin((Math.PI * 2 * index) / 6) * (6 + index * 1.4),
      size: 3.2 + index * 0.45,
      pulse: true
    }))
  ];

  const networkLines = [];
  for (let i = 0; i < interactiveNodes.length; i += 1) {
    for (let j = i + 1; j < interactiveNodes.length; j += 1) {
      const dx = interactiveNodes[i].x - interactiveNodes[j].x;
      const dy = interactiveNodes[i].y - interactiveNodes[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 28) {
        networkLines.push({
          id: `${interactiveNodes[i].id}-${interactiveNodes[j].id}`,
          x1: interactiveNodes[i].x,
          y1: interactiveNodes[i].y,
          x2: interactiveNodes[j].x,
          y2: interactiveNodes[j].y,
          opacity: Math.max(0.08, 1 - distance / 28),
          width: 1 + (1 - distance / 28) * 0.8
        });
      }
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-zinc-300 selection:text-zinc-900 pb-16"
      onMouseMove={(event) => {
        if (typeof window === 'undefined') return;
        setPointer({
          x: (event.clientX / window.innerWidth) * 100,
          y: (event.clientY / window.innerHeight) * 100
        });
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.92), rgba(244,246,249,0.86) 22%, rgba(228,232,238,0.62) 52%, rgba(207,216,224,0.22) 100%)'
          }}
        />
        <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(148,163,184,0.07) 35%, rgba(255,255,255,0.1))' }} />

        {networkLines.map((line) => {
          const length = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
          const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * (180 / Math.PI);

          return (
            <div
              key={line.id}
              className="absolute rounded-full"
              style={{
                left: `${(line.x1 + line.x2) / 2}%`,
                top: `${(line.y1 + line.y2) / 2}%`,
                width: `${length}%`,
                height: `${line.width}px`,
                opacity: line.opacity,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(148,163,184,0.75) 50%, rgba(255,255,255,0) 100%)',
                boxShadow: '0 0 18px rgba(148, 163, 184, 0.22)'
              }}
            />
          );
        })}

        {interactiveNodes.map((node) => {
          const isCursorNode = String(node.id).startsWith('cursor');
          return (
            <div
              key={node.id}
              className={`absolute rounded-full ${node.pulse ? 'animate-pulse' : ''}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                background: isCursorNode
                  ? 'radial-gradient(circle, rgba(32, 196, 113, 0.95), rgba(59, 130, 246, 0.42) 58%, rgba(255,255,255,0.12) 100%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.96), rgba(148,163,184,0.56) 58%, rgba(255,255,255,0.08) 100%)',
                boxShadow: isCursorNode ? '0 0 18px rgba(52, 211, 153, 0.8), 0 0 34px rgba(59,130,246,0.25)' : '0 0 12px rgba(148,163,184,0.4)',
                transform: 'translate(-50%, -50%)',
                border: isCursorNode ? '1px solid rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.25)'
              }}
            />
          );
        })}
      </div>

      {flashMessage && (
        <div className="fixed right-6 top-20 z-50 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 shadow-lg">
          {flashMessage}
        </div>
      )}

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-300 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 font-bold text-sm text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_12px_rgba(15,23,42,0.08)]">
                EA
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-zinc-800">EventOS Enterprise</h1>
                <p className="text-xs text-zinc-500">Global Operations & Management Suite</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse"></span>
                Sistem Aktif
              </span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 opacity-90" />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">Toplam Etkinlik</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{events.length}</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50 to-zinc-100 opacity-90" />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">Kayıtlı Katılımcı</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{attendees.length}</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50 to-zinc-100 opacity-90" />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">Toplam Kapasite</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                  {events.reduce((acc, curr) => acc + Number(curr.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-800">
                  {editingEventId ? 'Etkinlik Bilgilerini Düzenle' : 'Yeni Etkinlik Kaydı'}
                </h2>
                {editingEventId && (
                  <button onClick={() => { setEditingEventId(null); setEventForm({ title: '', date: '', location: '', platform: 'Hibrit', capacity: '' }); }} className="text-xs text-zinc-500 hover:text-zinc-800">İptal</button>
                )}
              </div>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Etkinlik Başlığı</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition"
                    placeholder="Örn: Cloud Native Days"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Tarih</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Kapasite</label>
                    <input
                      type="number"
                      value={eventForm.capacity}
                      onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition"
                      placeholder="200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Konum</label>
                    <select
                      value={eventForm.location}
                      onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400 transition"
                      required
                    >
                      <option value="">Şehir seçiniz</option>
                      {cityOptions.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Platform</label>
                    <select
                      value={eventForm.platform}
                      onChange={e => setEventForm({ ...eventForm, platform: e.target.value })}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400 transition"
                    >
                      {platformOptions.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition">
                  {editingEventId ? 'Değişiklikleri Kaydet' : 'Etkinlik Oluştur'}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-800">
                  {editingAttendeeId ? 'Katılımcı Düzenle' : 'Yeni Katılımcı Kaydı'}
                </h2>
                {editingAttendeeId && (
                  <button onClick={() => { setEditingAttendeeId(null); setAttendeeForm({ name: '', email: '', eventId: '', ticketType: 'Standard' }); }} className="text-xs text-zinc-500 hover:text-zinc-800">İptal</button>
                )}
              </div>
              <form onSubmit={handleAttendeeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    value={attendeeForm.name}
                    onChange={e => setAttendeeForm({ ...attendeeForm, name: e.target.value })}
                    className="w-full bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-sky-400 transition"
                    placeholder="Örn: Leyla Demir"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">E-posta Adresi</label>
                  <input
                    type="email"
                    value={attendeeForm.email}
                    onChange={e => setAttendeeForm({ ...attendeeForm, email: e.target.value })}
                    className="w-full bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-sky-400 transition"
                    placeholder="kullanici@domain.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">İlgili Etkinlik</label>
                    <select
                      value={attendeeForm.eventId}
                      onChange={e => setAttendeeForm({ ...attendeeForm, eventId: Number(e.target.value) })}
                      className="w-full bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-sky-400 transition"
                      required
                    >
                      <option value="">Seçiniz</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Bilet Sınıfı</label>
                    <select
                      value={attendeeForm.ticketType}
                      onChange={e => setAttendeeForm({ ...attendeeForm, ticketType: e.target.value })}
                      className="w-full bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-sky-400 transition"
                    >
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                      <option value="Speaker">Speaker</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition">
                  {editingAttendeeId ? 'Değişiklikleri Kaydet' : 'Katılımcı Kaydet'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl flex flex-col">
              <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-800">Aktif Etkinlikler</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">{events.length}</span>
              </div>
              <div className="divide-y divide-zinc-200 overflow-y-auto max-h-[350px]">
                {events.length === 0 ? (
                  <p className="p-5 text-xs text-zinc-500 text-center">Kayıtlı etkinlik bulunamadı.</p>
                ) : (
                  events.map(ev => (
                    <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-800">{ev.title}</p>
                        <p className="text-xs text-zinc-500">{ev.date} • {ev.location} • {ev.platform || 'Hibrit'} • <span className="text-zinc-600">Kapasite: {ev.capacity || 'Sınırsız'}</span></p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEventForm({ ...ev, platform: ev.platform || 'Hibrit' }); setEditingEventId(ev.id); }} className="px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded transition">Düzenle</button>
                        <button onClick={() => deleteEvent(ev.id)} className="px-2.5 py-1 text-xs font-medium text-rose-500 rounded transition hover:bg-red-600 hover:text-white">Sil</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl flex flex-col">
              <div className="p-5 border-b border-zinc-200 flex justify-between items-center gap-4">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-800">Katılımcı Listesi</h3>
                <input
                  type="text"
                  placeholder="Katılımcı ara..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-zinc-50 border border-zinc-300 rounded-md px-2.5 py-1 text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-36 sm:w-48"
                />
              </div>
              <div className="divide-y divide-zinc-200 overflow-y-auto max-h-[350px]">
                {filteredAttendees.length === 0 ? (
                  <p className="p-5 text-xs text-zinc-500 text-center">Eşleşen katılımcı bulunamadı.</p>
                ) : (
                  filteredAttendees.map(at => {
                    const ev = events.find(e => e.id === at.eventId);
                    return (
                      <div key={at.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-zinc-800">{at.name}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono">{at.ticketType}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{at.email} • <span className="text-zinc-600">{ev ? ev.title : 'Bilinmeyen Etkinlik'}</span></p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setAttendeeForm(at); setEditingAttendeeId(at.id); }} className="px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded transition">Düzenle</button>
                          <button onClick={() => deleteAttendee(at.id)} className="px-2.5 py-1 text-xs font-medium text-rose-500 rounded transition hover:bg-red-600 hover:text-white">Sil</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
