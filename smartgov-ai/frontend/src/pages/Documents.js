import React, { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import '../styles/profile.css';

function Documents() {
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadChecklists();
    }, []);

    const loadChecklists = async () => {
        try {
            const response = await documentAPI.getUserChecklists();
            setChecklists(response.data);
        } catch (err) {
            setError('Failed to load document checklists');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDocument = async (checklistId, docId, currentStatus) => {
        try {
            const checklist = checklists.find(c => c.id === checklistId);
            const updatedDocs = checklist.documents.map(doc =>
                doc.id === docId ? { ...doc, is_collected: !currentStatus } : doc
            );

            await documentAPI.updateChecklist(checklistId, updatedDocs);

            // Update local state
            setChecklists(checklists.map(c =>
                c.id === checklistId ? { ...c, documents: updatedDocs } : c
            ));
        } catch (err) {
            setError('Failed to update document status');
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-state fade-in">
                    <div className="spinner"></div>
                    <p>Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header slide-in-left">
                <h1>📄 Document Checklists</h1>
                <p>Manage required documents for your scheme applications</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError('')} className="alert-close">
                        ✕
                    </button>
                </div>
            )}

            {checklists.length === 0 ? (
                <div className="empty-state fade-in">
                    <span className="empty-icon">📋</span>
                    <p>No document checklists yet</p>
                    <p className="text-muted">
                        Apply for a scheme to generate a document checklist
                    </p>
                </div>
            ) : (
                <div className="profile-grid">
                    {checklists.map((checklist) => {
                        const completed = checklist.documents.filter(d => d.is_collected).length;
                        const total = checklist.documents.length;
                        const progress = (completed / total) * 100;

                        return (
                            <div key={checklist.id} className="profile-card card animated">
                                <div className="card-header">
                                    <h2>{checklist.scheme_name}</h2>
                                    <span className="badge badge-info">
                                        {completed}/{total} Complete
                                    </span>
                                </div>

                                <div className="progress-bar" style={{ marginBottom: '20px' }}>
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${progress}%`,
                                            background: progress === 100 ? '#10b981' : '#3b82f6',
                                            height: '8px',
                                            borderRadius: '4px',
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>

                                <div className="document-list">
                                    {checklist.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`document-item ${doc.is_collected ? 'completed' : ''}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                background: doc.is_collected ? '#f0fdf4' : '#f8fafc',
                                                border: `1px solid ${doc.is_collected ? '#86efac' : '#e2e8f0'}`,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => toggleDocument(checklist.id, doc.id, doc.is_collected)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={doc.is_collected}
                                                onChange={() => { }}
                                                style={{
                                                    marginRight: '12px',
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: '500',
                                                    color: doc.is_collected ? '#059669' : '#1e293b',
                                                    textDecoration: doc.is_collected ? 'line-through' : 'none'
                                                }}>
                                                    {doc.document_name}
                                                </div>
                                                {doc.description && (
                                                    <div style={{
                                                        fontSize: '0.875rem',
                                                        color: '#64748b',
                                                        marginTop: '4px'
                                                    }}>
                                                        {doc.description}
                                                    </div>
                                                )}
                                            </div>
                                            {doc.is_collected && (
                                                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    background: '#fef3c7',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    color: '#92400e'
                                }}>
                                    💡 <strong>Tip:</strong> Click on any document to mark it as collected
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Documents;
