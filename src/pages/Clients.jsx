import React, { useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiPhone, FiMail, FiMapPin, FiBriefcase, FiTrash2 } from 'react-icons/fi';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import Badge from '../Components/ui/Badge';
import Modal from '../Components/ui/Modal';
import Skeleton from '../Components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { createClient, deleteClient, getClients } from '../services/clientsService';
import './Clients.css';

const Clients = () => {
  const toast = useToast();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        setClients(await getClients(token));
      } catch (error) {
        toast.error(error.message || 'Failed to load clients.');
      } finally {
        setIsLoading(false);
      }
    };
    loadClients();
  }, [token, toast]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Client name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newClient = await createClient({ name, email, phone, address }, token);
      setClients([newClient, ...clients]);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      toast.success('Client directory profile created!');
    } catch (error) {
      toast.error(error.message || 'Failed to create client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete client record? This action is permanent.')) {
      try {
        await deleteClient(id, token);
        setClients(clients.filter(c => c.id !== id));
        toast.success('Client record removed.');
      } catch (error) {
        toast.error(error.message || 'Failed to delete client.');
      }
    }
  };

  const filteredClients = clients.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="clients-header flex justify-between items-center w-full">
        <div>
          <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
            Clients Directory
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Maintain records of case litigants and corporate contacts.
          </p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => setIsModalOpen(true)}>
          Add Client
        </Button>
      </div>

      {/* Filter and Search */}
      <Card padding="sm" className="filters-card">
        <div className="cases-search flex items-center relative">
          <FiSearch className="cases-search__icon" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cases-search__input"
          />
        </div>
      </Card>

      {/* Clients Cards Grid */}
      <div className="clients-grid">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height={220} />)
        ) : filteredClients.map(c => (
          <Card key={c.id} padding="md" className="client-profile-card flex-col justify-between">
            <div>
              <div className="flex justify-between items-start w-full">
                <div className="client-avatar">
                  {c.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.status === 'Active' ? 'success' : 'neutral'}>{c.status}</Badge>
                  <button className="client-delete-btn" onClick={(e) => handleDeleteClient(c.id, e)} title="Remove Client">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="client-name-title">{c.name}</h3>
              
              <div className="client-details-list flex flex-col gap-2">
                <span className="client-detail-item"><FiPhone size={14} /> {c.phone || 'N/A'}</span>
                <span className="client-detail-item"><FiMail size={14} /> {c.email || 'N/A'}</span>
                <span className="client-detail-item"><FiMapPin size={14} /> {c.address || 'N/A'}</span>
              </div>
            </div>

            <div className="client-card-footer flex justify-between items-center w-full">
              <span className="client-case-count"><FiBriefcase size={14} /> {c.caseCount} active cases</span>
              <Button size="sm" variant="secondary">Ledger</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Client Profile">
        <form onSubmit={handleAddClient} className="modal-form flex flex-col gap-4">
          <Input label="Litigant Name / Corporate Title" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Mobile / Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Permanent / Corporate Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="flex justify-end gap-3" style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>Create Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
