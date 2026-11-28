import { useState, type ReactNode } from 'react';
import { Segmented, useIsMobile } from '../../components/ui';

/** Two-pane layout: problem on the left, editor and console on the right (stacked views on mobile). */
export function InfWorkspace({ header, left, right }: { header: ReactNode; left: ReactNode; right: ReactNode }) {
  const mobile = useIsMobile();
  const [view, setView] = useState<'problem' | 'code'>('problem');
  return (
    <div className="ws inf-ws">
      {header}
      {mobile && (
        <div className="ws-mobile-switch">
          <Segmented<'problem' | 'code'> size="sm" label="View" value={view} onChange={setView} options={[{ value: 'problem', label: 'Problem' }, { value: 'code', label: 'Code' }]} />
        </div>
      )}
      <div className="inf-ws-body">
        {(!mobile || view === 'problem') && <div className="ws-left inf-left">{left}</div>}
        {(!mobile || view === 'code') && <div className="inf-right">{right}</div>}
      </div>
    </div>
  );
}
