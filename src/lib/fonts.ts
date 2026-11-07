import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/pretendard/Pretendard-Regular.subset.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Medium.subset.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-SemiBold.subset.woff2",
      weight: "600",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Bold.subset.woff2",
      weight: "700",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Black.subset.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  preload: false,
  variable: "--font-pretendard-local",
});
