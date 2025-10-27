import "./globals.css";
import "./globalproduct.css";
import { Toaster } from "@/components/ui/sonner"
import { ManRope } from "./ui/fonts";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ManRope.className}antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
