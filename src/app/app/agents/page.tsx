import Link from "next/link";
import { Plus } from "lucide-react";
import { RealAgentList } from "@/features/agents/real-agent-list";
import { PageHeader } from "@/components/ui";
export default function AgentsPage(){return <><PageHeader eyebrow="Owner-scoped wallet registry" title="Agents" action={<Link href="/app/agents/new" className="button"><Plus size={15}/>New agent</Link>}/><RealAgentList/></>}
