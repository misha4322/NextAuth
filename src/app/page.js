import { getCurrentSession } from "../lib/session";
import AuthComponent from "../components/AuthComponent";
import Link from "next/link";

export default async function Home() {
  const session = await getCurrentSession();

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🔐 NextAuth.js с App Router
          </h1>
          {session && (
            <div className="flex gap-4">
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📊 Кабинет
              </Link>
              <Link 
                href="/session-info"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                🔍 Сессия
              </Link>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-8 text-lg">
          Изучаем сессии, JWT и стратегии аутентификации
        </p>
        
        <AuthComponent session={session} />
        
        {/* Дополнительная информация */}
        {session && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow border">
              <h3 className="font-semibold mb-2">Тип сессии</h3>
              <p className="text-sm text-gray-600">JWT Token</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow border">
              <h3 className="font-semibold mb-2">Время жизни</h3>
              <p className="text-sm text-gray-600">30 дней</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow border">
              <h3 className="font-semibold mb-2">Провайдер</h3>
              <p className="text-sm text-gray-600 capitalize">{session.provider}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}