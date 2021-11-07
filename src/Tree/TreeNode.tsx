import {
  CSSProperties,
  FC,
  MouseEvent,
  useCallback,
  useMemo,
  useState
} from "react";
import { TreeNodeProps } from "./Types";

import "./TreeNode.css";

export const TreeNode: FC<TreeNodeProps> = ({
  item,
  indent,
  index,
  parentDragging = false,
  highlighted = false,
  onToggleCollapsed,
  getChildNodes,
  defaultCollapsed = false
}) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<[number, number, number] | null>(
    null
  );

  const collapsed = useMemo(() => {
    if (item.collapsed === undefined) {
      return defaultCollapsed;
    } else {
      return item.collapsed;
    }
  }, [item.collapsed, defaultCollapsed]);

  const rootClass = useMemo(() => {
    const base = "tree-node";
    const cls = [base];

    if (highlighted) cls.push(`${base}_higlighted`);
    if (dragging) cls.push(`${base}_dragging`);
    if (parentDragging) cls.push(`${base}_dragging-parent`);

    return cls.join(" ");
  }, [highlighted, dragging, parentDragging]);

  const toggleButtonClass = useMemo(() => {
    let base = "tree-node__button";

    if (collapsed) base += ` ${base}_closed`;

    return base;
  }, [collapsed]);

  const onNodeToggle = useCallback(() => {
    if (item.collapsable === false) return;

    onToggleCollapsed(item.id, !collapsed);
  }, [item.collapsable, collapsed, onToggleCollapsed, item.id]);

  const childNodes = getChildNodes(item.id, indent + 1);

  const isEmpty = childNodes.length === 0;

  const indentOffset = useMemo(() => {
    return indent * 12;
  }, [indent]);

  const onDragHandler = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const element = (e.target as HTMLElement).closest(".tree-node")!;

      const { left, top, width } = element.getBoundingClientRect();
      const [x, y] = [e.pageX, e.pageY];
      const [offsetX, offsetY] = [left + indentOffset, top];

      setDragging(true);
      setPosition([offsetX, offsetY, width - indentOffset]);

      const onMouseMove = (e: globalThis.MouseEvent) => {
        requestAnimationFrame(() => {
          const [newX, newY] = [
            offsetX + (e.pageX - x),
            offsetY + (e.pageY - y)
          ];

          setPosition([newX, newY, width - indentOffset]);
        });
      };

      const onMouseUp = (e: globalThis.MouseEvent) => {
        setDragging(false);
        setPosition(null);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp, { capture: true });
    },
    [indentOffset]
  );

  const itemStyle = useMemo((): CSSProperties => {
    if (dragging && position) {
      return {
        left: position[0],
        top: position[1],
        width: position[2]
      };
    } else {
      return { paddingLeft: indentOffset };
    }
  }, [indentOffset, dragging, position]);

  return (
    <>
      <div
        className={rootClass}
        data-id={item.id}
        data-parent={item.parent}
        data-indent={indent}
        style={itemStyle}
        onMouseDown={onDragHandler}
      >
        <div
          className="tree-node__toggle"
          onClick={onNodeToggle}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {item.collapsable !== false && !isEmpty && !dragging && (
            <div className={toggleButtonClass}></div>
          )}
        </div>
        <div className="tree-node__icon"></div>
        <div className="tree-node__content">
          {item.content}[{indent}, {index}]
        </div>
      </div>
      {dragging && position && (
        <div
          className="tree-placeholder"
          style={{ "--indent": `${indentOffset}px` }}
        ></div>
      )}
      {collapsed !== true &&
        childNodes.map((item, i) => {
          return (
            <TreeNode
              key={item.id}
              item={item}
              index={index + i + indent}
              indent={indent + 1}
              parentDragging={dragging || parentDragging}
              highlighted={highlighted}
              getChildNodes={getChildNodes}
              onToggleCollapsed={onToggleCollapsed}
              defaultCollapsed={defaultCollapsed}
            />
          );
        })}
    </>
  );
};
