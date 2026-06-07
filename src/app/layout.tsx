import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Sistema de Control de Convocatorias",
  description: "MVP rápido y consistente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
