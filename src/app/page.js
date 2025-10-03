import { getCurrentSession } from "../lib/session";
import AuthComponent from "../components/AuthComponent";
export default async function Home() {
  const session = await getCurrentSession();
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Мое приложение с аутентификацией
        </h1>
        <p className="text-gray-600 mb-8">
          App Router + NextAuth.js + Multiple Providers
        </p>
        <AuthComponent session={session} />
        {session && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Отладочная
              информация:</h3>
            <pre className="text-sm bg-white p-3 rounded border">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}