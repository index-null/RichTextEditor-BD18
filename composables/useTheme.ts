export const useTheme = () => {
  const colorMode = useColorMode()
  
  // 初始化主题
  const initTheme = () => {
    if (colorMode.value === 'dark') {
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.body.removeAttribute('arco-theme')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    initTheme()
  }

  // 监听主题变化
  watch(() => colorMode.value, () => {
    initTheme()
  })

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
  })

  return {
    theme: colorMode,
    toggleTheme,
    isDark: computed(() => colorMode.value === 'dark')
  }
} 