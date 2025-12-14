import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import Layout from "../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "日本気候データベース | Japan Climate Database",
  description:
    "日本全国1300地点の気温・降水量・日照時間・WBGT（暑さ指数）を地図とグラフで比較。気象庁の平年値データを基にした気候統計サイト",

  extends: vikeReact,

  prerender: true,
  ssr: false,
} satisfies Config;
