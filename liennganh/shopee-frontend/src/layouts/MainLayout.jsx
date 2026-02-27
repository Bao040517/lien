import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/Auth/AuthModal';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <Footer />
            <AuthModal />
        </div>
    );
};

export default MainLayout;
