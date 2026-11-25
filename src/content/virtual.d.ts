declare module 'virtual:lesson-index' {
  const index: { id: string; title: string; summary: string; practice: string[]; file: string }[];
  export default index;
}

declare module 'virtual:prep-index' {
  const index: { id: string; title: string; summary: string; file: string; space: string; questions: number }[];
  export default index;
}

declare module 'virtual:problem-index' {
  const index: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    lc150: boolean;
    c: boolean;
    file: string;
  }[];
  export default index;
}
