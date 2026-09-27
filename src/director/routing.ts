import { useEffect } from 'react'
import { simStore } from '../sim/store'

/** `#/4` ↔ chapter 4, so returning viewers can deep-link and the back button works. */
export function chapterFromHash(hash: string, count: number): number | null {
  const m = /^#\/(\d+)$/.exec(hash)
  if (!m) return null
  const n = Number(m[1])
  return n >= 0 && n < count ? n : null
}

export function useChapterRouting() {
  useEffect(() => {
    const sync = () => {
      const { chapters, chapterIndex, loadChapter } = simStore.getState()
      const n = chapterFromHash(window.location.hash, chapters.length)
      if (n !== null && n !== chapterIndex) loadChapter(n)
    }
    sync()
    window.addEventListener('hashchange', sync)
    const unsub = simStore.subscribe((s, prev) => {
      if (s.chapterIndex !== prev.chapterIndex && chapterFromHash(window.location.hash, s.chapters.length) !== s.chapterIndex) {
        window.history.pushState(null, '', `#/${s.chapterIndex}`)
      }
    })
    return () => {
      window.removeEventListener('hashchange', sync)
      unsub()
    }
  }, [])
}

export function goToChapter(index: number) {
  simStore.getState().loadChapter(index)
}
