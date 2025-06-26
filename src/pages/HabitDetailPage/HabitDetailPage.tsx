// pages/HabitDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { FC } from "react";
import type { Habit } from "../../types/habit";
import styles from "./HabitDetailPage.module.css";

const habitSchema = z.object({
    title: z.string().min(1, "Введите название привычки"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface HabitDetailPageProps {
    habits: Habit[];
    setHabits: (callback: (prev: Habit[]) => Habit[]) => void;
}

export const HabitDetailPage: FC<HabitDetailPageProps> = ({ habits, setHabits }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const habit = habits.find(h => h.id === id);
    const [editOpen, setEditOpen] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
    });

    useEffect(() => {
        if (habit) reset({ title: habit.title });
    }, [habit, reset]);

    const last5days = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().slice(0, 10);
        }).reverse();
    }, []);

    const toggleDay = (day: string) => {
        if (!habit) return;
        setHabits(prev => prev.map(h =>
            h.id === habit.id
                ? {
                    ...h,
                    completedDays: {
                        ...h.completedDays,
                        [day]: !h.completedDays[day],
                    },
                }
                : h
        ));
    };

    const onEdit = (data: HabitForm) => {
        if (!habit) return;
        setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, title: data.title } : h));
        setEditOpen(false);
    };

    const onDelete = () => {
        if (!habit) return;
        setHabits(prev => prev.filter(h => h.id !== habit.id));
        navigate("/");
    };

    if (!habit) {
        return (
            <Container>
                <Typography variant="h5">Привычка не найдена</Typography>
                <Button onClick={() => navigate("/")} variant="outlined" sx={{ mt: 2 }}>
                    На главную
                </Button>
            </Container>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="назад">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">Детали привычки</Typography>
                </Toolbar>
            </AppBar>

            <Container className={styles.wrapper}>
                <Typography variant="h4" className={styles.title} gutterBottom>
                    {habit.title}
                </Typography>

                <Stack direction="row" spacing={1} className={styles.daysContainer} mb={3}>
                    {last5days.map(day => (
                        <Button
                            key={day}
                            variant={habit.completedDays[day] ? "contained" : "outlined"}
                            onClick={() => toggleDay(day)}
                            size="small"
                            className={`${styles.dayButton} ${
                                habit.completedDays[day] ? styles.completedDay : styles.incompleteDay
                            }`}
                        >
                            {day.slice(5)}
                        </Button>
                    ))}
                </Stack>

                <Stack direction="row" spacing={2} className={styles.actionsContainer}>
                    <Button
                        variant="contained"
                        onClick={() => setEditOpen(true)}
                        startIcon={<EditIcon />}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onDelete}
                        startIcon={<DeleteIcon />}
                    >
                        Удалить
                    </Button>
                </Stack>
            </Container>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать привычку</DialogTitle>
                <DialogContent className={styles.modalContent}>
                    <form onSubmit={handleSubmit(onEdit)} id="edit-habit-form" noValidate>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Название"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Отмена</Button>
                    <Button type="submit" form="edit-habit-form" variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
