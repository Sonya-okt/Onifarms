// src/types/declarations.d.ts

// Deklarasi untuk modul SVG
declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Deklarasi untuk accordion-collapse-react-native
declare module 'accordion-collapse-react-native' {
  import * as React from 'react';
  import {FlatListProps} from 'react-native';

  export class Collapse extends React.Component<any, any> {}
  export class CollapseHeader extends React.Component<any, any> {}
  export class CollapseBody extends React.Component<any, any> {}

  // Deklarasi untuk AccordionList
  export interface AccordionListProps extends FlatListProps<any> {
    data: any[];
    renderHeader: (
      item: any,
      index: number,
      isExpanded: boolean,
    ) => React.ReactNode;
    renderContent: (
      item: any,
      index: number,
      isExpanded: boolean,
    ) => React.ReactNode;
    keyExtractor?: (item: any, index: number) => string;
    isExpand?: boolean;
    animationDuration?: number;
  }

  export class AccordionList extends React.Component<AccordionListProps, any> {}
}
