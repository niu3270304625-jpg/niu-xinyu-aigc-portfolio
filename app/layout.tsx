import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "牛昕宇 | AIGC 影视项目主管",
  description:
    "牛昕宇个人作品集，聚焦 AIGC 影视项目统筹、剧本拆解、分镜提示词、角色一致性与 AI 影像生产流程搭建。",
  keywords: [
    "牛昕宇",
    "AIGC",
    "AI 影视",
    "影视项目主管",
    "分镜提示词",
    "角色一致性",
    "个人作品集",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
