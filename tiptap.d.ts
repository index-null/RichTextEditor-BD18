import '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    // Underline
    toggleUnderline: () => ReturnType
    // Strike
    toggleStrike: () => ReturnType
    // TextStyle & Color
    setColor: (color: string) => ReturnType
    unsetColor: () => ReturnType
    // Text Align
    setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => ReturnType
    // Highlight
    toggleHighlight: (options?: { color: string }) => ReturnType
    // Link
    setLink: (attributes: { href: string; target?: string | null }) => ReturnType
    unsetLink: () => ReturnType
    // Blockquote
    toggleBlockquote: () => ReturnType
    // Horizontal Rule
    setHorizontalRule: () => ReturnType
    // TaskList
    toggleTaskList: () => ReturnType

    // Commands from StarterKit are included by default in its own types
    // but we can declare them explicitly if needed for clarity or overrides
    toggleBold: () => ReturnType
    toggleItalic: () => ReturnType
    toggleHeading: (attributes: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => ReturnType
    toggleBulletList: () => ReturnType
    toggleOrderedList: () => ReturnType
    toggleCodeBlock: () => ReturnType
  }
} 