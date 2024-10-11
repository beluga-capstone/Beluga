export type SideNavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItems?: SideNavItem[];
};

export interface Container {
    id: number;
    name: string;
    status: 'running' | 'paused' | 'stopped';
    launchTime: string;
}

export interface Course {
    id: number;
    name: string;
    term: string;
    year: number;
}