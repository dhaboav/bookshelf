import { Toaster } from '@/components/ui/sonner';
import Homepage from '@/pages/Homepage';
import Page404 from '@/pages/Page404';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
