import './globals.css';

export const metadata = {
  title: 'Luxe Store',
  description: 'متجر إلكتروني فاخر',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
        }} />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0c0c0c] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
