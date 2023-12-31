import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { set } from './helpers';
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants';

export function useSnapPoints({
  activeSnapPointProp,
  snapPoints,
  drawerRef,
  overlayRef,
  fadeFromIndex,
  onSnapPointChange,
}: {
  activeSnapPointProp?: number | string | null;
  snapPoints?: (number | string)[];
  fadeFromIndex?: number;
  drawerRef: Ref<HTMLDivElement | null>;
  overlayRef: Ref<HTMLDivElement | null>;
  onSnapPointChange(activeSnapPointIndex: number): void;
}) {
  // const [activeSnapPoint, setActiveSnapPoint] = useControllableState<string | number | null>({
  //   prop: activeSnapPointProp,
  //   defaultProp: snapPoints?.[0],
  //   onChange: setActiveSnapPointProp,
  // });
  const activeSnapPoint = ref(activeSnapPointProp)

  const isLastSnapPoint = computed(() => activeSnapPoint.value === snapPoints?.[snapPoints.length - 1] ?? null)

  const shouldFade =
    (snapPoints &&
        snapPoints.length > 0 &&
        (fadeFromIndex || fadeFromIndex === 0) &&
        !Number.isNaN(fadeFromIndex) &&
        snapPoints[fadeFromIndex] === activeSnapPoint.value) ||
    !snapPoints;

  const activeSnapPointIndex = computed(() => snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint.value) ?? null)

  const snapPointsOffset = computed(() => {
    return snapPoints?.map((snapPoint) => {
      const hasWindow = typeof window !== 'undefined';
      const isPx = typeof snapPoint === 'string';
      let snapPointAsNumber = 0;

      if (isPx) {
        snapPointAsNumber = parseInt(snapPoint, 10);
      }

      const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;

      if (hasWindow) {
        return window.innerHeight - height;
      }

      return height;
    }) ?? []
  })

  const activeSnapPointOffset = computed(() => activeSnapPointIndex.value !== null ? snapPointsOffset.value?.[activeSnapPointIndex.value] : null)

  const snapToPoint = (height: number) => {
    const newSnapPointIndex = snapPointsOffset.value?.findIndex((snapPointHeight) => snapPointHeight === height) ?? null;
    onSnapPointChange(newSnapPointIndex);

    set(drawerRef.value.$el, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `translate3d(0, ${height}px, 0)`,
    });

    if (
      snapPointsOffset &&
      newSnapPointIndex !== snapPointsOffset.value.length - 1 &&
      newSnapPointIndex !== fadeFromIndex
    ) {
      set(overlayRef.value.$el, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '0',
      });
    } else {
      set(overlayRef.value.$el, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '1',
      });
    }

    activeSnapPoint.value = newSnapPointIndex !== null ? snapPoints?.[newSnapPointIndex] : null;
  }

  watch([activeSnapPointProp, snapPoints, snapPointsOffset], () => {
    if (activeSnapPointProp) {
      const newIndex = snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPointProp) ?? null;
      if (snapPointsOffset && newIndex && typeof snapPointsOffset.value[newIndex] === 'number') {
        snapToPoint(snapPointsOffset.value[newIndex] as number);
      }
    }
  })

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
    dismissible,
  }: {
    draggedDistance: number;
    closeDrawer: () => void;
    velocity: number;
    dismissible: boolean;
  }) {
    if (fadeFromIndex === undefined) return;

    const currentPosition = activeSnapPointOffset.value - draggedDistance;
    const isOverlaySnapPoint = activeSnapPointIndex.value === fadeFromIndex - 1;
    const isFirst = activeSnapPointIndex.value === 0;
    const hasDraggedUp = draggedDistance > 0;

    if (isOverlaySnapPoint) {
      set(overlayRef.value.$el, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    }

    if (velocity > 2 && !hasDraggedUp) {
      if (dismissible) closeDrawer();
      else snapToPoint(snapPointsOffset.value[0]); // snap to initial point
      return;
    }

    if (velocity > 2 && hasDraggedUp && snapPointsOffset && snapPoints) {
      snapToPoint(snapPointsOffset.value[snapPoints.length - 1] as number);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset?.value.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number') return prev;

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });

    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < window.innerHeight * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1; // 1 = up, -1 = down

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint) {
        snapToPoint(snapPointsOffset.value[snapPoints.length - 1]);
        return;
      }

      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }

      if (activeSnapPointIndex === null) return;

      snapToPoint(snapPointsOffset.value[activeSnapPointIndex.value + dragDirection]);
      return;
    }

    snapToPoint(closestSnapPoint);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    if (activeSnapPointOffset.value === null) return;
    const newYValue = activeSnapPointOffset.value - draggedDistance;

    set(drawerRef.value.$el, {
      transform: `translate3d(0, ${newYValue}px, 0)`,
    });
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (!snapPoints || typeof activeSnapPointIndex !== 'number' || !snapPointsOffset || fadeFromIndex === undefined)
      return null;

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex;

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) return 1;
    if (!shouldFade && !isOverlaySnapPoint) return null;

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex + 1 : activeSnapPointIndex - 1;

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset.value[targetSnapPointIndex] - snapPointsOffset.value[targetSnapPointIndex - 1]
      : snapPointsOffset.value[targetSnapPointIndex + 1] - snapPointsOffset.value[targetSnapPointIndex];

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }

  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset,
  };
}
