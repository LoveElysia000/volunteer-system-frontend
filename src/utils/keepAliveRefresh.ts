export const shouldRefreshOnKeepAliveActivated = ({
  currentRouteName,
  expectedRouteName,
  hasLoadedOnce,
  hasActivatedOnce
}: {
  currentRouteName: string
  expectedRouteName: string
  hasLoadedOnce: boolean
  hasActivatedOnce: boolean
}) => {
  return currentRouteName === expectedRouteName && hasLoadedOnce && hasActivatedOnce
}
