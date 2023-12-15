import StyleXWebpackPlugin from "@stylexjs/webpack-plugin";
import path from "path";

export default function (context, options) {
  console.log({ context });
  // console.log({ StyleXWebpackPlugin });

  return {
    name: "stylex-docusaurus",
    configureWebpack(config, isServer, utils) {
      console.log("configureWebpack");
      const dev = config.mode === "development";

      return {
        plugins: [
          new StyleXWebpackPlugin({
            dev,
            genConditionalClasses: true,
            treeshakeCompensation: true,
            unstable_moduleResolution: {
              type: "commonJS",
              rootDir: context.siteDir,
            },
            filename: path.join(context.outDir, "stylex.css"),
          }),
        ],
      };
    },
  };
}
