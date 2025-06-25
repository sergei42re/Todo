import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // обязательно react-router-dom
import Layout from './components/Layout';

import { HabitsListPage } from './pages/HabitsListPage/HabitsListPage';
import { HabitDetailPage } from './pages/HabitDetailPage/HabitDetailPage';

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/Todo">
            <Layout>
                <Routes>
                    <Route path="/" element={<HabitsListPage />} />
                    <Route path="/habits/:id" element={<HabitDetailPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
