import { FC, useCallback, useMemo, useState } from "react";
import { TreeNode } from "./TreeNode";
import { TreeProps } from "./Types";

import "./Tree.css";

export const Tree: FC<TreeProps> = ({
  data,
  indent = 0,
  defaultCollapsed = true
}) => {
  const [dataClone, setDataClone] = useState(data);

  const rootItems = useMemo(() => {
    return dataClone.filter(({ parent }) => parent === undefined);
  }, [dataClone]);

  const getChildNodes = useCallback(
    (parentId: number) => {
      if (!parentId) return [];

      return dataClone.filter(({ parent }) => parent === parentId);
    },
    [dataClone]
  );

  const toggleCollapsed = useCallback(
    (targetId: number, state: boolean) => {
      const newData = Array.from(dataClone);

      const item = newData.find(({ id }) => id === targetId);

      if (item) item.collapsed = state;

      setDataClone(newData);
    },
    [dataClone]
  );

  return (
    <div className="tree">
      {rootItems.map((item, i) => {
        return (
          <TreeNode
            key={item.id}
            item={item}
            indent={indent}
            index={i}
            onToggleCollapsed={toggleCollapsed}
            defaultCollapsed={defaultCollapsed}
            getChildNodes={getChildNodes}
          />
        );
      })}
    </div>
  );
};
