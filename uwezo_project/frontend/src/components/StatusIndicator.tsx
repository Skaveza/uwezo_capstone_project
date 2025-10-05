import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface StatusIndicatorProps {
  status: "verified" | "flagged" | "rejected";
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    verified: {
      icon: CheckCircle,
      label: "Verified",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
      iconColor: "text-green-600"
    },
    flagged: {
      icon: AlertTriangle,
      label: "Flagged",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
      iconColor: "text-red-600"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`gap-1 ${config.className}`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
}