import { Outlet } from 'react-router-dom';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';

function MainLayout() {
    return (
        <div className="layout">

            <Header />

            <main>
                <Container>
                    <Outlet />
                </Container>
            </main>

            <Footer />

        </div>
    );
}

export default MainLayout;