import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/pretendard/Pretendard-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Medium.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-SemiBold.woff2",
      weight: "600",
    },
    { path: "../assets/fonts/pretendard/Pretendard-Bold.woff2", weight: "700" },
    {
      path: "../assets/fonts/pretendard/Pretendard-Black.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  preload: false,
  variable: "--font-pretendard-local",
});
