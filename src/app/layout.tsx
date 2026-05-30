import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: "Linguaplanet | Where Success Becomes a Habit",
  description: "Empowering language learners in Egypt with world-class English education and professional soft skills training.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo/logo-icon.jpg?v=2",
    apple: "/images/logo/logo-icon.jpg?v=2",
  },
  themeColor: "#011627",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Linguaplanet",
  },
};

import AOSInitializer from "@/components/AOSInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body style={{ margin: 0 }}>
        <AOSInitializer />
        <UserProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
