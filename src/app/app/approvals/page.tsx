import { PageHeader, Status } from "@/components/ui";
import { ApprovalQueue } from "@/features/approvals/approval-queue";
import { demoApprovals } from "@/data/demo";
export default function ApprovalsPage(){return <><PageHeader eyebrow="Human control boundary" title="Approval queue" action={<Status tone="warn">{demoApprovals.length} pending</Status>}/><p className="mb-8 max-w-2xl text-sm text-muted">Prototype decisions update local component state only. They do not sign, submit, or simulate blockchain transactions.</p><ApprovalQueue/></>}
