import type { ReactNode } from 'react';

interface Props {
children: ReactNode;
}

function Container({ children }: Props) {
    return (
        <div className="container">
            {children}
        </div>
    );
}

export default Container;