import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Checkbox,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./HabitsListPage.module.css";

const habitSchema = z.object({
  title: z.string().min(1, "Введите название привычки"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface Habit {
  id: string;
  title: string;
  completedDays: Record<string, boolean>;
}

export const HabitsListPage = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "Утренняя зарядка", completedDays: {} },
    { id: "2", title: "Чтение книги", completedDays: {} },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
  });

  const onCreate = (data: HabitForm) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: data.title,
      completedDays: {},
    };
    setHabits(prev => [...prev, newHabit]);
    reset();
    setCreateOpen(false);
  };

  const onDelete = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const last5days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

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
              onClick={() => setCreateOpen(prev => !prev)}
              sx={{ marginBottom: 2 }}
          >
            Создать новую привычку
          </Button>

          <Accordion expanded={createOpen} onChange={() => setCreateOpen(prev => !prev)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Форма создания привычки</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleSubmit(onCreate)}>
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
                <Button type="submit" variant="contained">Создать</Button>
              </form>
            </AccordionDetails>
          </Accordion>

          <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                '& > *': {
                  flex: '1 1 300px',
                  maxWidth: '100%',
                }
              }}
          >
            {habits.map(habit => (
                <Card key={habit.id}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6">{habit.title}</Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => setEditHabit(habit)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(habit.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      {last5days.map(day => (
                          <Checkbox
                              key={day}
                              checked={!!habit.completedDays[day]}
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
            ))}
          </Box>
        </Container>

        {editHabit && (
            <Dialog
                open={!!editHabit}
                onClose={() => setEditHabit(null)}
                maxWidth="sm"
                fullWidth
            >
              <DialogTitle>Редактировать привычку</DialogTitle>
              <DialogContent>
                {/* Форма редактирования — вставит ученик 2 */}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditHabit(null)}>Отмена</Button>
                <Button variant="contained" onClick={() => setEditHabit(null)}>Сохранить</Button>
              </DialogActions>
            </Dialog>
        )}
      </>
  );
};