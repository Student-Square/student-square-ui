// Allow side-effect CSS imports (e.g. import "./globals.css")
declare module "*.css" {
  const styles: { readonly [key: string]: string };
  export default styles;
}
