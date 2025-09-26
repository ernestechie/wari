import { createSupabaseClient } from "@/lib/supabase/client";

export default async function Todos() {
  const supabase = await createSupabaseClient();
  const { data: todos } = await supabase.from("todos").select();

  return (
    <ul>
      {todos?.map((todo: Todo) => (
        <li key={todo?.id}>{todo?.name}</li>
      ))}
    </ul>
  );
}
