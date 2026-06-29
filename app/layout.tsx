import type { Metadata } from "next"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WhatsAppWidget } from "@/components/whatsapp-widget"

export const metadata: Metadata = {
    title: "ATCON Construction",
    description: "Building the future with excellence",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <WhatsAppWidget />
                </ThemeProvider>
            </body>
        </html>
    )
}
