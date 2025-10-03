import { redirect } from "next/navigation";
import { getCurrentSession } from "../../../lib/session";
import { UsersList } from "../../../components/UsersList";

// Mock данные - в реальном приложении брать из БД
const mockUsers = [
  {
    id: "1",
    name: "Иван Иванов",
    email: "ivan@gmail.com",
    role: "user",
    provider: "google",
    loginCount: 5,
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: "2", 
    name: "Петр Петров",
    email: "petr@github.com",
    role: "admin",
    provider: "github",
    loginCount: 12,
    createdAt: "2024-01-10T14:30:00.000Z"
  }
];

export default async function UsersPage() {
  const session = await getCurrentSession();

  // Проверяем права доступа
  if (!session || session.user.role !== 'admin') {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                👥 Управление пользователями
              </h1>
              <p className="text-gray-600 mt-2">
                Админ-панель для управления пользователями системы
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Вы вошли как: <strong>{session.user.name}</strong>
            </div>
          </div>

          <UsersList users={mockUsers} currentUser={session.user} />
        </div>
      </div>
    </div>
  );
}
