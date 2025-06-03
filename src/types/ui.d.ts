// src/types/ui.d.ts
declare module 'react-archer' {
  import * as React from 'react';

  type AnchorPosition = 'top' | 'bottom' | 'left' | 'right' | 'middle';

  // This interface should be compatible with the LocalArcherRelation in FamilyMemberNode.tsx
  // and the actual props accepted by ArcherElement's relations.
  export interface ArcherRelation {
    targetId: string;
    targetAnchor: AnchorPosition;
    sourceAnchor: AnchorPosition;
    style?: {
      strokeColor?: string;
      strokeWidth?: number;
      strokeDasharray?: string;
      endShape?: EndShape; // Defined below
      arrowLength?: number;
      arrowThickness?: number;
    };
    label?: React.ReactNode;
  }

  export interface EndShape {
    circle?: {
      radius: number;
      strokeColor?: string;
      fillColor?: string;
      strokeWidth?: number;
    };
    arrow?: {
      arrowLength: number;
      arrowThickness: number;
      strokeColor?: string;
      fillColor?: string;
      strokeWidth?: number;
    };
  }

  export interface ArcherContainerProps {
    strokeColor?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    arrowLength?: number;
    arrowThickness?: number;
    offset?: number;
    lineStyle?: 'angle' | 'curve' | 'straight';
    endMarker?: boolean;
    endShape?: EndShape;
    label?: React.ReactNode; // Although label is usually per-relation, ArcherContainer might have a global default
    svgContainerStyle?: React.CSSProperties;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  const ArcherContainer: React.FC<ArcherContainerProps>;
  export default ArcherContainer;

  export interface ArcherElementProps {
    id: string;
    relations?: ArcherRelation[];
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const ArcherElement: React.FC<ArcherElementProps>;
}
