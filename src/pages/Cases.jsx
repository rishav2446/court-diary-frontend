import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getCases, createCase, deleteCase } from '../services/casesService';
import { fetchCasesStart, fetchCasesSuccess, fetchCasesFailure, addCaseSuccess, deleteCaseSuccess } from '../features/cases/casesSlice';

import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import Badge from '../Components/ui/Badge';
import Modal from '../Components/ui/Modal';
import { SkeletonTable } from '../Components/ui/Skeleton';
import './Cases.css';

const Cases = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useAuth();
  const toast = useToast();

  const { items: cases, isLoading } = useSelector(state => state.cases);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Add Case Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseCourt, setNewCaseCourt] = useState('');
  const [newCaseJudge, setNewCaseJudge] = useState('');
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseOpponent, setNewCaseOpponent] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCases = async () => {
      dispatch(fetchCasesStart());
      try {
        const data = await getCases(token);
        dispatch(fetchCasesSuccess(data));
      } catch (err) {
        dispatch(fetchCasesFailure(err.message));
        toast.error('Failed to load cases.');
      }
    };
    loadCases();
  }, [dispatch, token, toast]);

  const handleAddCase = async (e) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || !newCaseNumber.trim()) {
      toast.error('Title and Case Number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const caseData = {
        title: newCaseTitle,
        caseNumber: newCaseNumber,
        court: newCaseCourt,
        judge: newCaseJudge,
        client: newCaseClient || 'Unassigned Client',
        opponent: newCaseOpponent,
        description: newCaseDesc,
        status: 'Active',
      };

      const result = await createCase(caseData, token);
      dispatch(addCaseSuccess(result));
      toast.success('New case file created successfully!');
      
      // Reset & close
      setIsAddModalOpen(false);
      setNewCaseTitle('');
      setNewCaseNumber('');
      setNewCaseCourt('');
      setNewCaseJudge('');
      setNewCaseClient('');
      setNewCaseOpponent('');
      setNewCaseDesc('');
    } catch (err) {
      toast.error('Failed to create case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCase = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this case file?')) {
      try {
        await deleteCase(id, token);
        dispatch(deleteCaseSuccess(id));
        toast.success('Case record removed.');
      } catch (err) {
        toast.error('Failed to delete case.');
      }
    }
  };

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.caseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.client || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="cases-header flex justify-between items-center w-full">
        <div>
          <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
            Litigation Ledger
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Search, manage, and create courtroom case profiles.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={FiPlus} 
          onClick={() => setIsAddModalOpen(true)}
        >
          Create Case
        </Button>
      </div>

      {/* Filters Card */}
      <Card padding="sm" className="filters-card">
        <div className="filters-container flex items-center justify-between gap-4 w-full">
          {/* Search bar */}
          <div className="cases-search flex items-center relative">
            <FiSearch className="cases-search__icon" />
            <input 
              type="text" 
              placeholder="Search by title, number, client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cases-search__input"
            />
          </div>

          {/* Filter badges */}
          <div className="filters-badges flex gap-2">
            {['All', 'Active', 'Pending', 'Adjourned', 'Disposed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`filter-btn ${statusFilter === st ? 'filter-btn--active' : ''}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Cases Ledger Table/Grid */}
      <Card padding="none" className="ledger-card">
        {isLoading ? (
          <div style={{ padding: 'var(--space-6)' }}>
            <SkeletonTable rows={5} cols={5} />
          </div>
        ) : filteredCases.length > 0 ? (
          <div className="ledger-table-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Case Particulars</th>
                  <th>Docket #</th>
                  <th>Court/Forum</th>
                  <th>Client Profile</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr 
                    key={c.id} 
                    className="ledger-row"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <td>
                      <div className="case-detail-col">
                        <span className="case-title">{c.title}</span>
                        <span className="case-desc">{c.description ? c.description.slice(0, 50) + '...' : 'No description'}</span>
                      </div>
                    </td>
                    <td><span className="case-number-badge">{c.caseNumber}</span></td>
                    <td><span className="court-label">{c.court}</span></td>
                    <td><span className="client-label">{c.client}</span></td>
                    <td>
                      <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Adjourned' ? 'warning' : c.status === 'Disposed' ? 'neutral' : 'info'} dot>
                        {c.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="row-actions flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={FiEye} 
                          onClick={() => navigate(`/cases/${c.id}`)}
                        />
                        <Button 
                          variant="danger" 
                          size="sm" 
                          icon={FiTrash2} 
                          onClick={(e) => handleDeleteCase(c.id, e)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container flex flex-col items-center justify-center">
            <div className="empty-state-icon">⚖️</div>
            <h3>No case records found</h3>
            <p>Refine your search or create a new case file ledger to get started.</p>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} style={{ marginTop: 'var(--space-4)' }}>
              Add Case
            </Button>
          </div>
        )}
      </Card>

      {/* Create Case Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Open Case File"
        size="lg"
      >
        <form onSubmit={handleAddCase} className="modal-form flex flex-col gap-4">
          <div className="modal-form-row">
            <Input 
              label="Case Title (Parties)" 
              value={newCaseTitle} 
              onChange={(e) => setNewCaseTitle(e.target.value)} 
              required 
            />
            <Input 
              label="Case Number (CN / Docket #)" 
              value={newCaseNumber} 
              onChange={(e) => setNewCaseNumber(e.target.value)} 
              required 
            />
          </div>
          <div className="modal-form-row">
            <Input 
              label="Court / Forum Name" 
              value={newCaseCourt} 
              onChange={(e) => setNewCaseCourt(e.target.value)} 
            />
            <Input 
              label="Presiding Judge / Panel" 
              value={newCaseJudge} 
              onChange={(e) => setNewCaseJudge(e.target.value)} 
            />
          </div>
          <div className="modal-form-row">
            <Input 
              label="Client Name" 
              value={newCaseClient} 
              onChange={(e) => setNewCaseClient(e.target.value)} 
            />
            <Input 
              label="Opposing Party Name" 
              value={newCaseOpponent} 
              onChange={(e) => setNewCaseOpponent(e.target.value)} 
            />
          </div>
          <div>
            <label className="textarea-label">Case Description / Notes</label>
            <textarea
              className="textarea-field"
              rows={4}
              value={newCaseDesc}
              onChange={(e) => setNewCaseDesc(e.target.value)}
              placeholder="Enter brief details of the dispute, relief sought, status notes..."
            />
          </div>
          <div className="modal-form-actions flex justify-end gap-3" style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>File Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cases;
