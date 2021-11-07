export interface TreeItem {
  id: number;
  content: JSX.Element | string;
  parent?: number;
  collapsed?: boolean;
  collapsable?: boolean;
}

export interface TreeProps {
  data: TreeItem[];
  indent?: number;
  defaultCollapsed?: boolean;
}

export interface TreeNodeProps {
  item: TreeItem;
  indent: number;
  index: number;
  defaultCollapsed: boolean;
  onToggleCollapsed: (id: number, state: boolean) => void;
  getChildNodes: (parent: number, indent: number) => TreeItem[];

  highlighted?: boolean;
  parentDragging?: boolean;
}
