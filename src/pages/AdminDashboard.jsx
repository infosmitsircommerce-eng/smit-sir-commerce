import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, BarChart2, Bell, Settings, Upload, Plus, Eye, Trash2, Edit, Video, Calendar, CreditCard, MessageCircle, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

const adminSections = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'enquiries', label: 'Enquiries', icon: MessageCircle },
  { id: 'lectures', label: 'Lectures', icon: Video },
  { id: 'material', label: 'Study Material', icon: FileText },
  { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
  { id: 'tests', label: 'Test Series', icon: BarChart2 },
  { id: 'live', label: 'Live Classes', icon: Calendar },
  { id: 'batches', label: 'Batches', icon: Users },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const overviewStats = [
  { label: 'Total Students', value: '248', change: '+12 this month', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'New Enquiries', value: '18', change: 'This week', color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { label: 'Active Lectures', value: '94', change: '+6 added', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Quizzes Attempted', value: '1,240', change: 'This month', color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const mockEnquiries = [
  { id: 1, name: 'Arjun Patel', class: 12, city: 'Ahmedabad', batch: 'Offline', date: '19 May 2026', status: 'New' },
  { id: 2, name: 'Priya Shah', class: 11, city: 'Surat', batch: 'Online', date: '18 May 2026', status: 'Contacted' },
  { id: 3, name: 'Rohit Desai', class: 12, city: 'Vadodara', batch: 'Offline', date: '17 May 2026', status: 'Enrolled' },
];

const mockStudents = [
  { id: 1, name: 'Rahul Sharma', class: 12, batch: 'Online', score: '76%', attendance: '87%' },
  { id: 2, name: 'Priya Mehta', class: 12, batch: 'Offline', score: '88%', attendance: '92%' },
  { id: 3, name: 'Ankit Joshi', class: 11, batch: 'Online', score: '71%', attendance: '78%' },
];

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="card-premium">
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-white font-medium text-sm mb-1">{stat.label}</div>
            <div className="text-navy-500 text-xs">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-premium">
          <h4 className="font-semibold text-white mb-3">Quick Upload</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Upload Lecture', icon: Video, color: 'text-blue-400' },
              { label: 'Upload Notes', icon: FileText, color: 'text-emerald-400' },
              { label: 'Add Quiz', icon: BookOpen, color: 'text-purple-400' },
              { label: 'Add Announcement', icon: Bell, color: 'text-gold-400' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="flex items-center gap-2 p-3 bg-navy-800/50 hover:bg-navy-700 rounded-xl text-sm transition-colors">
                  <Icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-navy-300 text-xs">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="card-premium">
          <h4 className="font-semibold text-white mb-3">Platform Stats</h4>
          {[
            { label: 'Total Lectures', value: '94' },
            { label: 'Study Materials', value: '56' },
            { label: 'Active Quizzes', value: '28' },
            { label: 'Test Series', value: '12' },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-navy-800/50 last:border-0">
              <span className="text-navy-400 text-sm">{s.label}</span>
              <span className="text-white font-semibold text-sm">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentsSection() {
  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white">Enrolled Students</h3>
        <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Student</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-navy-400 text-xs border-b border-navy-700/50">
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-left py-2 pr-4">Class</th>
              <th className="text-left py-2 pr-4">Batch</th>
              <th className="text-left py-2 pr-4">Avg Score</th>
              <th className="text-left py-2 pr-4">Attendance</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((s) => (
              <tr key={s.id} className="border-b border-navy-800/30 hover:bg-navy-800/30">
                <td className="py-3 pr-4 text-white text-sm">{s.name}</td>
                <td className="py-3 pr-4 text-navy-400 text-sm">Class {s.class}</td>
                <td className="py-3 pr-4 text-navy-400 text-sm">{s.batch}</td>
                <td className="py-3 pr-4 text-emerald-400 font-medium text-sm">{s.score}</td>
                <td className="py-3 pr-4 text-gold-400 font-medium text-sm">{s.attendance}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-navy-700 hover:bg-navy-600 rounded-lg"><Eye className="w-3.5 h-3.5 text-navy-400" /></button>
                    <button className="p-1.5 bg-navy-700 hover:bg-navy-600 rounded-lg"><Edit className="w-3.5 h-3.5 text-navy-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnquiriesSection() {
  return (
    <div className="card-premium">
      <h3 className="font-semibold text-white mb-5">Admission Enquiries</h3>
      <div className="space-y-3">
        {mockEnquiries.map((e) => (
          <div key={e.id} className="flex items-center justify-between p-4 bg-navy-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium text-sm">{e.name}</div>
              <div className="text-navy-400 text-xs mt-0.5">Class {e.class} · {e.city} · {e.batch} Batch</div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                e.status === 'New' ? 'bg-gold-500/20 text-gold-400' :
                e.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>{e.status}</span>
              <div className="text-navy-500 text-xs mt-1">{e.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialSection() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ title: '', subject: 'Accountancy', class_level: '12', type: 'PDF Notes', is_free: true });
  const fileRef = useRef();

  const subjects = ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education', 'All Subjects'];
  const types = ['PDF Notes', 'Revision Sheet', 'Mind Map', 'Formula Sheet', 'One-Shot Notes', 'Important Questions', 'Sample Paper', 'PYQ', 'Practice Sheet', 'NCERT Solutions'];

  useEffect(() => { fetchMaterials(); }, []);

  async function fetchMaterials() {
    setLoading(true);
    const { data } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false });
    setMaterials(data || []);
    setLoading(false);
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) { setStatus({ type: 'error', msg: 'Please select a PDF file.' }); return; }
    if (!file.name.endsWith('.pdf')) { setStatus({ type: 'error', msg: 'Only PDF files allowed.' }); return; }

    setUploading(true);
    setStatus(null);

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error: uploadError } = await supabase.storage.from('study-materials').upload(fileName, file);

    if (uploadError) { setStatus({ type: 'error', msg: 'Upload failed: ' + uploadError.message }); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('study-materials').getPublicUrl(fileName);

    const { error: dbError } = await supabase.from('study_materials').insert({
      title: form.title,
      subject: form.subject,
      class_level: parseInt(form.class_level),
      type: form.type,
      is_free: form.is_free,
      file_url: publicUrl,
      file_name: fileName,
    });

    if (dbError) { setStatus({ type: 'error', msg: 'Saved file but DB failed: ' + dbError.message }); }
    else {
      setStatus({ type: 'success', msg: 'PDF uploaded successfully!' });
      setForm({ title: '', subject: 'Accountancy', class_level: '12', type: 'PDF Notes', is_free: true });
      fileRef.current.value = '';
      fetchMaterials();
    }
    setUploading(false);
  }

  async function handleDelete(material) {
    await supabase.storage.from('study-materials').remove([material.file_name]);
    await supabase.from('study_materials').delete().eq('id', material.id);
    fetchMaterials();
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="card-premium">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><Upload className="w-4 h-4 text-gold-400" /> Upload New PDF</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-navy-400 text-xs mb-1.5">Title *</label>
              <input required className="input-field" placeholder="e.g. Partnership Accounts - Complete Notes" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-navy-400 text-xs mb-1.5">Subject *</label>
              <select className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-navy-400 text-xs mb-1.5">Class *</label>
              <select className="input-field" value={form.class_level} onChange={e => setForm({...form, class_level: e.target.value})}>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-navy-400 text-xs mb-1.5">Material Type *</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-navy-400 text-xs mb-1.5">Access</label>
              <select className="input-field" value={form.is_free ? 'free' : 'premium'} onChange={e => setForm({...form, is_free: e.target.value === 'free'})}>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-navy-400 text-xs mb-1.5">PDF File *</label>
              <input ref={fileRef} type="file" accept=".pdf" className="input-field file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-400 cursor-pointer" />
            </div>
          </div>
          {status && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {status.msg}
            </div>
          )}
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {uploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload PDF</>}
          </button>
        </form>
      </div>

      {/* Uploaded Files */}
      <div className="card-premium">
        <h3 className="font-semibold text-white mb-5">Uploaded Materials ({materials.length})</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader className="w-6 h-6 text-gold-400 animate-spin" /></div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-navy-700/50 rounded-xl">
            <FileText className="w-8 h-8 text-navy-600 mx-auto mb-2" />
            <div className="text-navy-500 text-sm">No PDFs uploaded yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 bg-navy-800/50 rounded-xl gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{m.title}</div>
                    <div className="text-navy-400 text-xs mt-0.5">{m.subject} · Class {m.class_level} · {m.type} · {m.is_free ? 'Free' : 'Premium'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-navy-700 hover:bg-blue-600 rounded-lg transition-colors">
                    <Eye className="w-3.5 h-3.5 text-navy-400 hover:text-white" />
                  </a>
                  <button onClick={() => handleDelete(m)} className="p-1.5 bg-navy-700 hover:bg-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-navy-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderSection({ title, description, actions }) {
  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-navy-400 text-sm mt-1">{description}</p>
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions.map((a) => (
              <button key={a} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> {a}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="text-center py-8 border-2 border-dashed border-navy-700/50 rounded-xl">
        <Upload className="w-8 h-8 text-navy-600 mx-auto mb-2" />
        <div className="text-navy-500 text-sm">Content will appear here — connect backend to manage</div>
      </div>
    </div>
  );
}

const sectionContent = {
  overview: { component: OverviewSection },
  students: { component: StudentsSection },
  enquiries: { component: EnquiriesSection },
  lectures: { title: 'Manage Lectures', desc: 'Upload and manage video lectures', actions: ['Upload Lecture'] },
  material: { component: MaterialSection },
  quizzes: { title: 'Quizzes', desc: 'Create and manage quizzes', actions: ['Add Quiz'] },
  tests: { title: 'Test Series', desc: 'Create and manage test series', actions: ['Create Test'] },
  live: { title: 'Live Classes', desc: 'Schedule and manage live classes', actions: ['Schedule Class'] },
  batches: { title: 'Batches', desc: 'Manage online and offline batches', actions: ['Add Batch'] },
  announcements: { title: 'Announcements', desc: 'Post announcements for students', actions: ['Add Announcement'] },
  payments: { title: 'Payments', desc: 'View payment status — connect payment gateway', actions: [] },
  settings: { title: 'Settings', desc: 'Manage platform settings', actions: ['Save Settings'] },
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="card-premium">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-navy-600">
                <Settings className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white">Admin Login</h2>
              <p className="text-navy-400 text-sm mt-1">Smit Sir Commerce Admin Panel</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const pwd = e.target.password.value;
              if (pwd === 'Iambatman@4755') { setIsAdmin(true); }
              else { alert('Wrong password. Try again.'); }
            }} className="space-y-4">
              <input name="password" className="input-field" placeholder="Enter admin password" type="password" required />
              <button type="submit" className="btn-primary w-full">Access Admin Panel</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = sectionContent[activeSection];
  const Content = current.component;

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-navy-900 border-r border-navy-800/50 flex flex-col">
        <div className="p-5 border-b border-navy-800/50">
          <div className="font-display font-bold text-white text-sm">Admin Panel</div>
          <div className="text-gold-400 text-xs">Smit Sir Commerce</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/20'
                    : 'text-navy-400 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="font-display font-bold text-xl text-white">
              {adminSections.find(s => s.id === activeSection)?.label}
            </h2>
          </div>
          {Content ? (
            <Content />
          ) : (
            <PlaceholderSection title={current.title} description={current.desc} actions={current.actions} />
          )}
        </div>
      </div>
    </div>
  );
}
