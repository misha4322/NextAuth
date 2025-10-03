import { redirect } from "next/navigation";
import { getCurrentSession } from "../../../lib/session";
import { CallbacksDebug } from "../../../components/CallbacksDebug";

export default async function CallbacksDebugPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          🐛 Отладка Callbacks
        </h1>
        <p className="text-gray-400 mb-8">
          Реальное время выполнения callback функций
        </p>
        
        <CallbacksDebug session={session} />
      </div>
    </div>
  );
}
