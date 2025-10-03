"use client";
import { signIn, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function SignIn() {
    const router = useRouter();
    useEffect(() => {
        // Проверяем, не вошел ли пользователь уже
        getSession().then(session => {
            if (session) {
                router.push("/");
            }
        });
    }, [router]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-
md">
                <h1 className="text-2xl font-bold text-center mb-6">Вход в
                    систему</h1>
                <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                    <span>Войти через Google</span>
                </button>
                <div className="mt-4 text-center">
                    <a href="/" className="text-blue-500 hover:text-blue-600">
                        ← Назад на главную
                    </a>
                </div>
            </div>
        </div>
    );
}