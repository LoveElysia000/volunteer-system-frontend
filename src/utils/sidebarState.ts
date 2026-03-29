export const getExpandedKeysForRoute = (
  currentPath: string,
  parentItems: Array<{ key: string; children?: Array<{ to?: string }> }>,
  isCompactSidebar: boolean
) => {
  if (isCompactSidebar) {
    return [] as string[]
  }

  return parentItems
    .filter((parentItem) => (
      parentItem.children?.some((child) => (
        Boolean(child.to) && (currentPath === child.to || currentPath.startsWith(`${child.to}/`))
      ))
    ))
    .map((parentItem) => parentItem.key)
}

export const toggleExpandedKey = (currentKeys: string[], key: string) => {
  if (currentKeys.includes(key)) {
    return currentKeys.filter((item) => item !== key)
  }

  return [key]
}
