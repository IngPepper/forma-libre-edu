import './globals.css'

export const metadata = {
  title: "Forma Libre",
  description: "Best website to get auto cad files for architecture"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
