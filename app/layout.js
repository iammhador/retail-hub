import "./globals.css";
import toast, { Toaster } from "react-hot-toast";
export const metadata = {
  title: {
    default: "RetailHub: Track and Manage Your Retailers",
    template: "%s | RetailHub",
  },
  description:
    "Streamline your retail business management with comprehensive retailer tracking and insights",
  keywords: [
    "retailer management",
    "business tracking",
    "retail operations",
    "business intelligence",
  ],
  authors: [{ name: "Mehedy Hasan Ador" }],
  creator: "Mehedy Hasan Ador",
  publisher: "NEXT BUDDY",
  generator: "Next.js",
  applicationName: "RetailHub",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  openGraph: {
    title: "RetailHub: Retailer Management System",
    description:
      "Streamline your retail business management with comprehensive retailer tracking and insights",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetailHub: Retailer Management System",
    description:
      "Streamline your retail business management with comprehensive retailer tracking and insights",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="bg-blue-50 text-gray-900 font-sans leading-normal tracking-normal min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </div>
        <footer className="bg-blue-100 py-6 mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center text-blue-800">
            <p className="text-sm">
              © {new Date().getFullYear()} RetailHub. Developed by{" "}
              <a
                href="https://iammhador.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Mehedy Hasan Ador
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
