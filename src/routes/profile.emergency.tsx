import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Trash2, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import type { AsyncState, EmergencyContact } from "@/models";
import { QueryView } from "@/components/QueryView";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/emergency")({
  head: () => ({ meta: [{ title: "Contacts d'urgence — Vayrix" }] }),
  component: Emergency,
});

function Emergency() {
  const navigate = useNavigate();
  const [state, setState] = useState<AsyncState<EmergencyContact[]>>({ status: "loading" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  const load = async () => {
    setState({ status: "loading" });
    try {
      const list = await userService.listContacts();
      setState(list.length ? { status: "success", data: list } : { status: "empty" });
    } catch (e) {
      setState({ status: "error", message: (e as Error).message });
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !phone) {
      toast.error("Nom et téléphone requis");
      return;
    }
    await userService.addContact({ name, phone, relation: relation || "Contact" });
    toast.success("Contact ajouté");
    setName(""); setPhone(""); setRelation("");
    load();
  };

  const remove = async (id: string) => {
    await userService.removeContact(id);
    toast("Contact supprimé");
    load();
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Contacts d'urgence</h1>
        </div>

        <div className="flex-1 px-5 space-y-4">
          <QueryView state={state} onRetry={load} emptyLabel="Aucun contact enregistré">
            {(list) => (
              <div className="space-y-2">
                {list.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#141B3D] border border-white/5">
                    <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center">
                      <User className="h-4 w-4 text-[#7B5CFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-[#B8BED6]">{c.relation} · {c.phone}</p>
                    </div>
                    <button
                      onClick={() => remove(c.id)}
                      className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </QueryView>

          <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Ajouter un contact</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className="input-mock" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="input-mock" />
            <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation" className="input-mock" />
            <button
              onClick={add}
              className="w-full h-11 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Ajouter
            </button>
          </div>
        </div>
      </div>
      <style>{`.input-mock { width:100%; height:44px; border-radius:12px; background:#0A0E27; border:1px solid rgba(255,255,255,0.05); padding:0 12px; color:white; outline:none; font-size:14px; }`}</style>
    </PhoneFrame>
  );
}
