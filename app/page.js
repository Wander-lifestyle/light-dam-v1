'use client';
import { useState } from 'react';

const MOODS = ['work', 'beautiful', 'travel', 'fun', 'smile', 'sports'];
const CHANNELS = ['social', 'email', 'landing', 'blog', 'paid_media', 'deck'];
const CAMPAIGNS = ['Wander', 'Other'];
const CLIENTS = ['Wander', 'Internal', 'Other'];
const PHOTOGRAPHERS = ['Austin Distel', 'Spenser Sembrat', 'Marcos Paulo Prado', 'Unknown'];
const USAGE_TYPES = ['Unsplash', 'Freepik', 'Licensed', 'Original'];

const MOCK_RESULTS = [
  {
    asset_id: 'Image_001',
    filename: 'austin-distel-DS1hZ4xzD7M-unsplash.jpg',
    drive_url: 'https://drive.google.com/file/d/1I8lILakzT3sTzPPrnOnK-YTPY120687M/view',
    tags: ['work', 'phone', 'mobile', 'computer', 'entrepreneur', 'male', 'coffee', 'esim'],
    mood: ['work'],
    subjects: ['worker', 'entrepreneur'],
    campaign: 'Wander',
    client: 'Wander',
    photographer: 'Austin Distel',
    usage: 'Unsplash',
    confidence: 0.92,
    reasoning: 'Strong match for work/professional context. Male entrepreneur - perfect for eSIM business messaging.'
  },
  {
    asset_id: 'Image_002',
    filename: 'spenser-sembrat--D67wn9IdSc-unsplash.jpg',
    drive_url: 'https://drive.google.com/file/d/1gWIVJlfoElbBAEY6cclur2jF2jug16Wc/view',
    tags: ['Bali', 'female', 'indonesia', 'outdoors', 'palm trees', 'expat', 'travel', 'esim'],
    mood: ['beautiful', 'travel'],
    subjects: ['expat', 'woman'],
    campaign: 'Wander',
    client: 'Wander',
    photographer: 'Spenser Sembrat',
    usage: 'Unsplash',
    confidence: 0.95,
    reasoning: 'Excellent for travel campaigns. Aspirational, beautiful mood. High engagement potential.'
  },
  {
    asset_id: 'Image_003',
    filename: 'marcos-paulo-prado-qsG_fPHIWgw-unsplash.jpg',
    drive_url: 'https://drive.google.com/file/d/1nhAsxr7VSxA2SwR6geGz9SbxAqWdUH7G/view',
    tags: ['female', 'selfie', 'outdoor', 'sunglasses', 'travel', 'esim'],
    mood: ['travel', 'fun', 'smile'],
    subjects: ['woman'],
    campaign: 'Wander',
    client: 'Wander',
    photographer: 'Marcos Paulo Prado',
    usage: 'Unsplash',
    confidence: 0.88,
    reasoning: 'Casual, fun travel vibe. Relatable, authentic feel. Good for social media.'
  },
  {
    asset_id: 'Image_004',
    filename: 'woman-skateboard-taking-selfie.jpg',
    drive_url: 'https://drive.google.com/file/d/14dAEX42N1z-lj07L8ubqH-vl9CozgzTk/view',
    tags: ['female', 'selfie', 'mobile', 'skateboard', 'outdoor', 'athlete', 'sports', 'girl'],
    mood: ['travel', 'sports', 'fun', 'smile'],
    subjects: ['Girl'],
    campaign: 'Wander',
    client: 'Wander',
    photographer: 'Freepik',
    usage: 'Freepik',
    confidence: 0.85,
    reasoning: 'Active lifestyle imagery. Appeals to younger demographic. Mobile-forward composition.'
  }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [showPro, setShowPro] = useState(false);
  const [channel, setChannel] = useState('');
  const [campaign, setCampaign] = useState('');
  const [client, setClient] = useState('');
  const [usage, setUsage] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleSearch = () => {
    setIsSearching(true);
    setSelectedAsset(null);
    setTimeout(() => {
      let filtered = [...MOCK_RESULTS];
      
      if (query.trim()) {
        const queryWords = query.toLowerCase().split(/\s+/);
        filtered = filtered.map(r => {
          const allText = [...r.tags, ...r.mood, ...r.subjects, r.filename, r.campaign].join(' ').toLowerCase();
          let matchScore = 0;
          queryWords.forEach(word => { if (allText.includes(word)) matchScore += 1; });
          return { ...r, matchScore };
        }).filter(r => r.matchScore > 0);
        filtered.sort((a, b) => b.matchScore !== a.matchScore ? b.matchScore - a.matchScore : b.confidence - a.confidence);
      }
      
      if (mood) filtered = filtered.filter(r => r.mood.includes(mood));
      if (campaign) filtered = filtered.filter(r => r.campaign === campaign);
      if (usage && showPro) filtered = filtered.filter(r => r.usage === usage);
      if (subjectFilter && showPro) filtered = filtered.filter(r => r.subjects.some(s => s.toLowerCase().includes(subjectFilter.toLowerCase())));
      if (!query.trim()) filtered.sort((a, b) => b.confidence - a.confidence);
      
      setResults(filtered);
      setIsSearching(false);
    }, 600);
  };

  const handleReset = () => {
    setQuery(''); setMood(''); setPhotographer(''); setChannel(''); setCampaign('');
    setClient(''); setUsage(''); setSubjectFilter(''); setResults(null); setSelectedAsset(null);
  };

  const generateClaudePrompt = () => {
    return `Search my Google Sheet "stock images" at:
https://docs.google.com/spreadsheets/d/1WjWMFSvHtUy3ghtHLyPggU52WApU1Xc3_JMU-Z0AgJU

Find assets matching:
Query: "${query || 'any'}"
${mood ? `Mood: ${mood}` : ''}
${photographer ? `Photographer: ${photographer}` : ''}
${showPro && channel ? `Channel: ${channel}` : ''}
${showPro && campaign ? `Campaign: ${campaign}` : ''}
${showPro && usage ? `Usage type: ${usage}` : ''}
${showPro && subjectFilter ? `Subject contains: ${subjectFilter}` : ''}

Return the best matches with:
1. Asset ID
2. Filename
3. Drive URL
4. Why it matches (reasoning)
5. Confidence score`;
  };

  const styles = {
    container: { fontFamily: "'Inter', -apple-system, sans-serif", background: '#0a0a0b', minHeight: '100vh', color: '#e4e4e7' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'white', fontWeight: 'bold' },
    logoText: { fontSize: '18px', fontWeight: '600', color: '#fff' },
    logoSubtext: { fontSize: '11px', color: 'rgba(255,255,255,0.4)' },
    versionBadge: { padding: '4px 10px', background: 'rgba(99,102,241,0.15)', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#818cf8' },
    main: { display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 'calc(100vh - 65px)' },
    searchPanel: { padding: '24px', borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto' },
    resultsPanel: { padding: '24px', overflowY: 'auto', background: 'rgba(255,255,255,0.01)' },
    sectionLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' },
    dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' },
    searchInput: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' },
    filterGroup: { marginBottom: '12px' },
    filterLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', display: 'block' },
    select: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' },
    input: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    proToggle: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' },
    proFilters: { padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.1)' },
    buttonRow: { display: 'flex', gap: '10px', marginBottom: '16px' },
    searchButton: { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    resetButton: { padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' },
    promptSection: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' },
    promptLabel: { fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' },
    promptPreview: { padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginBottom: '8px', maxHeight: '150px', overflowY: 'auto' },
    copyButton: { padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer', width: '100%' },
    resultCard: { padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', cursor: 'pointer', marginBottom: '12px', transition: 'all 0.15s' },
    resultCardSelected: { borderColor: '#6366f1', background: 'rgba(99,102,241,0.08)' },
    resultHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    resultRank: { fontSize: '12px', fontWeight: '700', color: '#6366f1' },
    resultId: { fontSize: '14px', fontWeight: '600', color: '#fff' },
    confidenceBadge: { marginLeft: 'auto', padding: '3px 8px', background: 'rgba(34,197,94,0.15)', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#4ade80' },
    resultFilename: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontFamily: 'monospace' },
    resultTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
    moodTag: { padding: '3px 8px', background: 'rgba(139,92,246,0.15)', borderRadius: '4px', fontSize: '11px', color: '#a78bfa' },
    subjectTag: { padding: '3px 8px', background: 'rgba(59,130,246,0.15)', borderRadius: '4px', fontSize: '11px', color: '#60a5fa' },
    resultReasoning: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', marginBottom: '12px' },
    driveLink: { display: 'inline-block', padding: '8px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontWeight: '500', color: '#818cf8', textDecoration: 'none' },
    detailPanel: { position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: '#111113', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '24px', overflowY: 'auto', zIndex: 100, boxShadow: '-10px 0 40px rgba(0,0,0,0.5)' },
    closeButton: { position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '16px', cursor: 'pointer' },
    detailPlaceholder: { width: '100%', height: '180px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', borderRadius: '12px', marginTop: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
    detailTitle: { fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
    detailFilename: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', marginBottom: '24px' },
    detailSection: { marginBottom: '20px' },
    detailLabel: { fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' },
    detailValue: { fontSize: '14px', color: 'rgba(255,255,255,0.8)' },
    detailTags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    tag: { padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' },
    detailReasoning: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', borderLeft: '3px solid #6366f1' },
    detailDriveButton: { display: 'block', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#fff', textAlign: 'center', textDecoration: 'none', marginTop: '24px', boxSizing: 'border-box' },
    emptyState: { textAlign: 'center', padding: '60px 40px' },
    emptyIcon: { fontSize: '48px', marginBottom: '16px' },
    emptyTitle: { fontSize: '16px', fontWeight: '500', color: '#fff', marginBottom: '8px' },
    emptyText: { fontSize: '13px', color: 'rgba(255,255,255,0.4)' },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>◈</div>
          <div>
            <div style={styles.logoText}>Light DAM</div>
            <div style={styles.logoSubtext}>Editorial OS</div>
          </div>
        </div>
        <span style={styles.versionBadge}>V1</span>
      </header>

      <div style={styles.main}>
        {/* LEFT: Search Panel */}
        <div style={styles.searchPanel}>
          <div style={styles.sectionLabel}><span style={styles.dot}></span>What do you need?</div>
          
          <input
            type="text"
            style={styles.searchInput}
            placeholder="e.g., travel photo with woman..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Mood</label>
            <select style={styles.select} value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Any mood</option>
              {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Photographer</label>
            <select style={styles.select} value={photographer} onChange={(e) => setPhotographer(e.target.value)}>
              <option value="">Any photographer</option>
              {PHOTOGRAPHERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={styles.proToggle} onClick={() => setShowPro(!showPro)}>
            <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: showPro ? '#6366f1' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: showPro ? '18px' : '2px', transition: 'left 0.2s' }}></div>
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Pro Filters</span>
          </div>

          {showPro && (
            <div style={styles.proFilters}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Channel</label>
                <select style={styles.select} value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="">Any channel</option>
                  {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Campaign</label>
                <select style={styles.select} value={campaign} onChange={(e) => setCampaign(e.target.value)}>
                  <option value="">Any campaign</option>
                  {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Client</label>
                <select style={styles.select} value={client} onChange={(e) => setClient(e.target.value)}>
                  <option value="">Any client</option>
                  {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Usage Rights</label>
                <select style={styles.select} value={usage} onChange={(e) => setUsage(e.target.value)}>
                  <option value="">Any</option>
                  {USAGE_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Subject Contains</label>
                <input type="text" style={styles.input} placeholder="e.g., woman" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} />
              </div>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button style={styles.searchButton} onClick={handleSearch}>{isSearching ? 'Searching...' : '🔍 Search'}</button>
            <button style={styles.resetButton} onClick={handleReset}>↺</button>
          </div>

          {/* Claude Prompt Section */}
          <div style={styles.promptSection}>
            <div style={styles.promptLabel}>Claude Prompt (Copy for Live Search)</div>
            <pre style={styles.promptPreview}>{generateClaudePrompt()}</pre>
            <button style={styles.copyButton} onClick={() => navigator.clipboard.writeText(generateClaudePrompt())}>
              📋 Copy Prompt to Clipboard
            </button>
          </div>
        </div>

        {/* CENTER: Results Panel */}
        <div style={styles.resultsPanel}>
          <div style={styles.sectionLabel}>
            <span style={styles.dot}></span>Results
            {results && <span style={{ marginLeft: 'auto', fontWeight: '400', textTransform: 'none', letterSpacing: 'normal' }}>{results.length} assets</span>}
          </div>

          {!results ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🖼️</div>
              <div style={styles.emptyTitle}>Search your assets</div>
              <div style={styles.emptyText}>Describe what you need, then click Search</div>
            </div>
          ) : results.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔍</div>
              <div style={styles.emptyTitle}>No matches found</div>
              <div style={styles.emptyText}>Try adjusting your filters</div>
            </div>
          ) : (
            results.map((asset, i) => (
              <div
                key={asset.asset_id}
                style={{ ...styles.resultCard, ...(selectedAsset?.asset_id === asset.asset_id ? styles.resultCardSelected : {}) }}
                onClick={() => setSelectedAsset(asset)}
              >
                <div style={styles.resultHeader}>
                  <span style={styles.resultRank}>#{i + 1}</span>
                  <span style={styles.resultId}>{asset.asset_id}</span>
                  <span style={styles.confidenceBadge}>{Math.round(asset.confidence * 100)}% match</span>
                </div>
                <div style={styles.resultFilename}>{asset.filename}</div>
                <div style={styles.resultTags}>
                  {asset.mood.map(m => <span key={m} style={styles.moodTag}>{m}</span>)}
                  {asset.subjects.map(s => <span key={s} style={styles.subjectTag}>{s}</span>)}
                </div>
                <div style={styles.resultReasoning}>💡 {asset.reasoning}</div>
                <a href={asset.drive_url} target="_blank" rel="noopener noreferrer" style={styles.driveLink} onClick={(e) => e.stopPropagation()}>Open in Drive →</a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Detail Panel (slides in) */}
      {selectedAsset && (
        <div style={styles.detailPanel}>
          <button style={styles.closeButton} onClick={() => setSelectedAsset(null)}>✕</button>
          <div style={styles.detailPlaceholder}>📷 {selectedAsset.asset_id}</div>
          <div style={styles.detailTitle}>{selectedAsset.asset_id}</div>
          <div style={styles.detailFilename}>{selectedAsset.filename}</div>
          
          <div style={styles.detailSection}>
            <div style={styles.detailLabel}>Tags</div>
            <div style={styles.detailTags}>{selectedAsset.tags.map(t => <span key={t} style={styles.tag}>{t}</span>)}</div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailLabel}>Photographer</div>
            <div style={styles.detailValue}>{selectedAsset.photographer}</div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailLabel}>Campaign</div>
            <div style={styles.detailValue}>{selectedAsset.campaign}</div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailLabel}>Usage</div>
            <div style={styles.detailValue}>{selectedAsset.usage}</div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailLabel}>AI Reasoning</div>
            <div style={styles.detailReasoning}>{selectedAsset.reasoning}</div>
          </div>
          
          <a href={selectedAsset.drive_url} target="_blank" rel="noopener noreferrer" style={styles.detailDriveButton}>Open in Google Drive</a>
        </div>
      )}
    </div>
  );
}
