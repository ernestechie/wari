import ClientComponent from "@/components/ClientComponent";
import { createSupabaseClient } from "@/lib/supabase/client";

const setNewView = async () => {
  const client = await createSupabaseClient();
  const { data, error } = await client.from("todos").insert({
    name: `Todo for ${new Date()?.getUTCMinutes()}`,
  });

  console.log("data", data);
  console.log("error", error);
};

export default async function HomePage() {
  return (
    <div className="p-3">
      <p className="underline font-semibold text-xl"> Home Page</p>
      <ClientComponent />
    </div>
  );
}
