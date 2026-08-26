import { PageHeader, Status } from "@/components/ui";
import { ActivityTimeline } from "@/features/activity/activity-timeline";
export default function ActivityPage(){return <><PageHeader eyebrow="Audit-ready event model" title="Activity" action={<Status tone="neutral">Demo events</Status>}/><p className="mb-8 max-w-2xl text-sm text-muted">A prototype event timeline prepared for future signed intent and transaction lifecycle records.</p><ActivityTimeline/></>}
