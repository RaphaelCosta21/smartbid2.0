export interface IBidTemplate {
  id: string;
  name: string;
  description: string;
  division: string;
  serviceLine: string;
  equipmentCount: number;
  createdBy: string;
  createdDate: string;
  lastUsed: string | null;
  usageCount: number;
  isActive: boolean;
  tags: string[];
}

export const MOCK_TEMPLATES: IBidTemplate[] = [
  {
    id: "tpl-001",
    name: "Standard ROV IMR Spread",
    description:
      "Standard equipment spread for ROV IMR campaigns including 2x WROV, TMS, tooling, and spares.",
    division: "SSR-ROV",
    serviceLine: "IMR",
    equipmentCount: 24,
    createdBy: "João Silva",
    createdDate: "2025-06-15T10:00:00Z",
    lastUsed: "2026-03-20T09:00:00Z",
    usageCount: 12,
    isActive: true,
    tags: ["ROV", "IMR", "Standard"],
  },
  {
    id: "tpl-002",
    name: "Survey Multibeam Package",
    description:
      "Survey equipment package with multibeam sonar, USBL, sound velocity profiler, and processing software.",
    division: "SSR-Survey",
    serviceLine: "Survey",
    equipmentCount: 15,
    createdBy: "Carlos Mendes",
    createdDate: "2025-08-01T10:00:00Z",
    lastUsed: "2026-03-28T09:00:00Z",
    usageCount: 8,
    isActive: true,
    tags: ["Survey", "Multibeam", "Standard"],
  },
  {
    id: "tpl-003",
    name: "UWILD Inspection Equipment",
    description:
      "Underwater inspection equipment spread for UWILD campaigns including cameras, CP probes, and cleaning tools.",
    division: "SSR-ROV",
    serviceLine: "UWILD",
    equipmentCount: 18,
    createdBy: "Pedro Almeida",
    createdDate: "2025-10-10T10:00:00Z",
    lastUsed: "2026-02-15T09:00:00Z",
    usageCount: 5,
    isActive: true,
    tags: ["UWILD", "Inspection", "Cameras"],
  },
  {
    id: "tpl-004",
    name: "OPG Installation Tooling",
    description:
      "Standard OPG installation tooling package including rigging, lifting hardware, and subsea connectors.",
    division: "OPG",
    serviceLine: "Installation",
    equipmentCount: 32,
    createdBy: "Ricardo Ferreira",
    createdDate: "2025-11-20T10:00:00Z",
    lastUsed: "2026-03-10T09:00:00Z",
    usageCount: 6,
    isActive: true,
    tags: ["OPG", "Installation", "Tooling"],
  },
  {
    id: "tpl-005",
    name: "Integrated IMR Campaign",
    description:
      "Full integrated ROV + Survey equipment spread for large integrated campaigns.",
    division: "SSR-Integrated",
    serviceLine: "IMR",
    equipmentCount: 45,
    createdBy: "Raphael Costa",
    createdDate: "2026-01-05T10:00:00Z",
    lastUsed: null,
    usageCount: 0,
    isActive: true,
    tags: ["Integrated", "IMR", "Full Spread"],
  },
];
