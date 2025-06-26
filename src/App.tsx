import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { HabitsListPage } from './pages/HabitsListPage/HabitsListPage';
import { HabitDetailPage } from './pages/HabitDetailPage/HabitDetailPage';
import type {Habit} from './types/habit.ts';
import mockHabits from './mocks/habits.json';

const App: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>(mockHabits as Habit[]);
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HabitsListPage habits={habits} setHabits={setHabits}/>} />
                <Route path="/habits/:id" element={<HabitDetailPage habits={habits} setHabits={setHabits}/>} />
            </Routes>
        </Layout>
    );
};

export default App;
