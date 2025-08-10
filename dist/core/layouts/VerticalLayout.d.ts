import { Layout, LayoutProps } from './Layout';
export interface VerticalLayoutProps extends LayoutProps {
    fit?: boolean;
}
export declare class VerticalLayout extends Layout {
    private fit?;
    constructor(props: VerticalLayoutProps);
    protected recalculateLayout(): void;
}
