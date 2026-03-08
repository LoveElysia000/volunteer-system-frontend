// 路径匹配工具函数 - 用于侧边导航栏选中状态管理

/**
 * 检查菜单项是否应该显示为选中状态
 * @param menuPath 菜单项的路径
 * @param currentPath 当前路由路径
 * @param hasChildren 菜单项是否有子菜单
 * @param children 子菜单项数组
 * @returns 是否应该显示选中状态
 */
export const isMenuActive = (
  menuPath: string,
  currentPath: string,
  hasChildren: boolean = false,
  children?: Array<{ to?: string }>
): boolean => {
  // 如果没有路径，检查是否有子项被选中
  if (!menuPath) {
    if (hasChildren && children) {
      return children.some(child =>
        child.to && isMenuActive(child.to, currentPath, false)
      )
    }
    return false
  }

  // 精确匹配优先
  if (currentPath === menuPath) {
    return true
  }

  // 对于有子菜单的项，只有当它是当前路径的直接父级时才返回true
  if (hasChildren) {
    return currentPath.startsWith(menuPath + '/')
  }

  // 对于叶子节点，只使用精确匹配，避免路径重叠问题
  return false
}

/**
 * 检查父级菜单是否应该展开
 * @param parentPath 父级菜单路径
 * @param currentPath 当前路由路径
 * @returns 是否应该展开父级菜单
 */
export const shouldParentExpand = (parentPath: string, currentPath: string): boolean => {
  return currentPath.startsWith(parentPath + '/')
}

/**
 * 检查是否有子项被选中
 * @param children 子菜单项数组
 * @param currentPath 当前路由路径
 * @returns 是否有子项被选中
 */
export const hasChildActive = (children: Array<{ to?: string }>, currentPath: string): boolean => {
  return children.some(child =>
    child.to && (
      currentPath === child.to || // 精确匹配
      shouldParentExpand(child.to, currentPath) // 子路径匹配
    )
  )
}