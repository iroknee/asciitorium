import { Layout, LayoutProps } from './Layout';
export interface HorizontalLayoutProps extends LayoutProps {
    fit?: boolean;
}
export declare class HorizontalLayout extends Layout {
    private fit?;
    constructor(props: HorizontalLayoutProps);
    protected recalculateLayout(): void;
}
