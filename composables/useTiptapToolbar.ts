import type { Editor } from '@tiptap/vue-3'
import { computed } from 'vue'

export function useTiptapToolbar(editor: Ref<Editor | undefined>) {
  const isBold = computed(() => editor.value?.isActive('bold'))
  const isItalic = computed(() => editor.value?.isActive('italic'))
  const isUnderline = computed(() => editor.value?.isActive('underline'))
  const isStrike = computed(() => editor.value?.isActive('strike'))
  const isHighlight = computed(() => editor.value?.isActive('highlight'))
  const isLink = computed(() => editor.value?.isActive('link'))
  const isBlockquote = computed(() => editor.value?.isActive('blockquote'))
  const isCodeBlock = computed(() => editor.value?.isActive('codeBlock'))
  const isBulletList = computed(() => editor.value?.isActive('bulletList'))
  const isOrderedList = computed(() => editor.value?.isActive('orderedList'))
  const isTaskList = computed(() => editor.value?.isActive('taskList'))

  const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
  const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run()
  const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
  const toggleHighlight = () => editor.value?.chain().focus().toggleHighlight().run()
  const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run()
  const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
  const toggleTaskList = () => editor.value?.chain().focus().toggleTaskList().run()

  const setLink = () => {
    const previousUrl = editor.value?.getAttributes('link').href
    const url = window.prompt('请输入链接URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const unsetLink = () => editor.value?.chain().focus().unsetLink().run()

  const setHorizontalRule = () => editor.value?.chain().focus().setHorizontalRule().run()

  const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.value?.chain().focus().setTextAlign(alignment).run()
  }
  
  const setColor = (color: string) => {
    editor.value?.chain().focus().setColor(color).run()
  }
  
  const unsetColor = () => {
    editor.value?.chain().focus().unsetColor().run()
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.value?.chain().focus().toggleHeading({ level }).run()
  }

  return {
    isBold,
    isItalic,
    isUnderline,
    isStrike,
    isHighlight,
    isLink,
    isBlockquote,
    isCodeBlock,
    isBulletList,
    isOrderedList,
    isTaskList,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    toggleHighlight,
    toggleBlockquote,
    toggleCodeBlock,
    toggleBulletList,
    toggleOrderedList,
    toggleTaskList,
    setLink,
    unsetLink,
    setHorizontalRule,
    setTextAlign,
    setColor,
    unsetColor,
    toggleHeading,
  }
} 