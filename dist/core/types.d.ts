export type HorizontalAlign = 'left' | 'center' | 'right' | number;
export type VerticalAlign = 'top' | 'center' | 'bottom' | number;
export type AlignmentKeyword = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'fixed';
export type Alignment = AlignmentKeyword | {
    x: 'left' | 'center' | 'right' | number;
    y: 'top' | 'middle' | 'bottom' | number;
};
