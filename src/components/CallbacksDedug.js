"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, update } from "next-auth/react";

export function CallbacksDebug({ session }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 20)); // Храним только последние 20 логов
  };

  const handleTestSignIn = async () => {
    setIsLoading(true);
    addLog('🔄 Начало процесса входа...', 'warning');
    
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: '/debug/callbacks'
    });

    if (result?.error) {
      addLog(`❌ Ошибка входа: ${result.error}`, 'error');
    } else {
      addLog('✅ Вход выполнен успешно', 'success');
    }
    
    setIsLoading(false);
  };

  const handleTestUpdate = async () => {
    addLog('🔄 Запрос обновления сессии...', 'warning');
    
    await update({
      ...session,
      user: {
        ...session.user,
        lastManualUpdate: new Date().toISOString()
      }
    });
    
    addLog('✅ Сессия обновлена', 'success');
    window.location.reload();
  };

  const handleTestSignOut = async () => {
    addLog('🔄 Начало процесса выхода...', 'warning');
    
    await signOut({ redirect: false });
    addLog('✅ Выход выполнен', 'success');
    window.location.reload();
  };

  // Эмулируем логи из серверной части
  useEffect(() => {
    addLog('📋 Session callback выполнен');
    addLog('🔐 JWT callback выполнен');
    addLog('🚪 SignIn callback выполнен');
  }, []);

  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Тестирование Callbacks
        </h2>
        
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleTestSignIn}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Вход...' : 'Тест Входа'}
          </button>
          
          <button
            onClick={handleTestUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Тест Обновления
          </button>
          
          <button
            onClick={handleTestSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Тест Выхода
          </button>
        </div>
      </div>

      {/* Информация о сессии */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Текущая сессия
        </h2>
        <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {/* Логи */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Логи Callbacks
        </h2>
        
        <div className="space-y-2 max-h-96 overflow-auto">
          {logs.map(log => (
            <div
              key={log.id}
              className={`p-3 rounded text-sm font-mono ${
                log.type === 'error' ? 'bg-red-900 text-red-200' :
                log.type === 'success' ? 'bg-green-900 text-green-200' :
                log.type === 'warning' ? 'bg-yellow-900 text-yellow-200' :
                'bg-gray-700 text-gray-200'
              }`}
            >
              <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Схема работы callbacks */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Схема работы Callbacks
        </h2>
        
        <div className="text-gray-300 space-y-2 text-sm">
          <div>1. <strong>signIn()</strong> → Проверяет можно ли пользователю войти</div>
          <div>2. <strong>jwt()</strong> → Создает/обновляет JWT токен</div>
          <div>3. <strong>session()</strong> → Формирует данные сессии для клиента</div>
          <div>4. <strong>redirect()</strong> → Управляет перенаправлениями</div>
          <div>5. <strong>events</strong> → Дополнительные события</div>
        </div>
      </div>
    </div>
  );
}
