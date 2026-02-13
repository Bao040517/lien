import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t py-6 mt-8">
                <div className="container mx-auto text-center text-gray-500">
                    &copy; 2024 Shopee Clone. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
