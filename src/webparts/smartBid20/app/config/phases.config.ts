/**
 * BID phases configuration — Phase definitions and RACI tasks mapping.
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
    id: "PHASE_0",
    label: "Request",
    order: 0,
    color: "#94A3B8",
    description: "Comercial cria a solicitação",
    tasks: [],
  },
  {
    id: "PHASE_1",
    label: "Bid Kick Off",
    order: 1,
    color: "#3B82F6",
    description: "Reunião inicial, documentação, clarificações",
    tasks: [
      {
        taskId: "1.1",
        name: "Send E-mail with Client Request",
        phase: "PHASE_1",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
      {
        taskId: "1.2",
        name: "Schedule a Kick Off Meeting",
        phase: "PHASE_1",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
      {
        taskId: "1.3",
        name: "Consult Lessons Learned Portal",
        phase: "PHASE_1",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
      {
        taskId: "1.4",
        name: "Send Initial Clarification",
        phase: "PHASE_1",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
    ],
  },
  {
    id: "PHASE_2",
    label: "Technical Analysis",
    order: 2,
    color: "#06B6D4",
    description: "Análise de documentação, escopo, horas, GAP",
    tasks: [
      {
        taskId: "2.1",
        name: "Client Documentation Analysis",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.2",
        name: "Elaboration of Clarifications on Client's Request",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.3",
        name: "Elaboration ROV BID Checklist",
        phase: "PHASE_2",
        isConditional: true,
        condition: "Only if system not yet defined for the opportunity",
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.4",
        name: "Send Current Contract Inventory",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.5",
        name: "Scope of Supply Elaboration",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.6",
        name: "Engineering Hours Estimation",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.7",
        name: "Send Scope of Supply List",
        phase: "PHASE_2",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "2.8",
        name: "New Contract GAP Analysis Elaboration",
        phase: "PHASE_2",
        isConditional: true,
        condition: "Only for new contracts based on technical specification",
        defaultAssigneeRole: "engineer",
      },
    ],
  },
  {
    id: "PHASE_3",
    label: "Cost & Resources",
    order: 3,
    color: "#8B5CF6",
    description: "Levantamento de custos, recursos, Smart BID",
    tasks: [
      {
        taskId: "3.1",
        name: "Send In-House Asset based on Scope of Supply List",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.2",
        name: "General PeopleSoft Asset Cost Verification",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
      {
        taskId: "3.3",
        name: "Request Costs for New Product (not in PSFT)",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "bidder",
      },
      {
        taskId: "3.4",
        name: "Request SSR New System Costs",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.5",
        name: "Request ROV Life Extension Costs / RTS",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.6",
        name: "Request System Installation/Mob/Demob Costs",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.7",
        name: "Responsibility Matrix Elaboration",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.8",
        name: "Onshore/Offshore Resource Planning",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.9",
        name: "Smart BID Elaboration",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "3.10",
        name: "Smart BID Review",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
      {
        taskId: "3.11",
        name: "Smart BID Approval",
        phase: "PHASE_3",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
    ],
  },
  {
    id: "PHASE_4",
    label: "Technical Proposal",
    order: 4,
    color: "#EC4899",
    description: "Elaboração, revisão e aprovação da proposta",
    tasks: [
      {
        taskId: "4.1",
        name: "Technical Proposal Elaboration",
        phase: "PHASE_4",
        isConditional: false,
        defaultAssigneeRole: "engineer",
      },
      {
        taskId: "4.2",
        name: "Technical Proposal Review",
        phase: "PHASE_4",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
      {
        taskId: "4.3",
        name: "Technical Proposal Approval",
        phase: "PHASE_4",
        isConditional: false,
        defaultAssigneeRole: "manager",
      },
    ],
  },
  {
    id: "PHASE_5",
    label: "Close Out",
    order: 5,
    color: "#10B981",
    description: "Fechamento técnico, entrega ao comercial",
    tasks: [
      {
        taskId: "5.1",
        name: "Send Technical Close Out e-mail",
        phase: "PHASE_5",
        isConditional: false,
        defaultAssigneeRole: "bidder",
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
