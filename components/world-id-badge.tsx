import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface WorldIdBadgeProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export default function WorldIdBadge({ size = "md", showIcon = true, className = "" }: WorldIdBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <Badge className={`world-id-badge ${sizeClasses[size]} ${className}`}>
      {showIcon && <Eye className={iconSizes[size]} />}
      <span>Verified by World ID</span>
    </Badge>
  )
}