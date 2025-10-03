import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Доступ запрещен
        </h1>
        <p className="text-gray-600 mb-6">
          У вас недостаточно прав для просмотра этой страницы.
        </p>
        <Link 
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
