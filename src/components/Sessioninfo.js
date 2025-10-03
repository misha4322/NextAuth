"use client";

import { useState } from "react";
import { decodeJWT } from "../lib/token-utils";

export function SessionInfo({ session }) {
  const [showToken, setShowToken] = useState(false);

  // В реальном приложении не показываем токен!
  // Это только для демонстрации
  const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const decodedToken = decodeJWT(demoToken);

  return (
    <div className="space-y-6">
      {/* Информация о сессии */}
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          📋 Данные сессии
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Пользователь:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>ID:</strong> {session.user.id}</p>
          </div>
          <div>
            <p><strong>Провайдер:</strong> {session.provider}</p>
            <p><strong>Роль:</strong> {session.user.role}</p>
            <p><strong>Истекает:</strong> {new Date(session.expires).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Информация о JWT */}
      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          🔐 JWT Токен (демо)
        </h2>
        
        <button
          onClick={() => setShowToken(!showToken)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {showToken ? "Скрыть токен" : "Показать структуру JWT"}
        </button>

        {showToken && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Структура JWT:</h3>
              <div className="bg-white p-3 rounded border text-xs font-mono">
                <div className="text-red-500">header. payload. signature</div>
                <div className="mt-1">
                  {demoToken.split('.').map((part, index) => (
                    <div key={index} className="mb-1">
                      <span className="font-semibold">
                        {index === 0 ? 'Header:' : index === 1 ? 'Payload:' : 'Signature:'}
                      </span> {part}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Декодированный Payload:</h3>
              <pre className="bg-white p-3 rounded border text-xs overflow-auto">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Сравнение стратегий */}
      <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          ⚖️ Сравнение стратегий сессий
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600 mb-2">JWT Strategy</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Быстрая производительность</li>
              <li>✅ Легко масштабировать</li>
              <li>✅ Не требует базы данных</li>
              <li>❌ Нельзя отозвать сессию</li>
              <li>❌ Ограниченный размер данных</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-blue-600 mb-2">Database Strategy</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Полный контроль над сессиями</li>
              <li>✅ Можно отозвать сессии</li>
              <li>✅ Любые данные в сессии</li>
              <li>❌ Требует базу данных</li>
              <li>❌ Медленнее чем JWT</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Действия с сессией */}
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">
          🛠️ Действия с сессией
        </h2>
        
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Обновить страницу
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Перейти в кабинет
          </button>
        </div>
      </div>
    </div>
  );
}
