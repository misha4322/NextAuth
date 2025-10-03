import { redirect } from "next/navigation";
import { getCurrentSession, getCurrentUser } from "../../lib/session";
import { SignOutButton } from "../../components/SignOutButton";
export default async function Dashboard() {
    const session = await getCurrentSession();
    const user = await getCurrentUser();
    // Защита маршрута - редирект если не авторизован
    if (!session) {
        redirect("/auth/signin");
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-
indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Личный кабинет
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Добро пожаловать в защищенную зону!
                            </p>
                        </div>
                        <SignOutButton />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-green-50 rounded-xl border border-
green-200">
                            <h3 className="font-semibold text-green-800 mb-
2">Информация о пользователе</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>Имя:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Провайдер:</strong> <span
                                    className="capitalize">{session.provider}</span></p>
                            </div>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-
200">
                            <h3 className="font-semibold text-blue-800 mb-2">Статус
                                сессии</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>ID пользователя:</strong> {user.id}</p>
                                <p><strong>Сессия истекает:</strong> {new
                                    Date(session.expires).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <a
                            href="/"
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            ← Назад на главную
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}