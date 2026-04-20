/**
 * BID phases configuration â€” Phase definitions and RACI tasks mapping.
 */
import { BidPhase } from "../models/IBidStatus";

export interface IPhaseTask {
  taskId: string;
  name: string;
  phase: BidPhase;
  isConditional: boolean;
  condition?: string;
  defaultAssigneeRole: string;
}

export const PHASES_CONFIG: {
  id: BidPhase;
  label: string;
  order: number;
  color: string;
  description: string;
  tasks: IPhaseTask[];
}[] = [
  {
    id: "Request Submitted",
    label: "Request Submitted",
    order: 0,
    color: "#94A3B8",
    description: "Comercial cria a solicitação",
    tasks: [],
  },
  {
    id: "Bid Kick Off",
    label: "Bid Kick Off",
    order: 1,
    color: "#3B82F6",
    description: "Reunião inicial, documentação, clarificações",
    tasks: [
      {
        taskId: "1.1",
        name: "Send E-mail with Client Request",
        phase: "Bid Kick Off",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
      {
        taskId: "1.2",
        name: "Schedule a Kick Off Meeting",
        phase: "Bid Kick Off",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
      {
        taskId: "1.3",
        name: "Consult Lessons Learned Portal",
        phase: "Bid Kick Off",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
      {
        taskId: "1.4",
        name: "Send Initial Clarification",
        phase: "Bid Kick Off",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
    ],
  },
  {
    id: "Technical Analysis",
    label: "Technical Analysis",
    order: 2,
    color: "#06B6D4",
    description: "Análise de documentação, escopo, horas, GAP",
    tasks: [
      {
        taskId: "2.1",
        name: "Client Documentation Analysis",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.2",
        name: "Elaboration of Clarifications on Client's Request",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.3",
        name: "Elaboration ROV BID Checklist",
        phase: "Technical Analysis",
        isConditional: true,
        condition: "Only if system not yet defined for the opportunity",
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.4",
        name: "Send Current Contract Inventory",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.5",
        name: "Scope of Supply Elaboration",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.6",
        name: "Engineering Hours Estimation",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.7",
        name: "Send Scope of Supply List",
        phase: "Technical Analysis",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "2.8",
        name: "New Contract GAP Analysis Elaboration",
        phase: "Technical Analysis",
        isConditional: true,
        condition: "Only for new contracts based on technical specification",
        defaultAssigneeRole: "engineering",
      },
    ],
  },
  {
    id: "Cost & Resources",
    label: "Cost & Resources",
    order: 3,
    color: "#8B5CF6",
    description: "Levantamento de custos, recursos, Smart BID",
    tasks: [
      {
        taskId: "3.1",
        name: "Send In-House Asset based on Scope of Supply List",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.2",
        name: "General PeopleSoft Asset Cost Verification",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
      {
        taskId: "3.3",
        name: "Request Costs for New Product (not in PSFT)",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
      {
        taskId: "3.4",
        name: "Request SSR New System Costs",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.5",
        name: "Request ROV Life Extension Costs / RTS",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.6",
        name: "Request System Installation/Mob/Demob Costs",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.7",
        name: "Responsibility Matrix Elaboration",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.8",
        name: "Onshore/Offshore Resource Planning",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.9",
        name: "Smart BID Elaboration",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "3.10",
        name: "Smart BID Review",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
      {
        taskId: "3.11",
        name: "Smart BID Approval",
        phase: "Cost & Resources",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
    ],
  },
  {
    id: "Technical Proposal",
    label: "Technical Proposal",
    order: 4,
    color: "#EC4899",
    description: "Elaboração, revisão e aprovação da proposta",
    tasks: [
      {
        taskId: "4.1",
        name: "Technical Proposal Elaboration",
        phase: "Technical Proposal",
        isConditional: false,
        defaultAssigneeRole: "engineering",
      },
      {
        taskId: "4.2",
        name: "Technical Proposal Review",
        phase: "Technical Proposal",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
      {
        taskId: "4.3",
        name: "Technical Proposal Approval",
        phase: "Technical Proposal",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
    ],
  },
  {
    id: "Close Out",
    label: "Close Out",
    order: 5,
    color: "#10B981",
    description: "Fechamento técnico, entrega ao comercial",
    tasks: [
      {
        taskId: "5.1",
        name: "Send Technical Close Out e-mail",
        phase: "Close Out",
        isConditional: false,
        defaultAssigneeRole: "project",
      },
    ],
  },
];

export function getPhaseConfig(phase: BidPhase) {
  return PHASES_CONFIG.find((p) => p.id === phase);
}

export function getPhaseLabel(phase: BidPhase): string {
  return getPhaseConfig(phase)?.label ?? phase;
}

export function getPhaseTasks(phase: BidPhase): IPhaseTask[] {
  return getPhaseConfig(phase)?.tasks ?? [];
}

export function getAllTasks(): IPhaseTask[] {
  const result: IPhaseTask[] = [];
  PHASES_CONFIG.forEach((p) => {
    p.tasks.forEach((t) => result.push(t));
  });
  return result;
}

/** Alias for backward compatibility */
export const PHASE_CONFIGS = PHASES_CONFIG;
