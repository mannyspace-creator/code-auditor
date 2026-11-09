'use client';

import { useState } from 'react';

const TEST_PRESETS = [
  {
    label: '-- Select a Preset Test Case (For Evaluators) --',
    language: 'javascript',
    focusMode: 'DEBUG LOGIC & SYNTAX',
    code: ''
  },
  {
    label: '1. SQL Injection Risk (Security)',
    language: 'javascript',
    focusMode: 'VULNERABILITY AUDIT',
    code: `const query = "SELECT * FROM users WHERE id = '" + req.query.id + "';";\ndb.query(query, (err, results) => {\n  if (err) throw err;\n  res.send(results);\n});`
  },
  {
    label: '2. Unbounded Memory Allocation (Complexity)',
    language: 'cpp',
    focusMode: 'PERFORMANCE & COMPLEXITY',
    code: `void processLeak() {\n    int* data = new int[1000000];\n    while(true) {\n        // Missing delete[] data and exit condition\n    }\n}`
  },
  {
    label: '3. Off-By-One & Null Pointer (Logic)',
    language: 'python',
    focusMode: 'DEBUG LOGIC & SYNTAX',
    code: `def calculate_averages(data_list):\n    total = 0\n    for i in range(0, len(data_list) + 1):\n        total += data_list[i]['score']\n    return total / len(data_list)`
  }
];

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [focusMode, setFocusMode] = useState('DEBUG LOGIC & SYNTAX');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value;
    setSelectedPreset(index);
    if (index !== '') {
      const preset = TEST_PRESETS[Number(index)];
      setCode(preset.code);
      setLanguage(preset.language);
      setFocusMode(preset.focusMode);
    }
  };

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api_review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, focusMode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze code.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">AI STATIC CODE AUDITOR</h1>
            <p className="text-gray-400 text-xs mt-1">
              Deterministic static code evaluation engine. Select your inspection mode and target language below to execute a strict,schema-validated code audit.
            </p>
          </div>
          <div className="border border-gray-800 bg-gray-950 p-3 text-right hidden sm:block">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Privacy & Pre-Filter</span>
            <span className="text-xs font-semibold text-gray-300">AST Pre-Filter + Zero-Knowledge Storage</span>
          </div>
        </div>

        {/* STEP 1: FOCUS MODE */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 1: Select Audit Focus Mode</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { mode: 'DEBUG LOGIC & SYNTAX', desc: 'Scan raw execution trees for off-by-one errors and loop failures.' },
              { mode: 'PERFORMANCE & COMPLEXITY', desc: 'Calculate exact time and space bounds and algorithmic bottlenecks.' },
              { mode: 'VULNERABILITY AUDIT', desc: 'Inspect for injection risks, memory leaks, and unsafe pointers.' },
              { mode: 'CLEAN CODE REFACTORING', desc: 'Rewrite un-idiomatic logic into production-grade architecture.' }
            ].map((item) => (
              <div
                key={item.mode}
                onClick={() => setFocusMode(item.mode)}
                className={`p-4 border cursor-pointer transition-all ${
                  focusMode === item.mode
                    ? 'border-white bg-gray-900 text-white'
                    : 'border-gray-800 bg-black text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                <h3 className="text-sm font-bold tracking-wide">{item.mode}</h3>
                <p className="text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STEP 2: TARGET LANGUAGE */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 2: Target Language</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-black border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-white"
          >
            <option value="javascript">JavaScript / TypeScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="sql">SQL / MySQL</option>
          </select>
        </section>

        {/* EVALUATOR PRESET SELECTOR */}
        <section className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400">
            Quick Test Case Presets (For Evaluation)
          </label>
          <select
            value={selectedPreset}
            onChange={handleSelectPreset}
            className="w-full bg-gray-950 border border-emerald-900/60 rounded p-3 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
          >
            {TEST_PRESETS.map((preset, idx) => (
              <option key={idx} value={idx === 0 ? '' : idx}>
                {preset.label}
              </option>
            ))}
          </select>
        </section>

        {/* STEP 3: SOURCE CODE */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 3: Source Code</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Select a preset above or paste your source code here..."
            className="w-full h-64 bg-black border border-gray-800 rounded p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-white resize-y"
          />
        </section>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleAudit}
          disabled={loading || !code.trim()}
          className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Executing Static Analysis...' : 'Execute Code Audit'}
        </button>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="p-4 border border-red-900 bg-red-950/30 text-red-300 text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        {/* RESULT DISPLAY */}
        {result && (
          <section className="space-y-6 border-t border-gray-800 pt-6 font-mono">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">Inspection Result Analysis</h2>
              <span className="px-3 py-1 bg-black border border-gray-800 text-xs text-emerald-400 font-mono">
                Score: {result.score}/100
              </span>
            </div>

            <div className="space-y-4">
              {/* 1. Problem */}
              <div className="p-4 border border-gray-800 bg-black rounded space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">1. Problem</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{result.summary}</p>
              </div>

              {/* 2. Effect */}
              <div className="p-4 border border-gray-800 bg-black rounded space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">2. Effect & Complexity</h3>
                <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                  {result.issues?.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-500 mt-2">Bounds: {result.complexity}</p>
              </div>

              {/* 3. Solution */}
              <div className="p-4 border border-gray-800 bg-black rounded space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">3. Solution</h3>
                <pre className="p-4 bg-black border border-gray-900 rounded text-xs text-emerald-400 overflow-x-auto">
                  {result.refactored_code}
                </pre>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}