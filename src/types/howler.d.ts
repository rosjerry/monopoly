declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[] | string;
      volume?: number;
      preload?: boolean;
      loop?: boolean;
      html5?: boolean;
    });
    play(id?: string | number): number;
    stop(id?: number): void;
    unload(): void;
    playing(id?: number): boolean;
  }
}
