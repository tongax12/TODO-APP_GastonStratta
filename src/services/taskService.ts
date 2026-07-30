import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormData } from "../types/task";

const TASKS_COLLECTION = "tasks";

/**
 * Se suscribe en tiempo real a las tareas del usuario mediante onSnapshot.
 * Retorna la función `unsubscribe` para cancelar la suscripción al desmontar el componente.
 */
export function subscribeToTasks(
  userId: string,
  onNext: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const tasksQuery = query(
    collection(db, TASKS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Task)
      );
      onNext(tasks);
    },
    (error: FirestoreError) => {
      if (error.code === "permission-denied") {
        onError(new Error("No tenés permiso para acceder a estas tareas."));
      } else {
        onError(error);
      }
    }
  );
}

export async function createTask(userId: string, data: TaskFormData) {
  const now = new Date().toISOString();
  await addDoc(collection(db, TASKS_COLLECTION), {
    ...data,
    userId,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateTask(id: string, data: Partial<TaskFormData>) {
  await updateDoc(doc(db, TASKS_COLLECTION, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTask(id: string) {
  await deleteDoc(doc(db, TASKS_COLLECTION, id));
}