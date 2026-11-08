import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { useAuth } from '../../../stores/AuthContext.jsx';
import { useProgress, ACHIEVEMENTS } from '../../../stores/ProgressContext.jsx';
import { circuitAPI } from '../../../services/api.js';
import { LEARNING_PATHS } from '../../../data/learningCurriculum.js';
import { EXERCISES, EXERCISE_CATEGORIES } from '../../../data/exercisesData.js';
import ExportCircuitModal from '../circuit-studio/ExportCircuitModal.jsx';

export default function MyWorkspacePage() {
  const nav = useNavigate();
  const { circ, setCirc } = useCircuit();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const {
    completedLessons,
    currentPosition,
    bookmarkedLessons,
    exerciseResults,
    unlockedAchievements,
    recentActivity,
    getOverallProgress,
    getPathProgress
  } = useProgress();

  const [activeTab, setActiveTab] = useState('learning'); // 'learning' | 'circuits'

  // Circuit Management State
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [saveName, setSaveName] = useState(circ.note?.name || 'My Quantum Circuit');
  const [saveDesc, setSaveDesc] = useState(circ.note?.description || '');
  const [saveTags, setSaveTags] = useState('quantum');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Export modal state for any circuit in the list
  const [exportTarget, setExportTarget] = useState(null);

  // Import modal / input state
  const [importJsonText, setImportJsonText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const overall = getOverallProgress();

  // Active path & lesson for continue learning
  const activePath = LEARNING_PATHS.find(p => p.id === currentPosition.pathId) || LEARNING_PATHS[0];
  const activeLesson = activePath.lessons.find(l => l.id === currentPosition.lessonId) || activePath.lessons[0];
  const activePathProgress = getPathProgress(activePath.id);

  // Fetch circuits
  const fetchCircuits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await circuitAPI.list({ search, tag: selectedTag });
      if (res.circuits) {
        setCircuits(res.circuits);
      }
    } catch (err) {
      console.warn('Failed to fetch from backend, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag]);

  useEffect(() => {
    fetchCircuits();
  }, [fetchCircuits, isAuthenticated]);

  const handleSaveCurrent = async () => {
    if (!saveName.trim()) {
      setMsg('Please enter a circuit title.');
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setSaving(true);
    setMsg('');
    try {
      const tagList = saveTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await circuitAPI.create({
        title: saveName.trim(),
        description: saveDesc.trim(),
        qubits: circ.n,
        ops: circ.ops,
        tags: tagList,
        isPublic: false
      });

      setMsg(`Circuit "${res.circuit.title}" saved to cloud!`);
      fetchCircuits();
    } catch (err) {
      setMsg(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadCircuit = item => {
    setCirc({
      n: item.qubits || item.n || 2,
      note: {
        name: item.title,
        description: item.description || `Loaded from user workspace (${item.ops?.length || 0} gates).`,
        expected: 'Ready for simulation in Circuit Studio',
        type: 'Cloud Circuit',
        level: 'Custom'
      },
      ops: [...(item.ops || [])]
    });
    nav('/studio');
  };

  const handleDeleteCircuit = async id => {
    if (!window.confirm('Are you sure you want to delete this circuit?')) return;
    try {
      await circuitAPI.delete(id);
      setCircuits(prev => prev.filter(c => (c._id || c.id) !== id));
      setMsg('Circuit deleted successfully.');
    } catch (err) {
      setMsg(`Failed to delete: ${err.message}`);
    }
  };

  const handleForkCircuit = async id => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await circuitAPI.fork(id);
      setMsg(`Forked circuit "${res.circuit.title}" to your workspace!`);
      fetchCircuits();
    } catch (err) {
      setMsg(`Failed to fork: ${err.message}`);
    }
  };

  const handleImportSubmit = async e => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    try {
      const parsed = JSON.parse(importJsonText);
      const res = await circuitAPI.import(parsed);
      setMsg(`Successfully imported circuit "${res.circuit.title}"!`);
      setImportJsonText('');
      setShowImport(false);
      fetchCircuits();
    } catch (err) {
      setMsg(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="w" style={{ paddingBottom: 60 }}>
      {/* Workspace Header - Personalized Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          {isAuthenticated && user?.username ? (
            <h1 style={{ margin: '0 0 6px', fontSize: 28, color: 'var(--t)', fontWeight: 700 }}>
              Hi, {user.username}!
            </h1>
          ) : (
            <h1 style={{ margin: '0 0 6px', fontSize: 28, color: 'var(--t)', fontWeight: 700 }}>
              My Quantum Workspace
            </h1>
          )}
          <p className="m" style={{ margin: 0, fontSize: 14 }}>
            Track your quantum learning journey, exercise achievements, saved circuit models, and cloud simulations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isAuthenticated ? (
            <button
              className="pri"
              onClick={() => openAuthModal('login')}
              style={{ fontSize: 12, padding: '7px 16px' }}
            >
              Sign In to Sync
            </button>
          ) : (
            <div className="mono" style={{ fontSize: 11, color: 'var(--c)', background: 'rgba(169, 154, 255, 0.1)', padding: '4px 10px', borderRadius: 4 }}>
              Account: {user.email}
            </div>
          )}
        </div>
      </div>

      {msg && (
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--c)',
            color: 'var(--c)',
            padding: '8px 14px',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{msg}</span>
          <button
            onClick={() => setMsg('')}
            style={{ background: 'transparent', border: 'none', color: 'var(--m)', cursor: 'pointer', fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--b)', paddingBottom: 10, marginBottom: 24 }}>
        <button
          className={activeTab === 'learning' ? 'pri' : ''}
          onClick={() => setActiveTab('learning')}
          style={{ fontSize: 13, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>📊 Learning &amp; Progress</span>
        </button>
        <button
          className={activeTab === 'circuits' ? 'pri' : ''}
          onClick={() => setActiveTab('circuits')}
          style={{ fontSize: 13, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>⚛️ Quantum Circuits &amp; Cloud Storage</span>
          {circuits.length > 0 && (
            <span
              className="mono"
              style={{
                fontSize: 10,
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1px 6px',
                borderRadius: 10
              }}
            >
              {circuits.length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LEARNING & PROGRESS HUB                            */}
      {/* ======================================================== */}
      {activeTab === 'learning' && (
        <div>
          {/* Key Metric Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 28
            }}
          >
            <div className="card" style={{ padding: '16px 20px', background: 'var(--p)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>CURRICULUM PROGRESS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--c)' }}>{overall.overallPercentage}%</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>({overall.completedLessons}/{overall.totalLessons} lessons)</span>
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px', background: 'var(--p)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>EXERCISES PASSED</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--ok)' }}>{overall.completedExercises}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>/ {overall.totalExercises} challenges</span>
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px', background: 'var(--p)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>ACHIEVEMENTS UNLOCKED</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#f9e2af' }}>{unlockedAchievements.length}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>/ {ACHIEVEMENTS.length} badges</span>
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px', background: 'var(--p)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>SAVED BOOKMARKS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--t)' }}>{bookmarkedLessons.length}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>lessons</span>
              </div>
            </div>
          </div>

          {/* Continue Learning Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 33, 49, 0.95), rgba(15, 23, 42, 0.95))',
              border: '1px solid var(--c)',
              borderRadius: 10,
              padding: 22,
              marginBottom: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--c)', background: 'rgba(169, 154, 255, 0.15)', padding: '2px 6px', borderRadius: 3, fontWeight: 600 }}>
                  CURRENT ACTIVE LESSON
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  {activePath.title}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--t)' }}>
                Lesson {activeLesson.number}: {activeLesson.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--m)' }}>
                {activeLesson.summary}
              </p>
            </div>

            <button
              className="pri"
              onClick={() => nav(`/learn/path/${activePath.id}/lesson/${activeLesson.id}`)}
              style={{ fontSize: 13, padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>Resume Lesson</span>
              <span>→</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
            {/* Left Column: Achievements & Bookmarked Lessons & Performance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Achievements Showcase */}
              <div className="card" style={{ background: 'var(--p)', padding: 22, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: '0 0 2px', fontSize: 16, color: 'var(--t)' }}>Quantum Achievements</h3>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--m)' }}>
                      Earn recognition badges by completing lessons, statevector challenges, and algorithms.
                    </p>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: '#f9e2af' }}>
                    {unlockedAchievements.length} of {ACHIEVEMENTS.length}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 12
                  }}
                >
                  {ACHIEVEMENTS.map(ach => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);

                    return (
                      <div
                        key={ach.id}
                        style={{
                          background: isUnlocked ? 'rgba(169, 154, 255, 0.08)' : 'var(--bg)',
                          border: isUnlocked ? '1px solid var(--c)' : '1px solid var(--b)',
                          borderRadius: 8,
                          padding: 14,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          opacity: isUnlocked ? 1 : 0.55
                        }}
                      >
                        <div style={{ fontSize: 24, flexShrink: 0 }}>{ach.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isUnlocked ? 'var(--t)' : 'var(--m)', marginBottom: 2 }}>
                            {ach.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--m)', lineHeight: 1.4 }}>
                            {ach.description}
                          </div>
                          <div className="mono" style={{ fontSize: 10, marginTop: 4, color: isUnlocked ? 'var(--ok)' : 'var(--m)' }}>
                            {isUnlocked ? '✓ Unlocked' : 'Locked'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bookmarked Lessons */}
              <div className="card" style={{ background: 'var(--p)', padding: 22, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: 'var(--t)' }}>Bookmarked Lessons</h3>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                    {bookmarkedLessons.length} saved
                  </span>
                </div>

                {bookmarkedLessons.length === 0 ? (
                  <p className="m" style={{ fontSize: 13, margin: '8px 0' }}>
                    You have not bookmarked any lessons yet. Click the "Bookmark" button inside any lesson to save it here for quick reference.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {bookmarkedLessons.map(lId => {
                      let foundPath = null;
                      let foundLesson = null;
                      for (const p of LEARNING_PATHS) {
                        const l = p.lessons.find(x => x.id === lId);
                        if (l) {
                          foundPath = p;
                          foundLesson = l;
                          break;
                        }
                      }
                      if (!foundLesson) return null;

                      return (
                        <div
                          key={lId}
                          style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--b)',
                            borderRadius: 6,
                            padding: '10px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span className="mono" style={{ fontSize: 10, color: 'var(--c)', marginRight: 6 }}>
                              {foundPath.title}
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--t)', fontWeight: 500 }}>
                              {foundLesson.title}
                            </span>
                          </div>
                          <Link
                            to={`/learn/path/${foundPath.id}/lesson/${foundLesson.id}`}
                            className="mono"
                            style={{ fontSize: 11, color: 'var(--c)', textDecoration: 'none' }}
                          >
                            Open Lesson →
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Exercise Performance Breakdown */}
              <div className="card" style={{ background: 'var(--p)', padding: 22, borderRadius: 10 }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 16, color: 'var(--t)' }}>
                  Exercise Performance by Category
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {EXERCISE_CATEGORIES.map(cat => {
                    const catExercises = EXERCISES.filter(e => e.category === cat.id);
                    const completedInCat = catExercises.filter(e => exerciseResults[e.id]?.completed).length;
                    const pct = catExercises.length > 0 ? Math.round((completedInCat / catExercises.length) * 100) : 0;

                    return (
                      <div key={cat.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }} className="mono">
                          <span style={{ color: 'var(--t)' }}>{cat.title}</span>
                          <span style={{ color: 'var(--c)' }}>{completedInCat} / {catExercises.length} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: pct === 100 ? 'var(--ok)' : 'var(--c)',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity Feed */}
            <div className="card" style={{ background: 'var(--p)', padding: 22, borderRadius: 10 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--t)' }}>Recent Activity</h3>
              <p style={{ margin: '0 0 14px', fontSize: 11, color: 'var(--m)' }}>
                Your chronological quantum milestones.
              </p>

              {recentActivity.length === 0 ? (
                <div className="mono m" style={{ fontSize: 12, padding: '16px 0', textAlign: 'center' }}>
                  No recent activity recorded yet. Start a lesson or solve an exercise to see your timeline!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentActivity.slice(0, 10).map(act => (
                    <div
                      key={act.id}
                      style={{
                        borderLeft: '2px solid var(--c)',
                        paddingLeft: 12,
                        paddingBottom: 4
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t)' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--m)', marginTop: 2 }}>
                        {act.detail}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--m)', marginTop: 2 }}>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: QUANTUM CIRCUITS & CLOUD STORAGE                   */}
      {/* ======================================================== */}
      {activeTab === 'circuits' && (
        <div>
          {/* JSON Circuit Import Drawer */}
          {showImport && (
            <div className="card" style={{ marginBottom: 16, borderColor: 'var(--c)' }}>
              <b style={{ color: 'var(--c)' }}>Import Quantum Circuit from JSON</b>
              <p className="m" style={{ fontSize: 11, margin: '4px 0 10px' }}>
                Paste raw Qubitry JSON or standard circuit export data below:
              </p>
              <form onSubmit={handleImportSubmit}>
                <textarea
                  rows="5"
                  required
                  placeholder='{ "qubits": 2, "ops": [{ "g": "H", "q": [0], "s": 0 }, { "g": "CX", "q": [0, 1], "s": 1 }] }'
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  style={{ width: '100%', fontFamily: 'JetBrains Mono', fontSize: 12, boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => setShowImport(false)} style={{ fontSize: 11 }}>
                    Cancel
                  </button>
                  <button type="submit" className="pri" style={{ fontSize: 11, padding: '4px 12px' }}>
                    Import Circuit
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button
              onClick={() => setShowImport(!showImport)}
              style={{ fontSize: 12, padding: '6px 14px' }}
            >
              {showImport ? '✕ Close Import' : '📥 Import JSON Circuit'}
            </button>
          </div>

          {/* Main Circuit Workspace Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
            {/* Saved Circuits List */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: 16, margin: 0 }}>Saved Circuits &amp; Experiments</h3>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ fontSize: 11, padding: '4px 8px', width: 220 }}
                />
              </div>

              {loading ? (
                <div className="mono m" style={{ fontSize: 12, padding: '20px 0', textAlign: 'center' }}>
                  Loading your quantum circuits from cloud database...
                </div>
              ) : circuits.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {circuits.map(item => {
                    const id = item._id || item.id;
                    const isOwner = user && (item.userId === user.id || item.userId === user._id);

                    return (
                      <div
                        key={id}
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--b)',
                          borderRadius: 8,
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 12
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <b style={{ color: 'var(--c)', fontSize: 14 }}>{item.title}</b>
                            {item.isPublic && (
                              <span className="tag" style={{ fontSize: 10, borderColor: 'var(--ok)', color: 'var(--ok)' }}>
                                Public
                              </span>
                            )}
                            {item.author && (
                              <span className="mono" style={{ fontSize: 10, color: 'var(--m)' }}>
                                by {item.author}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--t)' }}>
                              {item.description}
                            </p>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                              {item.qubits || item.n || 2} Qubits · {item.ops?.length || 0} Gates · {new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString()}
                            </span>

                            {item.tags?.map(t => (
                              <span
                                key={t}
                                onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                                className="tag"
                                style={{
                                  fontSize: 10,
                                  cursor: 'pointer',
                                  background: selectedTag === t ? 'var(--e)' : 'transparent'
                                }}
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Circuit Actions */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="pri"
                            style={{ fontSize: 11, padding: '4px 10px' }}
                            onClick={() => handleLoadCircuit(item)}
                            title="Open in interactive Circuit Studio"
                          >
                            Open in Studio →
                          </button>

                          <button
                            style={{ fontSize: 11, padding: '4px 8px', borderColor: 'var(--b)' }}
                            onClick={() => setExportTarget(item)}
                            title="Export circuit to QASM, Qiskit, or Cirq"
                          >
                            ⤓ Export
                          </button>

                          <button
                            style={{ fontSize: 11, padding: '4px 8px', borderColor: 'var(--b)' }}
                            onClick={() => handleForkCircuit(id)}
                            title="Fork a copy of this circuit"
                          >
                            ⑂ Fork
                          </button>

                          {isOwner && (
                            <button
                              style={{ fontSize: 11, padding: '4px 8px', borderColor: 'var(--er)', color: 'var(--er)' }}
                              onClick={() => handleDeleteCircuit(id)}
                              title="Delete from workspace"
                            >
                              ✕ Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⚛️</div>
                  <b style={{ color: 'var(--c)' }}>No quantum circuits found</b>
                  <p className="m" style={{ fontSize: 12, marginTop: 4 }}>
                    {search || selectedTag
                      ? 'No circuits match your filter. Clear search or tag to see all.'
                      : 'You have not saved any quantum circuits yet. Design a circuit in Studio and save it here!'}
                  </p>
                  {(search || selectedTag) && (
                    <button
                      style={{ fontSize: 11, marginTop: 8 }}
                      onClick={() => {
                        setSearch('');
                        setSelectedTag('');
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar: Active Studio State & Quick Cloud Save */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Active Studio Snapshot Card */}
              <div className="card">
                <b style={{ color: 'var(--c)', fontSize: 14 }}>Active Studio Circuit</b>
                <p className="m" style={{ fontSize: 11, margin: '4px 0 10px' }}>
                  The canvas currently holds a <b>{circ.n}-qubit</b> circuit with <b>{circ.ops.length}</b> gate(s).
                </p>

                <label style={{ display: 'block', fontSize: 11, color: 'var(--m)', marginBottom: 2 }}>
                  Circuit Name
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  style={{ width: '100%', fontSize: 12, marginBottom: 8, padding: '5px 8px', boxSizing: 'border-box' }}
                  placeholder="e.g. Variational Ansatz"
                />

                <label style={{ display: 'block', fontSize: 11, color: 'var(--m)', marginBottom: 2 }}>
                  Description
                </label>
                <textarea
                  rows="2"
                  value={saveDesc}
                  onChange={e => setSaveDesc(e.target.value)}
                  style={{ width: '100%', fontSize: 12, marginBottom: 8, padding: '5px 8px', boxSizing: 'border-box' }}
                  placeholder="Notes on circuit..."
                />

                <label style={{ display: 'block', fontSize: 11, color: 'var(--m)', marginBottom: 2 }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={saveTags}
                  onChange={e => setSaveTags(e.target.value)}
                  style={{ width: '100%', fontSize: 12, marginBottom: 12, padding: '5px 8px', boxSizing: 'border-box' }}
                  placeholder="ansatz, vqe, bell"
                />

                <button
                  className="pri"
                  disabled={saving}
                  style={{ width: '100%', fontSize: 12, padding: '8px' }}
                  onClick={handleSaveCurrent}
                >
                  {saving ? 'Saving to Cloud...' : '☁ Save to Cloud Workspace'}
                </button>
              </div>

              {/* Cloud Account Status Card */}
              <div className="card" style={{ background: 'var(--p)' }}>
                <b style={{ fontSize: 13, color: 'var(--t)' }}>Account Profile</b>
                {isAuthenticated ? (
                  <div style={{ marginTop: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--m)' }}>Logged in as:</span>
                      <b style={{ color: 'var(--c)' }}>{user?.username}</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: 'var(--m)' }}>Email:</span>
                      <span className="mono" style={{ fontSize: 11 }}>{user?.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--m)' }}>Role:</span>
                      <span className="tag" style={{ fontSize: 10 }}>{user?.role || 'user'}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 8, fontSize: 12 }}>
                    <p className="m" style={{ fontSize: 11, margin: '0 0 10px' }}>
                      You are currently in guest mode. Sign in to enable persistent cloud synchronization across devices.
                    </p>
                    <button
                      className="pri"
                      style={{ width: '100%', fontSize: 11 }}
                      onClick={() => openAuthModal('login')}
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal for selected circuit in list */}
      {exportTarget && (
        <ExportCircuitModal
          isOpen={!!exportTarget}
          onClose={() => setExportTarget(null)}
          circ={{
            n: exportTarget.qubits || exportTarget.n || 2,
            note: { name: exportTarget.title, description: exportTarget.description },
            ops: exportTarget.ops || []
          }}
          shots={exportTarget.shots || 1024}
        />
      )}
    </div>
  );
}
