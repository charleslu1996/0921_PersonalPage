import React from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export function LoadingState({ message = '正在從中央氣象署同步最新即時氣象資料...' }: { message?: string }) {
  return (
    <div className="loading-state-container">
      <div className="loading-spinner-box">
        <Loader2 size={44} className="animate-spin text-sky-400" />
      </div>
      <h3 className="loading-title">載入氣象資料中</h3>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export function ErrorMessage({
  title = '氣象資料取得失敗',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state-card">
      <div className="error-icon-box">
        <AlertTriangle size={36} className="text-rose-400" />
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry" id="btn-error-retry">
          <RefreshCw size={16} />
          <span>重新嘗試</span>
        </button>
      )}
    </div>
  );
}
