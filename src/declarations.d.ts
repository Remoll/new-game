declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.dlg' {
  const content: string;
  export default content;
}

declare module '*.dlg?raw' {
  const content: string;
  export default content;
}
