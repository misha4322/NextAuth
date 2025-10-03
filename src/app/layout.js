import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "../components/SessionProvider";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "My Auth App",
  description: "Authentication with NextAuth.js",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}