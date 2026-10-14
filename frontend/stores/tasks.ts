import { defineStore } from 'pinia';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const api = useApi();

  async function fetchTasks() {
    loading.value = true;
    error.value = null;

    try {
      tasks.value = await api<Task[]>('/tasks');
    } catch {
      error.value = 'No fue posible cargar las tareas.';
    } finally {
      loading.value = false;
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    error.value = null;

    try {
      const task = await api<Task>('/tasks', {
        method: 'POST',
        body: payload,
      });

      tasks.value.unshift(task);
      return true;
    } catch {
      error.value = 'No fue posible crear la tarea.';
      return false;
    }
  }

  async function updateTask(
    id: number,
    payload: UpdateTaskPayload,
  ) {
    error.value = null;

    try {
      const updatedTask = await api<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: payload,
      });

      const index = tasks.value.findIndex((task) => task.id === id);

      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }

      return true;
    } catch {
      error.value = 'No fue posible actualizar la tarea.';
      return false;
    }
  }

  async function deleteTask(id: number) {
    error.value = null;

    try {
      await api(`/tasks/${id}`, {
        method: 'DELETE',
      });

      tasks.value = tasks.value.filter((task) => task.id !== id);
      return true;
    } catch {
      error.value = 'No fue posible eliminar la tarea.';
      return false;
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});