declare module 'gray-matter' {
  interface GrayMatterFile {
    data: Record<string, any>;
    content: string;
    excerpt?: string;
    orig: string;
    language: string;
    matter: string;
    stringify(lang?: string): string;
  }

  function matter(input: string): GrayMatterFile;

  export = matter;
}
