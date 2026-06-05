export const isCancelledError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    (error.name === 'CanceledError' || error.name === 'AbortError')
  )
}