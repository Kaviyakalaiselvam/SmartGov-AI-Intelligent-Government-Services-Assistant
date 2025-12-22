import React, { useState, useEffect } from 'react';
import { schemesAPI, documentAPI } from '../services/api';
import '../styles/schemes.css';

function PersonalizedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [checklists, setChecklists] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [savedSchemesOnly, setSavedSchemesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const response = await schemesAPI.getPersonalizedSchemes();
      setSchemes(response.data.schemes || []);

      // Load checklists for each scheme
      const checklistRes = await documentAPI.getUserChecklists();
      const checklistsMap = {};
      checklistRes.data.forEach((checklist) => {
        checklistsMap[checklist.scheme] = checklist;
      });
      setChecklists(checklistsMap);
    } catch (err) {
      setError('Failed to load schemes. Please update your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChecklist = async (schemeId) => {
    try {
      const response = await documentAPI.generateChecklist(schemeId);
      setChecklists((prev) => ({
        ...prev,
        [schemeId]: response.data.checklist,
      }));
    } catch (err) {
      console.error('Failed to generate checklist:', err);
    }
  };

  const handleDocumentCheck = async (checklistId, docKey, isChecked) => {
    const checklist = Object.values(checklists).find(
      (c) => c.id === checklistId
    );
    if (!checklist) return;

    const updatedDocs = { ...checklist.documents, [docKey]: isChecked };
    try {
      const response = await documentAPI.updateChecklist(checklistId, updatedDocs);
      setChecklists((prev) => ({
        ...prev,
        [response.data.scheme]: response.data,
      }));
    } catch (err) {
      console.error('Failed to update checklist:', err);
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    // Category filter
    if (filterCategory !== 'all' && scheme.category !== filterCategory) {
      return false;
    }

    // Search filter - search across multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        scheme.name.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        (scheme.eligibility && scheme.eligibility.toLowerCase().includes(searchLower)) ||
        (scheme.benefits && scheme.benefits.toLowerCase().includes(searchLower)) ||
        scheme.category.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className="schemes-container">
        <div className="loading-state fade-in">
          <div className="spinner"></div>
          <p>Loading your personalized schemes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schemes-container">
      <div className="schemes-header slide-in-left">
        <h1>💼 Government Schemes</h1>
        <p>Personalized schemes based on your profile</p>

        <div className="schemes-filters">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search schemes by name, description, category..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Employment">Employment</option>
            <option value="Financial">Financial</option>
            <option value="Agriculture">Agriculture</option>
          </select>
        </div>

        {(searchTerm || filterCategory !== 'all') && (
          <div className="filter-info">
            <span className="result-count">
              Showing {filteredSchemes.length} of {schemes.length} schemes
            </span>
            {searchTerm && (
              <span className="active-filter">Search: "{searchTerm}"</span>
            )}
            {filterCategory !== 'all' && (
              <span className="active-filter">Category: {filterCategory}</span>
            )}
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="schemes-grid">
        {filteredSchemes.length === 0 ? (
          <div className="empty-state fade-in">
            <span className="empty-icon">🎯</span>
            <p>No schemes found matching your criteria</p>
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="scheme-card card animated"
              onClick={() => setSelectedScheme(scheme)}
            >
              <div className="scheme-header">
                <h3 className="scheme-name">{scheme.name}</h3>
                <span className="scheme-category badge badge-primary">
                  {scheme.category}
                </span>
              </div>

              <p className="scheme-description">{scheme.description}</p>

              <div className="scheme-details">
                {scheme.deadline && (
                  <div className="detail-item">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">
                      {new Date(scheme.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {scheme.age_min && scheme.age_max && (
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">
                      {scheme.age_min}-{scheme.age_max}
                    </span>
                  </div>
                )}
              </div>

              <div className="scheme-actions">
                <button
                  onClick={() => handleGenerateChecklist(scheme.id)}
                  className="btn btn-secondary btn-small"
                >
                  📋 Checklist
                </button>
                <a
                  href={scheme.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-small"
                >
                  Apply Now
                </a>
              </div>

              {checklists[scheme.id] && (
                <div className="checklist-preview">
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${checklists[scheme.id].completion_percentage}%`,
                      }}
                    ></div>
                  </div>
                  <span className="completion-text">
                    {Math.round(checklists[scheme.id].completion_percentage)}%
                    complete
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedScheme && (
        <div
          className="modal show"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedScheme(null)
          }
        >
          <div className="modal-content slide-in-up">
            <div className="modal-header">
              <h2>{selectedScheme.name}</h2>
              <button
                onClick={() => setSelectedScheme(null)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h4>Description</h4>
              <p>{selectedScheme.description}</p>

              <h4>Eligibility</h4>
              <p>{selectedScheme.eligibility}</p>

              <h4>Benefits</h4>
              <p>{selectedScheme.benefits}</p>

              <h4>Required Documents</h4>
              {checklists[selectedScheme.id] ? (
                <div className="checklist">
                  {Object.entries(checklists[selectedScheme.id].documents).map(
                    ([docKey, isChecked]) => (
                      <label key={docKey} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleDocumentCheck(
                              checklists[selectedScheme.id].id,
                              docKey,
                              e.target.checked
                            )
                          }
                        />
                        <span>{docKey.replace(/_/g, ' ')}</span>
                      </label>
                    )
                  )}
                </div>
              ) : (
                <p>Generate checklist to see required documents</p>
              )}

              <h4>Application Process</h4>
              <p>{selectedScheme.application_process}</p>

              {selectedScheme.contact_info && (
                <>
                  <h4>Contact Information</h4>
                  <p>{selectedScheme.contact_info}</p>
                </>
              )}
            </div>

            <div className="modal-footer">
              <a
                href={selectedScheme.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Apply Now
              </a>
              <button
                onClick={() => setSelectedScheme(null)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalizedSchemes;
