import { useState, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FC } from "react";
import type { Habit } from "../../types/habit.ts";
import type { SetStateAction, Dispatch } from "react";
import styles from "./HabitsListPage.module.css";
import { HabitCard } from "../../components/HabitCard/HabitCard.tsx";
import { CreateHabitForm } from "../../components/CreateHabitForm/CreateHabitForm.tsx";
import { EditHabitDialog } from "../../components/EditHabitDialog/EditHabitDialog.tsx";

interface HabitsListPageProps {
    habits: Habit[];
    setHabits: Dispatch<SetStateAction<Habit[]>>;
}

export const HabitsListPage: FC<HabitsListPageProps> = ({ habits, setHabits }) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [editHabit, setEditHabit] = useState<Habit | null>(null);

    const toggleCreateOpen = () => setCreateOpen(prev => !prev);

    const last5days = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().slice(0, 10);
        }).reverse();
    }, []);

    const handleDelete = (id: string) => {
        if (confirm("Удалить привычку?")) {
            setHabits(prev => prev.filter(h => h.id !== id));
        }
    };

    const handleEditSave = (data: { title: string }) => {
        if (editHabit) {
            setHabits(prev =>
                prev.map(h =>
                    h.id === editHabit.id ? { ...h, title: data.title } : h
                )
            );
            setEditHabit(null);
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Мои Привычки</Typography>
                </Toolbar>
            </AppBar>

            <Container className={styles.wrapper}>
                <Button
                    variant="contained"
                    onClick={toggleCreateOpen}
                    sx={{ marginBottom: 2 }}
                >
                    Создать новую привычку
                </Button>

                <Accordion expanded={createOpen} onChange={toggleCreateOpen}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Форма создания привычки</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <CreateHabitForm setHabits={setHabits} onClose={() => setCreateOpen(false)} />
                    </AccordionDetails>
                </Accordion>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        "& > *": {
                            flex: "1 1 300px",
                            maxWidth: "100%",
                        },
                    }}
                >
                    {habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            last5days={last5days}
                            onDelete={handleDelete}
                            onEdit={setEditHabit}
                        />
                    ))}
                </Box>
            </Container>

            {editHabit && (
                <EditHabitDialog
                    habit={editHabit}
                    open={!!editHabit}
                    onClose={() => setEditHabit(null)}
                    onSave={handleEditSave}
                />
            )}
        </>
    );
};
