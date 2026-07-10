import React, { useState } from 'react';
import { FiSearch, FiUploadCloud, FiFileText, FiDownload, FiTrash2, FiTag } from 'react-icons/fi';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Badge from '../Components/ui/Badge';
import { useToast } from '../hooks/useToast';
import './Documents.css';

const Documents = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [docs, setDocs] = useState([
    { id: 1, name: 'Vakalatnama_Signed.pdf', size: '1.2 MB', category: 'Authorization', date: '2026-04-18', format: 'PDF' },
    { id: 2, name: 'Written_Submissions.pdf', size: '4.8 MB', category: 'Pleadings', date: '2026-06-02', format: 'PDF' },
    { id: 3, name: 'Notice_Copy.pdf', size: '640 KB', category: 'Orders', date: '2026-06-15', format: 'PDF' },
    { id: 4, name: 'Case_Summary_V1.docx', size: '220 KB', category: 'Notes', date: '2026-07-01', format: 'DOCX' },
  ]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    toast.success('File upload complete! Saved in legal cloud storage.');
    
    const newDoc = {
      id: Date.now(),
      name: 'Uploaded_Document_' + (docs.length + 1) + '.pdf',
      size: '1.8 MB',
      category: 'Unclassified',
      date: new Date().toISOString().split('T')[0],
      format: 'PDF',
    };
    setDocs([newDoc, ...docs]);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete document permanently from secured cloud?')) {
      setDocs(docs.filter(d => d.id !== id));
      toast.success('Document file purged.');
    }
  };

  const filteredDocs = docs.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="documents-header flex justify-between items-center w-full">
        <div>
          <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
            Documents Vault
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Secured cloud repository for legal briefings, pleadings, and briefs.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Area */}
      <Card 
        padding="lg" 
        className="upload-dropzone flex flex-col items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FiUploadCloud size={48} className="upload-dropzone__icon" />
        <h3>Drag & drop legal briefs here</h3>
        <p>Supports PDF, DOCX, PNG up to 25MB. Files are secured with 256-bit encryption.</p>
        <Button variant="secondary" style={{ marginTop: 'var(--space-4)' }}>Browse Files</Button>
      </Card>

      {/* Search Filter */}
      <Card padding="sm" className="filters-card">
        <div className="cases-search flex items-center relative">
          <FiSearch className="cases-search__icon" />
          <input 
            type="text" 
            placeholder="Search by file name or classification tag..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cases-search__input"
          />
        </div>
      </Card>

      {/* Document Grid Row items */}
      <Card padding="none" className="docs-list-card">
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>File Description</th>
                <th>Classification</th>
                <th>Upload Date</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(d => (
                <tr key={d.id} className="doc-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="doc-table-icon"><FiFileText size={18} /></span>
                      <span className="doc-table-name">{d.name}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant="gold" dot>
                      <FiTag size={10} style={{ marginRight: '2px' }} /> {d.category}
                    </Badge>
                  </td>
                  <td><span className="doc-table-date">{d.date}</span></td>
                  <td><span className="doc-table-size">{d.size}</span></td>
                  <td>
                    <div className="row-actions flex justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={FiDownload} />
                      <Button variant="danger" size="sm" icon={FiTrash2} onClick={(e) => handleDelete(d.id, e)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Documents;
