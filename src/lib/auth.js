import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// Mock база данных для демонстрации
const mockUsersDB = new Map();

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],

  callbacks: {
    // ✅ Вызывается при попытке входа
    async signIn({ user, account, profile, email, credentials }) {
      console.log("🚪 signIn callback вызван:", {
        user: user?.email,
        provider: account?.provider,
        profileExists: !!profile,
        isNewUser: !mockUsersDB.has(user.email)
      });

      // 1. Проверяем домен email
        const allowedDomains = ['gmail.com', 'yahoo.com', 'github.com', 'yandex.ru'];
      const emailDomain = user.email.split('@')[1];
      
      if (!allowedDomains.includes(emailDomain)) {
        console.log("❌ Доступ запрещен для домена:", emailDomain);
        return false;
      }

      // 2. Проверяем провайдер (можно ограничить определенные провайдеры)
      if (account.provider === "google" && !profile.email_verified) {
        console.log("❌ Email не верифицирован");
        return false;
      }

      // 3. Регистрируем нового пользователя в "БД"
      if (!mockUsersDB.has(user.email)) {
        mockUsersDB.set(user.email, {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: account.provider,
          role: 'user',
          createdAt: new Date().toISOString(),
          loginCount: 0
        });
        console.log("✅ Новый пользователь зарегистрирован");
      }

      // 4. Обновляем счетчик входов
      const userData = mockUsersDB.get(user.email);
      userData.loginCount += 1;
      userData.lastLogin = new Date().toISOString();

      console.log("✅ Вход разрешен");
      return true;
    },

    // ✅ Вызывается при создании/обновлении JWT токена
    async jwt({ token, user, account, profile, trigger, session }) {
      console.log("🔐 jwt callback вызван:", {
        tokenUser: token?.email,
        newUser: user?.email,
        trigger: trigger
      });

      // 1. Первый вход - добавляем данные пользователя
      if (user) {
        const userData = mockUsersDB.get(user.email);
        token.id = userData.id;
        token.provider = account.provider;
        token.role = userData.role;
        token.loginCount = userData.loginCount;
        token.createdAt = userData.createdAt;
      }

      // 2. Обновление сессии из клиента
      if (trigger === "update" && session) {
        console.log("🔄 Обновление сессии:", session);
        // Можно обновить данные токена на основе session
        token.lastUpdated = new Date().toISOString();
      }

      // 3. Обновляем данные при каждом вызове
      if (token.email && mockUsersDB.has(token.email)) {
        const userData = mockUsersDB.get(token.email);
        token.loginCount = userData.loginCount;
      }

      return token;
    },

    // ✅ Вызывается когда клиент запрашивает сессию
    async session({ session, token, user }) {
      console.log("📋 session callback вызван:", {
        sessionUser: session.user?.email,
        tokenUser: token?.email
      });

      // 1. Добавляем данные из JWT в сессию
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.loginCount = token.loginCount;
        session.user.createdAt = token.createdAt;
        session.provider = token.provider;
        
        // 2. Добавляем мета-информацию
        session.meta = {
          tokenExpires: token.exp,
          lastUpdated: token.lastUpdated,
          isTokenValid: token.exp * 1000 > Date.now()
        };
      }

      // 3. Добавляем permissions на основе роли
      session.permissions = getPermissions(session.user.role);

      return session;
    },

    // ✅ Вызывается при всех перенаправлениях
    async redirect({ url, baseUrl }) {
      console.log("🔄 redirect callback вызван:", { url, baseUrl });

      // 1. Разрешаем только относительные URL или URL нашего домена
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      
      // 2. По умолчанию возвращаем на главную
      return baseUrl;
    },
  },

  // ✅ События - вызываются при определенных действиях
  events: {
    async signIn(message) {
      console.log("🎉 EVENT: Пользователь вошел:", message.user.email);
    },
    async signOut(message) {
      console.log("👋 EVENT: Пользователь вышел:", message.token?.email);
    },
    async createUser(message) {
      console.log("🆕 EVENT: Создан новый пользователь:", message.user.email);
    },
    async updateUser(message) {
      console.log("📝 EVENT: Пользователь обновлен:", message.user.email);
    },
    async linkAccount(message) {
      console.log("🔗 EVENT: Аккаунт привязан:", message.user.email);
    },
    async session(message) {
      console.log("📄 EVENT: Сессия активна:", message.session.user?.email);
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/welcome", // Страница для новых пользователей
  },
};

// Вспомогательная функция для permissions
function getPermissions(role) {
  const permissions = {
    user: ['read:profile', 'write:profile'],
    admin: ['read:profile', 'write:profile', 'read:users', 'write:users'],
    moderator: ['read:profile', 'write:profile', 'read:users']
  };
  return permissions[role] || permissions.user;
}
