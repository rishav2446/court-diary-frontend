import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiUser, 
  FiInfo, 
  FiFileText, 
  FiPlus, 
  FiClock 
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getCase, updateCase } from '../services/casesService';

import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Badge from '../Components/ui/Badge';
import Skeleton from '../Components/ui/Skeleton';
import './CaseDetail.css';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const toast = useToast();

  const [c, setCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Custom mock sub-data
  const [hearings] = useState([
    { id: 1, date: '2026-07-04', bench: 'Courtroom 12', business: 'Interim Injunction Appeal', result: 'Adjourned for replies', status: 'Adjourned' },
    { id: 2, date: '2026-06-12', bench: 'Courtroom 12', business: 'Admission Arguments', result: 'Notice issued to respondents', status: 'Done' },
  ]);

  const [documents] = useState([
    { id: 1, name: 'Vakalatnama_Signed.pdf', size: '1.2 MB', date: '2026-04-18' },
    { id: 2, name: 'Written_Submissions.pdf', size: '4.8 MB', date: '2026-06-02' },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, text: 'Need to file service affidavit before next date.', author: 'Admin', date: '2026-07-01' },
  ]);
  
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const loadCase = async () => {
      try {
        const data = await getCase(id, token);
        setCase(data);
      } catch (err) {
        toast.error('Failed to load case specifics.');
      } finally {
        setLoading(false);
      }
    };
    loadCase();
  }, [id, token, toast]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = { ...c, status: newStatus };
      const res = await updateCase(id, updated, token);
      setCase(res);
      toast.success(`Case status set to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const noteObj = {
      id: Date.now(),
      text: newNote,
      author: 'Counsel',
      date: new Date().toISOString().split('T')[0],
    };
    setNotes([noteObj, ...notes]);
    setNewNote('');
    toast.success('Note appended.');
  };

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton width="120px" height={24} style={{ marginBottom: '24px' }} />
        <Skeleton width="300px" height={40} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          <Skeleton height={300} />
          <Skeleton height={300} />
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="page-container flex flex-col items-center justify-center">
        <h3>Case File not found</h3>
        <Button variant="secondary" onClick={() => navigate('/cases')}>Back to cases</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back Button */}
      <button className="back-btn flex items-center gap-2" onClick={() => navigate('/cases')}>
        <FiArrowLeft size={16} /> Back to Litigation Ledger
      </button>

      {/* Header Profile */}
      <div className="casedetail-header flex justify-between items-start w-full">
        <div>
          <div className="flex items-center gap-3">
            <span className="case-badge-number">{c.caseNumber}</span>
            <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Adjourned' ? 'warning' : c.status === 'Disposed' ? 'neutral' : 'info'} dot>
              {c.status}
            </Badge>
          </div>
          <h1 className="display-font case-main-title" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: 'var(--space-2)' }}>
            {c.title}
          </h1>
          <p className="case-court-subtext">{c.court}</p>
        </div>

        {/* Action button status set */}
        <div className="case-status-actions flex gap-2">
          {c.status !== 'Active' && <Button size="sm" variant="secondary" onClick={() => handleStatusChange('Active')}>Mark Active</Button>}
          {c.status !== 'Adjourned' && <Button size="sm" variant="secondary" onClick={() => handleStatusChange('Adjourned')}>Mark Adjourned</Button>}
          {c.status !== 'Disposed' && <Button size="sm" variant="secondary" onClick={() => handleStatusChange('Disposed')}>Dispose File</Button>}
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="casedetail-grid">
        {/* Left Side: Summary Panel */}
        <div className="casedetail-side">
          <Card header="Docket Specifications">
            <ul className="spec-list flex flex-col gap-4">
              <li className="spec-item">
                <span className="spec-label flex items-center gap-2"><FiUser /> Client Profile</span>
                <span className="spec-val">{c.client}</span>
              </li>
              <li className="spec-item">
                <span className="spec-label flex items-center gap-2"><FiUser /> Opponent Party</span>
                <span className="spec-val">{c.opponent || 'N/A'}</span>
              </li>
              <li className="spec-item">
                <span className="spec-label flex items-center gap-2"><FiInfo /> Presiding Bench</span>
                <span className="spec-val">{c.judge || 'N/A'}</span>
              </li>
              <li className="spec-item">
                <span className="spec-label flex items-center gap-2"><FiCalendar /> Filing Date</span>
                <span className="spec-val">{c.filingDate || 'N/A'}</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Tabbed Workspaces */}
        <div className="casedetail-workspace">
          <div className="workspace-tabs flex gap-2">
            {['Overview', 'Hearings Log', 'Documents Vault', 'Practice Notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-toggle ${activeTab === tab ? 'tab-toggle--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Card padding="md" className="workspace-content">
            {activeTab === 'Overview' && (
              <div className="overview-tab flex flex-col gap-6">
                <div>
                  <h3 className="section-heading">Case Facts & Background</h3>
                  <p className="case-desc-para">{c.description || 'No background facts entered for this case ledger.'}</p>
                </div>
                <div>
                  <h3 className="section-heading">Key Next Step</h3>
                  <div className="next-hearing-alert flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="calendar-icon-indicator"><FiCalendar /></span>
                      <div>
                        <h4>Next Court Appearance</h4>
                        <p>{c.nextHearing ? `Scheduled for ${c.nextHearing}` : 'No upcoming hearings scheduled.'}</p>
                      </div>
                    </div>
                    {c.nextHearing && <Button size="sm" variant="secondary" onClick={() => setActiveTab('Hearings Log')}>View Schedule</Button>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Hearings Log' && (
              <div className="hearings-tab flex flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                  <h3 className="section-heading">Court Hearing Log</h3>
                  <Button variant="secondary" size="sm" icon={FiPlus}>Schedule Hearing</Button>
                </div>

                <div className="timeline-trail flex flex-col gap-6">
                  {hearings.map(h => (
                    <div key={h.id} className="timeline-node">
                      <div className="timeline-node__header flex justify-between items-center w-full">
                        <span className="timeline-node__date flex items-center gap-2"><FiClock /> {h.date}</span>
                        <Badge variant={h.status === 'Done' ? 'success' : 'warning'}>{h.status}</Badge>
                      </div>
                      <div className="timeline-node__content">
                        <h4>{h.business}</h4>
                        <p className="timeline-node__bench">{h.bench}</p>
                        {h.result && <p className="timeline-node__result"><strong>Bench Order:</strong> {h.result}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Documents Vault' && (
              <div className="documents-tab flex flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                  <h3 className="section-heading">Filing Documentation</h3>
                  <Button variant="secondary" size="sm" icon={FiPlus}>Upload File</Button>
                </div>

                <div className="doc-list flex flex-col gap-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="doc-item flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="doc-icon"><FiFileText size={18} /></span>
                        <div>
                          <span className="doc-name">{doc.name}</span>
                          <span className="doc-size">{doc.size} • Uploaded {doc.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Practice Notes' && (
              <div className="notes-tab flex flex-col gap-4">
                <h3 className="section-heading">Internal Legal Notes</h3>
                
                <form onSubmit={handleAddNote} className="note-form flex gap-3">
                  <input
                    type="text"
                    placeholder="Type internal case note / action items..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="note-form__input"
                  />
                  <Button type="submit" variant="primary">Add</Button>
                </form>

                <div className="notes-list flex flex-col gap-3">
                  {notes.map(n => (
                    <div key={n.id} className="note-card">
                      <div className="note-card__header flex justify-between">
                        <span className="note-card__author">{n.author}</span>
                        <span className="note-card__date">{n.date}</span>
                      </div>
                      <p className="note-card__text">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
