import {
  addDoc, collection, deleteDoc, doc,
  FirestoreError,
  getDocs, orderBy, query, updateDoc, where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormData } from "../types/task";

const TASKS_COLLECTION = "tasks";

/**
 * Trae las tareas del usuario UNA vez (no queda suscripto a cambios en vivo,
 * como sí hacía la versión con onSnapshot). Quien la use tiene que volver a
 * llamarla si quiere datos frescos, por ejemplo después de crear/editar/borrar.
 */
export async function subscribeToTasks(userId: string): Promise<Task[]> {
 try {
   const tasksQuery = query(
    collection(db, TASKS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(tasksQuery);

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Task)
  );
 } catch (error) {
  const err = error as FirestoreError;

  if(err.code === "permission-denied"){
    throw new Error ("No tenes permiso para acceder a estas tareas.");
  }

throw error;

 }
}

export async function createTask(userId: string, data: TaskFormData) {
  const now = new Date().toISOString();
  await addDoc(collection(db, TASKS_COLLECTION), {
    ...data, userId, createdAt: now, updatedAt: now,
  });
}

export async function updateTask(id: string, data: Partial<TaskFormData>) {
  await updateDoc(doc(db, TASKS_COLLECTION, id), {
    ...data, updatedAt: new Date().toISOString(),
  });
}

export async function deleteTask(id: string) {
  await deleteDoc(doc(db, TASKS_COLLECTION, id));
}