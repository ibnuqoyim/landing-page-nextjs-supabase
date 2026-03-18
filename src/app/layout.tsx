import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Kudapanmu_ya - Sourdough, Kombucha & Kimchi",
  description: "Fermented with Love, Baked with Passion. Temukan kelezatan autentik sourdough artisan, kombucha segar, dan kimchi homemade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased font-lato`}
      >
        <CartProvider>
          <Navigation />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
