// declarations.d.ts or images.d.ts

// 1. Declare the Module for PNG files
declare module '*.png' {
  // 2. Specify the type of the exported value
  const value: string;
  export default value;
}

// You can add other asset types here if needed (e.g., JPG, SVG)
declare module '*.jpg' {
  const value: string;
  export default value;
}