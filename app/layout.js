import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/navigation/NavBar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const recoleta = localFont({
    src: [
        {
            path: "/font/Recoleta-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "/font/Recoleta-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "/font/Recoleta-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "/font/Recoleta-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "/font/Recoleta-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "/font/Recoleta-Thin.ttf",
            weight: "100",
            style: "normal",
        },
        {
            path: "/font/RecoletaAlt-Regular.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "/font/RecoletaAlt-Bold.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "/font/RecoletaAlt-SemiBold.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "/font/RecoletaAlt-Medium.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "/font/RecoletaAlt-Light.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "/font/RecoletaAlt-Thin.ttf",
            weight: "100",
            style: "italic",
        },
    ],
});

export const metadata = {
    title: "Kildekritisk - Kilde tjekker",
    description: "Kildekritisk er en platform, der hjælper dig med at finde kildekritisk information på internettet.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${recoleta.className}`}>
                <NavBar />
                <Toaster position="bottom-center" reverseOrder={false} />
                <main className="min-h-screen container mx-auto flex items-center justify-center px-4">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
