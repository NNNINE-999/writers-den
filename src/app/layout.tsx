import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";

export const metadata: Metadata = {
  title: "Writers' Den — 分享你的文字",
  description: "一个温暖的创作分享平台，属于你的文字小窝",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="text-stone-800 min-h-screen antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-warm-200 py-8 mt-16">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-stone-400">
            Writers&apos; Den &copy; {new Date().getFullYear()} — 属于大家的文字角落
          </div>
        </footer>
      </body>
    </html>
  );
}
