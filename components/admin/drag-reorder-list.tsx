"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleIcon } from "@/components/ui/icons";

export interface DragReorderListProps<T extends { id: string }> {
  items: T[];
  onReorder: (orderedIds: string[]) => void | Promise<void>;
  renderItem: (item: T) => React.ReactNode;
  emptyLabel?: string;
}

/**
 * One drag-and-drop implementation shared by every reorderable list in the
 * admin (program modules, module items, audiences, journey steps,
 * mentors) — each call site only supplies its own row content via
 * `renderItem`, so the dnd-kit wiring (sensors, keyboard support, the
 * optimistic local reorder before the Server Action confirms it) exists
 * exactly once.
 */
export function DragReorderList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  emptyLabel,
}: DragReorderListProps<T>) {
  const [order, setOrder] = React.useState(items.map((item) => item.id));
  React.useEffect(() => setOrder(items.map((item) => item.id)), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const byId = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    const next = arrayMove(order, oldIndex, newIndex);
    setOrder(next);
    void onReorder(next);
  }

  if (items.length === 0) {
    return <p className="text-body-sm text-slate-500">{emptyLabel ?? "Nothing here yet."}</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {order.map((id) => {
            const item = byId.get(id);
            if (!item) return null;
            return (
              <SortableRow key={id} id={id}>
                {renderItem(item)}
              </SortableRow>
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-lg border border-navy-800/10 bg-white p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1 shrink-0 cursor-grab touch-none rounded p-0.5 text-slate-500 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
        aria-label="Drag to reorder"
      >
        <DragHandleIcon className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}
