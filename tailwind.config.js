import { colors } from "./src/constants";

const makePxToRem = (num) => ({
  ...Array.from(Array(num + 1)).reduce((acc, cur, i) => {
    return { ...acc, [i]: `${(i / 16).toFixed(3)}rem` };
  }, {}),
});
``;
/** @type {import('tailwindcss').Config} */
// @ts-expect-error
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    colors: {
      primary: "#000",
      secondary: "#252525",
      white: colors.white,
      black: colors.black,
      transparent: "transparent",
      dark: colors.dark,
      gray: colors.gray,
      red: colors.red,
      pink: colors.pink,
      grape: colors.grape,
      violet: colors.violet,
      indigo: colors.indigo,
      blue: colors.blue,
      cyan: colors.cyan,
      teal: colors.teal,
      green: colors.green,
      lime: colors.lime,
      yellow: colors.yellow,
      orange: colors.orange,
    },
    fontFamily: { pretendard: ["Pretendard"] },
    extend: {
      borderWidth: makePxToRem(10), // px 단위로 작성하면 rem 단위로 바꿔주는 기능
      fontSize: makePxToRem(64), // text-16 이런식으로 쓰면 rem 단위로 바꿔서 적용됨 -> font-size: 1rem/* 16px */;
      lineHeight: {
        100: "100%",
        120: "120%",
        140: "140%",
        150: "150%",
        160: "160%",
        165: "165%",
        180: "180%",
      },
      dropShadow: { bottom: "0 5px 2.5px rgba(0, 0, 0, 0.15)" },
      spacing: makePxToRem(200),
      minWidth: makePxToRem(375),
      maxWidth: makePxToRem(375),
      minHeight: makePxToRem(375),
      maxHeight: makePxToRem(375),
      borderRadius: makePxToRem(10),
    },
    keyframes: {
      "fadein-down": {
        from: { transform: "translateY(-48px);", opacity: 0 },
        to: { transform: "translateY(0);", opacity: 1 },
      },
      fadein: { from: { opacity: 0 }, to: { opacity: 1 } },
      fadeout: { from: { opacity: 1 }, to: { opacity: 0 } },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
    animation: {
      "fadein-down": "fadein-down 0.3s",
      fadein: "fadein 0.2s",
      fadeout: "fadeout 0.3s",
      spin: "spin 1s linear infinite",
    },
  },
  plugins: [],
};
