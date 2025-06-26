import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import type { FC } from "react";
import type { Habit } from "../../types/habit";

const habitSchema = z.object({
    title: z.string().min(1, "Введите название привычки"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface EditHabitDialogProps {
    habit: Habit;
    open: boolean;
    onClose: () => void;
    onSave: (data: HabitForm) => void;
}

export const EditHabitDialog: FC<EditHabitDialogProps> = ({ habit, open, onClose, onSave }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
    });

    useEffect(() => {
        if (habit) {
            reset({ title: habit.title });
        }
    }, [habit, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Редактировать привычку</DialogTitle>
            <form onSubmit={handleSubmit(onSave)}>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button type="submit" variant="contained">Сохранить</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
