"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import React, {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export default function TaskForm() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [newDescription, setNewDescription] = useState("");
  const [taskImage, setTaskImage] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const subapaseClient = useMemo(async () => {
    const client = await createSupabaseClient();
    return client;
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const client = await subapaseClient;
      const { data, error } = await client
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return null;
      }

      console.log("Data", data);

      return data;
    } catch (err) {
      console.error("error", err);
    } finally {
      setIsFetching(false);
    }
  }, [subapaseClient]);

  useEffect(() => {
    setIsFetching(true);
    fetchTasks().then((data) => {
      if (data) {
        setTasks(data);
      }
    });
  }, [fetchTasks]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      const client = await subapaseClient;
      const { data, error } = await client
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        console.error("Error deleting a task: ", error?.message);
        return;
      }

      // Update local tasks
      const filteredTasks = (tasks || [])?.filter((task) => task.id !== taskId);
      setTasks(filteredTasks);

      console.log("data", data);
    } catch (err) {
      console.error("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    try {
      setIsLoading(true);
      const client = await subapaseClient;
      const { data, error } = await client
        .from("tasks")
        .insert(newTask)
        .select()
        .single();

      if (error) {
        console.error("Error creating a task: ", error?.message);

        return;
      }

      setNewTask({
        title: "",
        description: "",
      });

      console.log("data", data);
    } catch (err) {
      console.error("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2 className="font-bold mb-4">Task Manager CRUD</h2>

      {isLoading && <p className="text-lg">Loading...</p>}

      {/* Form to add a new task */}
      <form
        style={{ marginBottom: "1rem" }}
        onSubmit={handleSubmit}
        className={`${isLoading && "opacity-70"}`}
      >
        <input
          type="text"
          value={newTask.title}
          placeholder="Task Title"
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          disabled={isLoading}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          disabled={isLoading}
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem" }}
          disabled={isLoading}
        >
          Add Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks?.map((task, key) => (
          <li
            key={key}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div className="h-fit">
              <h3 className="font-semibold">{task?.title}</h3>
              <p>{task?.description}</p>
              <p className="my-2 italic text-sm">~{task?.created_at}</p>
              <img src={task?.image_url || ""} style={{ height: 70 }} />
              <textarea
                placeholder="Updated description..."
                onChange={(e) => setNewDescription(e.target.value)}
                className="p-4"
              />
            </div>
            <div>
              <button
                style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                // onClick={() => updateTask(task.id)}
              >
                Edit
              </button>
              <button
                style={{ padding: "0.5rem 1rem" }}
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
