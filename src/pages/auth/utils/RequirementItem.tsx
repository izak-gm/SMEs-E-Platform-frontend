import { Check, X } from "lucide-react";

interface RequirementItemProps {
  met: boolean;
  text: string;
}

export default function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <li className="flex items-center space-x-2">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-600" : "text-gray-600"}>{text}</span>
    </li>
  );
}
