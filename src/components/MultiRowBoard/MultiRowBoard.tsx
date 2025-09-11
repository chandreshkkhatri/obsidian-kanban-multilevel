import classcat from 'classcat';
import { useContext, useMemo, useState } from 'preact/compat';
import { SortPlaceholder } from 'src/dnd/components/SortPlaceholder';
import { Sortable } from 'src/dnd/components/Sortable';

import { Lanes } from '../Lane/Lane';
import { KanbanContext } from '../context';
import { c } from '../helpers';
import { Lane } from '../types';
import { DataTypes } from '../types';

interface MultiRowBoardProps {
  lanes: Lane[];
}

// Group lanes by row value (undefined row goes into a default row at top)
export function MultiRowBoard({ lanes }: MultiRowBoardProps) {
  const { view } = useContext(KanbanContext);
  const collapseState = view.useViewState('row-collapse') || ({} as Record<string, boolean>);
  const [localCollapse, setLocalCollapse] = useState<Record<string, boolean>>(collapseState);

  // rows: map rowName -> lanes
  const rows = useMemo(() => {
    const map = new Map<string, Lane[]>();
    lanes.forEach((l) => {
      const key = l.data.row || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(l);
    });
    return Array.from(map.entries()).map(([row, rowLanes]) => ({ row, lanes: rowLanes }));
  }, [lanes]);

  const toggleRow = (row: string) => {
    view.setViewState('row-collapse', undefined, (prev: Record<string, boolean> = {}) => {
      const updated = { ...prev, [row]: !prev?.[row] };
      setLocalCollapse(updated);
      return updated;
    });
  };

  return (
    <div className="kanban-plugin__multirow-wrapper">
      {rows.map(({ row, lanes: rowLanes }) => {
        const isCollapsed = localCollapse?.[row] === true;
        return (
          <div
            className={classcat(['kanban-plugin__row-section', { 'is-collapsed': isCollapsed }])}
            key={row || 'default-row'}
          >
            <div className="kanban-plugin__row-header" onClick={() => toggleRow(row)}>
              <div className="kanban-plugin__row-header-icon">
                <span
                  className={classcat(['kanban-plugin__chevron', { 'is-collapsed': isCollapsed }])}
                >
                  ▶
                </span>
              </div>
              <div className="kanban-plugin__row-title">{row || 'Default'}</div>
              <div className="kanban-plugin__row-meta">
                {rowLanes.length} lane{rowLanes.length !== 1 ? 's' : ''}
              </div>
            </div>
            {!isCollapsed && (
              <div className="kanban-plugin__row-body">
                <Sortable axis="horizontal">
                  <Lanes lanes={rowLanes} collapseDir="horizontal" />
                  <SortPlaceholder
                    accepts={[DataTypes.Lane]}
                    className={c('lane-placeholder')}
                    index={rowLanes.length}
                  />
                </Sortable>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
