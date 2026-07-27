import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

// Pointer-events-based (not HTML5 DnD, which has no reliable touch support)
// vertical reorder: press the handle, drag up/down, siblings swap live as the
// pointer crosses their midpoint, and the final order commits on release.
export function useDragReorder<T extends string>(
  orderIds: T[],
  onCommit: (newOrder: T[]) => void,
) {
  const [dragId, setDragId] = useState<T | null>(null)
  const [liveOrder, setLiveOrder] = useState<T[]>(orderIds)
  const [dragOffset, setDragOffset] = useState(0)
  const startYRef = useRef(0)
  const itemRefs = useRef(new Map<T, HTMLElement>())

  const order = dragId ? liveOrder : orderIds

  function registerItem(id: T) {
    return (el: HTMLElement | null) => {
      if (el) itemRefs.current.set(id, el)
      else itemRefs.current.delete(id)
    }
  }

  function handlePointerDown(id: T, e: ReactPointerEvent<HTMLElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startYRef.current = e.clientY
    setLiveOrder(orderIds)
    setDragOffset(0)
    setDragId(id)
  }

  function handlePointerMove(id: T, e: ReactPointerEvent<HTMLElement>) {
    if (dragId !== id) return
    e.preventDefault()
    setDragOffset(e.clientY - startYRef.current)

    const y = e.clientY
    setLiveOrder((prev) => {
      const others = prev.filter((x) => x !== id)
      let index = others.length
      for (let i = 0; i < others.length; i++) {
        const el = itemRefs.current.get(others[i])
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (y < rect.top + rect.height / 2) {
          index = i
          break
        }
      }
      const next = [...others.slice(0, index), id, ...others.slice(index)]
      return next.join('|') === prev.join('|') ? prev : next
    })
  }

  function endDrag(id: T, e: ReactPointerEvent<HTMLElement>, commit: boolean) {
    if (dragId !== id) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDragId(null)
    setDragOffset(0)
    if (commit) onCommit(liveOrder)
  }

  function handlePointerUp(id: T, e: ReactPointerEvent<HTMLElement>) {
    endDrag(id, e, true)
  }

  function handlePointerCancel(id: T, e: ReactPointerEvent<HTMLElement>) {
    endDrag(id, e, false)
  }

  return {
    order,
    dragId,
    dragOffset,
    registerItem,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  }
}
