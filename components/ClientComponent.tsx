"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

export default function ClientComponent() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  //
  useEffect(() => {
    async function getAllTodos() {
      try {
        setLoading(true);
        const supabase = await createSupabaseClient();
        const { data } = await supabase.from("todos").select();

        if (data && data?.length > 0) {
          setTodos(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getAllTodos();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-xl my-6">
      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <ul>
          {todos?.map((todo, index) => (
            <li key={todo?.id}>
              <span className="font-semibold">{index + 1}. </span>
              <span>{todo?.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
