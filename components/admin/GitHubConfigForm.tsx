import React, { useState } from 'react';
import { Cloud, RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GitHubConfig } from '../../types';
import { testGitHubConnection } from '../../lib/github';

interface GitHubConfigFormProps {
  initialConfig: GitHubConfig;
  onSave: (config: GitHubConfig) => void;
  onReset: () => void;
}

const GitHubConfigForm: React.FC<GitHubConfigFormProps> = ({ initialConfig, onSave, onReset }) => {
  const [repoConfig, setRepoConfig] = useState<GitHubConfig>(initialConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim values to avoid accidental spaces from copy-pasting
    onSave({
        username: repoConfig.username.trim(),
        repo: repoConfig.repo.trim(),
        branch: repoConfig.branch.trim(),
        token: repoConfig.token.trim()
    });
  };

  const handleTest = async () => {
    const cfg: GitHubConfig = {
        username: repoConfig.username.trim(),
        repo: repoConfig.repo.trim(),
        branch: repoConfig.branch.trim(),
        token: repoConfig.token.trim()
    };
    if (!cfg.username || !cfg.repo || !cfg.branch || !cfg.token) {
        setTestResult({ ok: false, message: 'Please fill in all fields before testing.' });
        return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testGitHubConnection(cfg);
    setIsTesting(false);
    if (result.ok) {
        setTestResult({ ok: true, message: `✅ Connection successful! site-data.json found in ${cfg.username}/${cfg.repo}@${cfg.branch}.` });
    } else {
        setTestResult({ ok: false, message: `❌ ${result.error}` });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Cloud className="text-indigo-400" /> GitHub Configuration
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
           ភ្ជាប់ GitHub repo ដើម្បីរក្សាទុក Telegram Config នៅក្នុង <code className="bg-gray-800 px-1 rounded text-indigo-300">site-data.json</code>។<br/>
           PAT Token ត្រូវការ scope: <code className="bg-gray-800 px-1 rounded text-indigo-300">repo</code> (contents write)。Token ត្រូវបានរក្សាតែក្នុង browser localStorage ប៉ុណ្ណោះ។
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">GitHub Username</label>
              <input className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={repoConfig.username} onChange={(e) => setRepoConfig({ ...repoConfig, username: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Repository Name</label>
              <input className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={repoConfig.repo} onChange={(e) => setRepoConfig({ ...repoConfig, repo: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Branch Name</label>
            <input className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={repoConfig.branch} onChange={(e) => setRepoConfig({ ...repoConfig, branch: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Personal Access Token (PAT)</label>
            <input type="password" className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="ghp_..." value={repoConfig.token} onChange={(e) => setRepoConfig({ ...repoConfig, token: e.target.value })} />
          </div>

          <button type="submit" className="w-full py-3 bg-white text-gray-950 font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Save Configuration
          </button>

          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isTesting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isTesting ? 'Testing...' : '🔍 Test Connection'}
          </button>

          {testResult && (
            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${testResult.ok ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {testResult.ok
                ? <CheckCircle size={16} className="shrink-0 mt-0.5" />
                : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
              {testResult.message}
            </div>
          )}
        </form>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-white mb-4">លុប GitHub Config</h4>
        <button onClick={onReset} className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 w-full justify-center">
          <RotateCcw size={16} /> លុបការភ្ជាប់ GitHub
        </button>
      </div>
    </div>
  );
};
export default GitHubConfigForm;
