import {
    Card,
    CardContent,
    Checkbox,
    Typography,
    Stack,
    IconButton,
    Button,
    Tooltip
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FC } from "react";
import type { Habit } from "../../types/habit.ts";

interface HabitCardProps {
    habit: Habit;
    last5days: string[];
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

export const HabitCard: FC<HabitCardProps> = ({ habit, last5days, onDelete, onEdit }) => {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{habit.title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Редактировать">
                            <IconButton size="small" onClick={() => onEdit(habit)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                            <IconButton size="small" onClick={() => onDelete(habit.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={1}>
                    {last5days.map(day => (
                        <Checkbox
                            key={day}
                            checked={habit.completedDays[day]}
                            disabled
                        />
                    ))}
                </Stack>

                <Button
                    component={Link}
                    to={`/habits/${habit.id}`}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    Подробнее
                </Button>
            </CardContent>
        </Card>
    );
};
