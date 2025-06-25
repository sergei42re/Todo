import { useState } from "react";
import { AppBar, Toolbar, Typography, Container, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import styles from "./HabitDetailPage.module.css";

const habitSchema = z.object({
    title: z.string().min(1, "Введите название привычки"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface Habit {
    id: string;
    title: string;
    completedDays: Record<string, boolean>;
}

export const HabitDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [habit, setHabit] = useState<Habit>({
        id: id || "1",
        title: "Утренняя зарядка",
        completedDays: {},
    });

    const [editOpen, setEditOpen] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
        defaultValues: { title: habit.title },
    });

    const onEdit = (data: HabitForm) => {
        setHabit(h => ({ ...h, title: data.title }));
        setEditOpen(false);
    };

    const onDelete = () => {
        navigate("/");
    };

    const last5days = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().slice(0, 10);
    }).reverse();

    const toggleDay = (day: string) => {
        setHabit(h => ({
            ...h,
            completedDays: {
                ...h.completedDays,
                [day]: !h.completedDays[day],
            },
        }));
    };

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
                    <form onSubmit={handleSubmit(onEdit)} id="edit-habit-form">
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