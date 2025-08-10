import { Component, ComponentProps } from '../Component';
/** Props shared by all layout components */
export interface LayoutProps extends ComponentProps {
    children?: Component[];
}
export declare abstract class Layout extends Component {
    protected children: Component[];
    constructor(props: LayoutProps);
    addChild(child: Component): void;
    removeChild(child: Component): void;
    getChildren(): Component[];
    protected abstract recalculateLayout(): void;
    draw(): string[][];
    getAllDescendants(): Component[];
}
