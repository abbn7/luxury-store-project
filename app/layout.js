import './globals.css';

export const metadata = {
  title: 'Luxe Store — فاخر ومميز',
  description: 'متجر فاخر للمنتجات الراقية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
