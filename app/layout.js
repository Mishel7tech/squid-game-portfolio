import "./globals.css";
export const metadata = { title: "Mohmad Sohilkhan Baloch | AI & Full-Stack Developer", description: "Game-show 3D portfolio built with Next.js" };
export default function RootLayout({ children }) {
  return (<html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@500;700&display=swap" rel="stylesheet" /></head><body>{children}</body></html>);
}
