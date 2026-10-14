<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Task } from '~/stores/tasks';
import { useTasksStore } from '~/stores/tasks';

const store = useTasksStore();

const title = ref('');
const description = ref('');
const editingId = ref<number | null>(null);

const isEditing = computed(() => editingId.value !== null);

onMounted(async () => {
  await store.fetchTasks();
});

function resetForm() {
  title.value = '';
  description.value = '';
  editingId.value = null;
}

async function submitTask() {
  const cleanTitle = title.value.trim();

  if (!cleanTitle) {
    await Swal.fire({
      icon: 'warning',
      title: 'Título obligatorio',
      text: 'Introduce un título para la tarea.',
    });
    return;
  }

  let success: boolean;

  if (isEditing.value && editingId.value !== null) {
    success = await store.updateTask(editingId.value, {
      title: cleanTitle,
      description: description.value.trim(),
    });
  } else {
    success = await store.createTask({
      title: cleanTitle,
      description: description.value.trim(),
      completed: false,
    });
  }

  if (!success) {
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo guardar',
      text: store.error ?? 'Ocurrió un error inesperado.',
    });
    return;
  }

  await Swal.fire({
    icon: 'success',
    title: isEditing.value ? 'Tarea actualizada' : 'Tarea creada',
    timer: 1200,
    showConfirmButton: false,
  });

  resetForm();
}

function editTask(task: Task) {
  editingId.value = task.id;
  title.value = task.title;
  description.value = task.description ?? '';

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

async function toggleCompleted(task: Task) {
  const success = await store.updateTask(task.id, {
    completed: !task.completed,
  });

  if (!success) {
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo actualizar',
      text: store.error ?? 'Ocurrió un error inesperado.',
    });
  }
}

async function deleteTask(task: Task) {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Eliminar tarea?',
    text: `Se eliminará "${task.title}". Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
  });

  if (!result.isConfirmed) {
    return;
  }

  const success = await store.deleteTask(task.id);

  if (success) {
    await Swal.fire({
      icon: 'success',
      title: 'Tarea eliminada',
      timer: 1200,
      showConfirmButton: false,
    });
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo eliminar',
      text: store.error ?? 'Ocurrió un error inesperado.',
    });
  }
}

const completedCount = computed(
  () => store.tasks.filter((task) => task.completed).length,
);

const pendingCount = computed(
  () => store.tasks.filter((task) => !task.completed).length,
);
</script>

<template>
  <main class="page">
    <div class="container">
      <header class="header">
        <div>
          <p class="eyebrow">ORGANIZACIÓN PERSONAL</p>
          <h1>Mis tareas<span>.</span></h1>
          <p class="subtitle">
            Organiza tu trabajo, una tarea a la vez.
          </p>
        </div>

        <div class="summary">
          <div>
            <strong>{{ store.tasks.length }}</strong>
            <span>Total</span>
          </div>

          <div>
            <strong>{{ pendingCount }}</strong>
            <span>Pendientes</span>
          </div>

          <div>
            <strong>{{ completedCount }}</strong>
            <span>Completadas</span>
          </div>
        </div>
      </header>

      <section class="form-card">
        <div class="section-heading">
          <div>
            <h2>{{ isEditing ? 'Editar tarea' : 'Nueva tarea' }}</h2>
            <p>
              {{
                isEditing
                  ? 'Modifica los datos de la tarea seleccionada.'
                  : 'Añade una tarea a tu lista.'
              }}
            </p>
          </div>
        </div>

        <form class="task-form" @submit.prevent="submitTask">
          <div class="field">
            <label for="title">Título</label>
            <input
              id="title"
              v-model="title"
              type="text"
              maxlength="150"
              placeholder="Ej. Preparar documentación"
              required
            />
          </div>

          <div class="field">
            <label for="description">Descripción</label>
            <textarea
              id="description"
              v-model="description"
              rows="3"
              placeholder="Describe brevemente la tarea..."
            />
          </div>

          <div class="form-actions">
            <button class="primary-button" type="submit">
              {{ isEditing ? 'Guardar cambios' : 'Crear tarea' }}
            </button>

            <button
              v-if="isEditing"
              class="secondary-button"
              type="button"
              @click="resetForm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="list-section">
        <div class="list-heading">
          <div>
            <h2>Lista de tareas</h2>
            <p>Administra tus actividades.</p>
          </div>

          <button
            class="refresh-button"
            type="button"
            :disabled="store.loading"
            @click="store.fetchTasks()"
          >
            Actualizar
          </button>
        </div>

        <div v-if="store.loading" class="state-card">
          Cargando tareas...
        </div>

        <div v-else-if="store.error" class="state-card error-state">
          <p>{{ store.error }}</p>
          <button class="secondary-button" @click="store.fetchTasks()">
            Reintentar
          </button>
        </div>

        <div v-else-if="store.tasks.length === 0" class="state-card">
          <h3>Aún no hay tareas</h3>
          <p>Crea tu primera tarea utilizando el formulario.</p>
        </div>

        <div v-else class="task-list">
          <article
            v-for="task in store.tasks"
            :key="task.id"
            class="task-card"
            :class="{ completed: task.completed }"
          >
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                :checked="task.completed"
                :aria-label="`Marcar ${task.title} como completada`"
                @change="toggleCompleted(task)"
              />
              <span class="custom-checkbox" />
            </label>

            <div class="task-content">
              <div class="task-title-row">
                <h3>{{ task.title }}</h3>
                <span
                  class="status"
                  :class="task.completed ? 'status-done' : 'status-pending'"
                >
                  {{ task.completed ? 'Completada' : 'Pendiente' }}
                </span>
              </div>

              <p v-if="task.description" class="task-description">
                {{ task.description }}
              </p>

              <p class="task-date">
                Creada:
                {{ new Date(task.createdAt).toLocaleDateString('es-MX') }}
              </p>
            </div>

            <div class="task-actions">
              <button
                class="icon-button"
                type="button"
                aria-label="Editar tarea"
                @click="editTask(task)"
              >
                Editar
              </button>

              <button
                class="icon-button delete-button"
                type="button"
                aria-label="Eliminar tarea"
                @click="deleteTask(task)"
              >
                Eliminar
              </button>
            </div>
          </article>
        </div>
      </section>

      <footer class="footer">
        Administrador de tareas · Nuxt 3 · NestJS · PostgreSQL
      </footer>
    </div>
  </main>
</template>

<style>
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  color: #202938;
  background: #f5f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.page {
  min-height: 100vh;
  padding: 56px 24px;
}

.container {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 36px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #5865d9;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 0;
  font-size: clamp(36px, 5vw, 52px);
  letter-spacing: -2px;
}

h1 span {
  color: #5865d9;
}

.subtitle,
.section-heading p,
.list-heading p {
  color: #737e90;
  margin: 9px 0 0;
}

.summary {
  display: flex;
  gap: 24px;
}

.summary div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.summary strong {
  font-size: 25px;
}

.summary span {
  color: #737e90;
  font-size: 12px;
}

.form-card,
.task-card,
.state-card {
  border: 1px solid #e7eaf1;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 24px rgb(26 38 66 / 4%);
}

.form-card {
  padding: 28px;
}

.section-heading h2,
.list-heading h2 {
  margin: 0;
  font-size: 21px;
}

.task-form {
  display: grid;
  gap: 20px;
  margin-top: 24px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-size: 14px;
  font-weight: 700;
}

.field input,
.field textarea {
  width: 100%;
  padding: 13px 14px;
  color: #202938;
  background: #fff;
  border: 1px solid #dfe4ed;
  border-radius: 9px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input:focus,
.field textarea:focus {
  border-color: #5865d9;
  box-shadow: 0 0 0 3px rgb(88 101 217 / 12%);
}

.field textarea {
  resize: vertical;
}

.form-actions,
.task-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-button,
.secondary-button,
.refresh-button,
.icon-button {
  padding: 10px 15px;
  border: 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.primary-button {
  color: #fff;
  background: #5865d9;
}

.primary-button:hover {
  background: #4653c7;
}

.secondary-button,
.refresh-button {
  color: #3d485b;
  background: #eef1f7;
}

.list-section {
  margin-top: 42px;
}

.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.task-list {
  display: grid;
  gap: 12px;
}

.task-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
}

.checkbox-wrapper {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 3px;
  cursor: pointer;
}

.checkbox-wrapper input {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd2df;
  border-radius: 6px;
}

.checkbox-wrapper input:checked + .custom-checkbox {
  background: #5865d9;
  border-color: #5865d9;
}

.checkbox-wrapper input:checked + .custom-checkbox::after {
  display: block;
  width: 5px;
  height: 10px;
  margin: 1px 0 0 5px;
  border: solid white;
  border-width: 0 2px 2px 0;
  content: "";
  transform: rotate(45deg);
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.task-title-row h3 {
  margin: 0;
  font-size: 16px;
  overflow-wrap: anywhere;
}

.task-description {
  margin: 8px 0 0;
  color: #657084;
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.task-date {
  margin: 12px 0 0;
  color: #939bac;
  font-size: 12px;
}

.status {
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-pending {
  color: #9a6700;
  background: #fff4d5;
}

.status-done {
  color: #16794b;
  background: #dcfce7;
}

.completed .task-title-row h3 {
  color: #8a93a2;
  text-decoration: line-through;
}

.task-actions {
  flex-shrink: 0;
}

.icon-button {
  color: #4653c7;
  background: #eef0ff;
}

.delete-button {
  color: #c53030;
  background: #fff0f0;
}

.state-card {
  padding: 40px 24px;
  color: #737e90;
  text-align: center;
}

.state-card h3 {
  margin: 0;
  color: #202938;
}

.state-card p {
  margin-bottom: 0;
}

.error-state {
  color: #b42318;
  background: #fffafa;
}

.footer {
  padding: 36px 0 0;
  color: #939bac;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 720px) {
  .page {
    padding: 32px 16px;
  }

  .header {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary {
    width: 100%;
    justify-content: space-between;
  }

  .form-card {
    padding: 20px;
  }

  .task-card {
    flex-wrap: wrap;
    padding: 16px;
  }

  .task-content {
    width: calc(100% - 40px);
    flex: none;
  }

  .task-actions {
    margin-left: 36px;
  }
}
</style>