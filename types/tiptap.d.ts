import '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bold: {
      toggleBold: () => ReturnType
    }
    italic: {
      toggleItalic: () => ReturnType
    }
    underline: {
      toggleUnderline: () => ReturnType
    }
    strike: {
      toggleStrike: () => ReturnType
    }
    highlight: {
      toggleHighlight: (options?: { color?: string }) => ReturnType
    }
    textStyle: {
      setColor: (color: string) => ReturnType
      unsetColor: () => ReturnType
    }
    textAlign: {
      setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => ReturnType
    }
    link: {
      setLink: (attributes: { href: string; target?: string | null }) => ReturnType
      unsetLink: () => ReturnType
    }
    blockquote: {
      toggleBlockquote: () => ReturnType
    }
    horizontalRule: {
      setHorizontalRule: () => ReturnType
    }
    taskList: {
      toggleTaskList: () => ReturnType
    }
    heading: {
      toggleHeading: (attributes: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => ReturnType
    }
    bulletList: {
      toggleBulletList: () => ReturnType
    }
    orderedList: {
      toggleOrderedList: () => ReturnType
    }
    codeBlock: {
      toggleCodeBlock: () => ReturnType
    }
  }
} 