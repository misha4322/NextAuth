import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/session";
import { SessionInfo } from "../../components/Sessioninfo";

export default async function SessionInfoPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Информация о сессии
          </h1>
          <p className="text-gray-600 mb-8">
            Подробная информация о вашей сессии и JWT токене
          </p>
          
          <SessionInfo session={session} />
        </div>
      </div>
    </div>
  );
}