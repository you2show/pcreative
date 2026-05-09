import React, { useState } from 'react';
import { Cloud, RotateCcw, CheckCircle, AlertCircle, Loader2, Lock, ExternalLink } from 'lucide-react';
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
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Cloud className="text-indigo-400" /> GitHub Configuration
        </h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          ភ្ជាប់ GitHub repo ដើម្បីរក្សាទុក Telegram Config នៅក្នុង{' '}
          <code className="bg-gray-800 px-1 rounded text-indigo-300">site-data.json</code>
          {' '}ដូច្នេះ visitor ម្នាក់ក្រៅ browser ក៏អាចប្រើ Live Chat បាន។
        </p>

        {/* Security notice */}
        <div className="flex items-start gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 mb-5 text-xs text-indigo-300">
          <Lock size={14} className="shrink-0 mt-0.5" />
          <span>
            PAT Token ត្រូវការ scope:{' '}
            <code className="bg-gray-800 px-1 rounded font-bold">repo</code>{' '}
            (contents write) — Token <strong>ត្រូវបានរក្សាតែក្នុង browser localStorage</strong>{' '}
            ប៉ុណ្ណោះ។ មិនបានបញ្ជូនទៅ server ណាមួយឡើយ។
          </span>
        </div>

        {/* Step-by-step PAT guide */}
        <details className="mb-5 group">
          <summary className="cursor-pointer text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 select-none">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            {' '}របៀបបង្កើត PAT Token (ចុចដើម្បីពង្រីក)
          </summary>
          <ol className="mt-3 space-y-2 text-xs text-gray-400 pl-1">
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
              <span>
                ចូល{' '}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline inline-flex items-center gap-0.5"
                >
                  github.com/settings/tokens/new <ExternalLink size={10} />
                </a>
                {' '}(GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span>
                ដាក់ <strong>Note</strong> ណាមួយ ដូចជា <code className="bg-gray-800 px-1 rounded">pcreative-site-data</code>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span>
                ជ្រើស <strong>Expiration</strong> (អាចជា No expiration ក្នុង private project)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
              <span>
                ចុច checkbox{' '}
                <code className="bg-gray-800 px-1 rounded text-green-400 font-bold">✓ repo</code>{' '}
                (Full control of private repositories) — scope នេះអনុញ្ញាតអាន/សរសេរ contents
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">5</span>
              <span>
                ចុច <strong>Generate token</strong> ហើយ copy Token{' '}
                (<code className="bg-gray-800 px-1 rounded">ghp_…</code>)
                ដាក់ field <em>Personal Access Token</em> ខាងក្រោម
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">6</span>
              <span>
                ចុច <strong>🔍 Test Connection</strong> ដើម្បីផ្ទៀងផ្ទាត់ ហើយ <strong>Save Configuration</strong>
              </span>
            </li>
          </ol>
        </details>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">GitHub Username</label>
              <input
                className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. you2show"
                value={repoConfig.username}
                onChange={(e) => setRepoConfig({ ...repoConfig, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Repository Name</label>
              <input
                className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. pcreative"
                value={repoConfig.repo}
                onChange={(e) => setRepoConfig({ ...repoConfig, repo: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Branch Name</label>
            <input
              className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="main"
              value={repoConfig.branch}
              onChange={(e) => setRepoConfig({ ...repoConfig, branch: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
              <Lock size={11} className="text-gray-500" /> Personal Access Token (PAT)
              <span className="ml-auto text-[10px] font-normal text-gray-600">localStorage only · មិនបញ្ជូន server</span>
            </label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={repoConfig.token}
              onChange={(e) => setRepoConfig({ ...repoConfig, token: e.target.value })}
            />
            <p className="text-[10px] text-gray-600 mt-1">
              Required scope: <code className="bg-gray-800 px-1 rounded text-indigo-400">repo</code> (contents read + write)
            </p>
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
