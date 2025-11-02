import { Rocket, Users, Lightbulb, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

type FilterType = "all" | "proyecto" | "equipo" | "idea" | "evento" | "text";

interface QuickActionsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const QuickActions = ({ activeFilter, onFilterChange }: QuickActionsProps) => {
  const actions = [
    { icon: Rocket, label: "Proyectos", gradient: "from-blue-500 to-blue-600", filter: "proyecto" as FilterType },
    { icon: Users, label: "Equipos", gradient: "from-green-500 to-green-600", filter: "equipo" as FilterType },
    { icon: Lightbulb, label: "Ideas", gradient: "from-yellow-500 to-yellow-600", filter: "idea" as FilterType },
    { icon: Calendar, label: "Eventos", gradient: "from-purple-500 to-purple-600", filter: "evento" as FilterType },
  ];

  return (
    <div className="mb-6 bg-card border-y border-border">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {actions.map((action, idx) => {
            const isActive = activeFilter === action.filter;
            return (
              <button
                key={idx}
                onClick={() => onFilterChange(activeFilter === action.filter ? "all" : action.filter)}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl transition-all duration-200 group hover:shadow-md hover:scale-105 ${
                  isActive ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-secondary/50"
                }`}
              >
                <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-md group-hover:shadow-lg transition-all ${
                  isActive ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
