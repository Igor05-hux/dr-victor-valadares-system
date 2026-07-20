"use client";

import type { Tooth } from "@/types/odontogram";

interface ToothCardProps {
  tooth: Tooth;
  onClick?: (tooth: Tooth) => void;
}

const statusColors = {
  healthy: "bg-green-100 border-green-500 text-green-700",
  caries: "bg-red-100 border-red-500 text-red-700",
  restoration: "bg-yellow-100 border-yellow-500 text-yellow-700",
  "root-canal": "bg-blue-100 border-blue-500 text-blue-700",
  implant: "bg-purple-100 border-purple-500 text-purple-700",
  extracted: "bg-gray-200 border-gray-500 text-gray-700",
};

export function ToothCard({
  tooth,
  onClick,
}: ToothCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(tooth)}
      className={`
        h-14 w-14
        rounded-xl
        border-2
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-md
        ${statusColors[tooth.status]}
      `}
      title={tooth.name}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-lg font-bold">
          {tooth.number}
        </span>

        <span className="text-[10px]">
          Dente
        </span>
      </div>
    </button>
  );
}