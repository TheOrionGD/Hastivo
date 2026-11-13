declare module 'split-type' {
  export interface SplitTypeOptions {
    absolute?: boolean;
    tagName?: string;
    lineClass?: string;
    wordClass?: string;
    charClass?: string;
    splitClass?: string;
    types?: string;
    linesClass?: string;
    wordsClass?: string;
    charsClass?: string;
  }

  export default class SplitType {
    constructor(target: string | Element | NodeList | Element[], options?: SplitTypeOptions);
    lines: HTMLElement[] | null;
    words: HTMLElement[] | null;
    chars: HTMLElement[] | null;
    revert(): void;
    split(options?: SplitTypeOptions): void;
  }
}

