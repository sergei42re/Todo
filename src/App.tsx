import { Route, Routes } from 'react-router-dom'; // обязательно react-router-dom
import Layout from './components/Layout';

import { HabitsListPage } from './pages/HabitsListPage/HabitsListPage.tsx';
import { HabitDetailPage } from './pages/HabitDetailPage/HabitDetailPage';

const App: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HabitsListPage />} />
                <Route path="/habits/:id" element={<HabitDetailPage />} />
            </Routes>
        </Layout>
    );
};

export default App;
