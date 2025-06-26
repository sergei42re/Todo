import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Dispatch, FC, SetStateAction } from "react";
import type { Habit } from "../../types/habit.ts";

const habitSchema = z.object({
    title: z.string().min(1, "Введите название привычки"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface CreateHabitFormProps {
    setHabits: Dispatch<SetStateAction<Habit[]>>;
    onClose: () => void;
}

export const CreateHabitForm: FC<CreateHabitFormProps> = ({ setHabits, onClose }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
    });

    const onSubmit = (data: HabitForm) => {
        setHabits(prev => {
            const nextId = String(Math.max(0, ...prev.map(h => Number(h.id))) + 1);

            const newHabit: Habit = {
                id: nextId,
                title: data.title,
                completedDays: {},
            };

            return [...prev, newHabit];
        });
        reset();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Название"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        fullWidth
                        margin="normal"
                    />
                )}
            />
            <Button type="submit" variant="contained">
                Создать
            </Button>
        </form>
    );
};
