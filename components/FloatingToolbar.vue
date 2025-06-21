<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top-start' }"
    class="floating-toolbar"
  >
    <AButtonGroup size="mini">
      <AButton :type="isBold ? 'primary' : 'secondary'" @click="toggleBold">
        <template #icon><Icon name="ri:bold" /></template>
      </AButton>
      <AButton :type="isItalic ? 'primary' : 'secondary'" @click="toggleItalic">
        <template #icon><Icon name="ri:italic" /></template>
      </AButton>
      <AButton :type="isUnderline ? 'primary' : 'secondary'" @click="toggleUnderline">
        <template #icon><Icon name="ri:underline" /></template>
      </AButton>
      <AButton :type="isStrike ? 'primary' : 'secondary'" @click="toggleStrike">
        <template #icon><Icon name="ri:strikethrough" /></template>
      </AButton>
      <ADivider direction="vertical" />
      <AButton :type="isHighlight ? 'primary' : 'secondary'" @click="toggleHighlight">
        <template #icon><Icon name="ri:mark-pen-line" /></template>
      </AButton>
      
      <ADropdown @select="(color: string) => setColor(color as string)">
        <AButton>
          <template #icon><Icon name="ri:font-color" /></template>
        </AButton>
        <template #content>
          <div class="color-grid">
            <ADGrid :cols="5" :col-gap="4" :row-gap="4">
              <ADGridItem
                v-for="color in commonColors"
                :key="color"
                class="color-swatch"
                :style="{ backgroundColor: color }"
                @click="setColor(color)"
              />
            </ADGrid>
            <AButton type="text" size="mini" style="margin-top: 8px;" @click="unsetColor">
              清除颜色
            </AButton>
          </div>
        </template>
      </ADropdown>

      <ADivider direction="vertical" />
      <AButton :type="isLink ? 'primary' : 'secondary'" @click="setLink">
        <template #icon><Icon name="ri:link" /></template>
      </AButton>
      <AButton v-if="isLink" @click="unsetLink">
        <template #icon><Icon name="ri:link-unlink" /></template>
      </AButton>
    </AButtonGroup>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { BubbleMenu, type Editor } from '@tiptap/vue-3'
import { useTiptapToolbar } from '~/composables/useTiptapToolbar'

const props = defineProps<{
  editor: Editor | undefined
}>()

const editorRef = toRef(props, 'editor')

const {
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  isHighlight,
  isLink,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  toggleHighlight,
  setLink,
  unsetLink,
  setColor,
  unsetColor,
} = useTiptapToolbar(editorRef)

const commonColors = [
  '#000000', '#F5222D', '#FA8C16', '#FADB14', '#52C41A',
  '#1677FF', '#722ED1', '#86909C', '#EB5757', '#27AE60',
]
</script>

<style scoped>
.floating-toolbar {
  display: flex;
  padding: 4px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.color-grid {
  padding: 8px;
  width: 150px;
}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}
.color-swatch:hover {
  transform: scale(1.1);
}
</style> 