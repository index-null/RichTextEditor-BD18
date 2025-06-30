export const useTheme = () => {
  const colorMode = useColorMode()
  
  // 动态加载暗色主题CSS
  const loadDarkTheme = () => {
    const darkCssId = 'arco-dark-theme'
    
    // 检查是否已经加载
    if (document.getElementById(darkCssId)) {
      return
    }
    
    // 创建并加载暗色主题CSS
    const link = document.createElement('link')
    link.id = darkCssId
    link.rel = 'stylesheet'
    link.href = '/assets/css/arco-dark.css'
    document.head.appendChild(link)
  }

  // 移除暗色主题CSS
  const removeDarkTheme = () => {
    const darkCss = document.getElementById('arco-dark-theme')
    if (darkCss) {
      darkCss.remove()
    }
  }
  
  // 初始化主题
  const initTheme = () => {
    if (import.meta.client) {
      if (colorMode.value === 'dark') {
        document.body.setAttribute('arco-theme', 'dark')
        loadDarkTheme()
      } else {
        document.body.removeAttribute('arco-theme')
        removeDarkTheme()
      }
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = colorMode.value === 'dark' ? 'light' : 'dark'
    colorMode.preference = newTheme
    
    // 立即应用主题变化
    nextTick(() => {
      initTheme()
    })
  }

  // 监听主题变化
  watch(() => colorMode.value, () => {
    initTheme()
  }, { immediate: true })

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