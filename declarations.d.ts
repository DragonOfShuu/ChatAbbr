// import { ReactSVGElement } from "react";

declare type SVGRType = React.VFC<React.SVGProps<SVGSVGElement>>;

declare module "*.svg" {
    import React from "react";
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module "*.module.sass" {
    const styles: any;
    export default styles;
}