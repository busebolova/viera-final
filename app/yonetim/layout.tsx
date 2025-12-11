import type React from "react"

export const metadata = {
  title: "Yönetim Paneli | VIERA Construction",
  robots: "noindex, nofollow",
}

export default function YonetimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        all: "initial",
        display: "block",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#18181b",
        color: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .yonetim-page * { box-sizing: border-box; }
            .yonetim-page input, .yonetim-page textarea, .yonetim-page select {
              font-family: inherit;
              font-size: 14px;
            }
            .yonetim-page button { cursor: pointer; font-family: inherit; }
            .yonetim-page::-webkit-scrollbar { width: 8px; }
            .yonetim-page::-webkit-scrollbar-track { background: #27272a; }
            .yonetim-page::-webkit-scrollbar-thumb { background: #52525b; border-radius: 4px; }
          `,
        }}
      />
      <div className="yonetim-page">{children}</div>
    </div>
  )
}
