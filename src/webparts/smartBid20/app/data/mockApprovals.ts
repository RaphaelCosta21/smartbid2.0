import { IApprovalFlow } from "../models/IApprovalFlow";

export const mockApprovals: IApprovalFlow[] = [
  {
    bidNumber: "BID-2026-042",
    type: "bid-approval",
    status: "pending",
    requestedBy: {
      name: "Marcos Santos",
      email: "msantos@oceaneering.com",
      role: "Commercial Coordinator",
    },
    requestedDate: "2026-04-18T14:00:00Z",
    completedDate: null,
    chains: [
      {
        chainId: "CHAIN-001",
        chainName: "SSR-ROV Standard Approval",
        division: "SSR-ROV",
        currentStep: 1,
        status: "pending",
        steps: [
          {
            stepOrder: 0,
            approver: {
              name: "Paulo Ribeiro",
              email: "pribeiro@oceaneering.com",
              role: "Technical Lead",
            },
            role: "Technical Lead",
            decision: "approved",
            decisionDate: "2026-04-18T16:30:00Z",
            comments: "Technical scope looks good. Equipment list is accurate.",
          },
          {
            stepOrder: 1,
            approver: {
              name: "Roberto Almeida",
              email: "ralmeida@oceaneering.com",
              role: "Operations Manager",
            },
            role: "Operations Manager",
            decision: null,
            decisionDate: null,
            comments: null,
          },
          {
            stepOrder: 2,
            approver: {
              name: "Carlos Director",
              email: "cdirector@oceaneering.com",
              role: "Country Manager",
            },
            role: "Country Manager",
            decision: null,
            decisionDate: null,
            comments: null,
          },
        ],
      },
    ],
  },
  {
    bidNumber: "BID-2026-038",
    type: "proposal-approval",
    status: "approved",
    requestedBy: {
      name: "Fernanda Lima",
      email: "flima@oceaneering.com",
      role: "Bidder",
    },
    requestedDate: "2026-04-12T09:00:00Z",
    completedDate: "2026-04-14T11:15:00Z",
    chains: [
      {
        chainId: "CHAIN-002",
        chainName: "Survey Approval Chain",
        division: "Survey",
        currentStep: 2,
        status: "approved",
        steps: [
          {
            stepOrder: 0,
            approver: {
              name: "Paulo Ribeiro",
              email: "pribeiro@oceaneering.com",
              role: "Technical Lead",
            },
            role: "Technical Lead",
            decision: "approved",
            decisionDate: "2026-04-12T15:00:00Z",
            comments: "Approved. Survey plan meets IMCA requirements.",
          },
          {
            stepOrder: 1,
            approver: {
              name: "Roberto Almeida",
              email: "ralmeida@oceaneering.com",
              role: "Operations Manager",
            },
            role: "Operations Manager",
            decision: "approved",
            decisionDate: "2026-04-13T10:30:00Z",
            comments: "Vessel availability confirmed. Proceed.",
          },
          {
            stepOrder: 2,
            approver: {
              name: "Carlos Director",
              email: "cdirector@oceaneering.com",
              role: "Country Manager",
            },
            role: "Country Manager",
            decision: "approved",
            decisionDate: "2026-04-14T11:15:00Z",
            comments: "Final approval granted.",
          },
        ],
      },
    ],
  },
  {
    bidNumber: "BID-2026-035",
    type: "bid-approval",
    status: "rejected",
    requestedBy: {
      name: "Ana Costa",
      email: "acosta@oceaneering.com",
      role: "Commercial Coordinator",
    },
    requestedDate: "2026-04-10T08:00:00Z",
    completedDate: "2026-04-10T17:00:00Z",
    chains: [
      {
        chainId: "CHAIN-003",
        chainName: "Tooling Approval Chain",
        division: "Tooling",
        currentStep: 1,
        status: "rejected",
        steps: [
          {
            stepOrder: 0,
            approver: {
              name: "Paulo Ribeiro",
              email: "pribeiro@oceaneering.com",
              role: "Technical Lead",
            },
            role: "Technical Lead",
            decision: "approved",
            decisionDate: "2026-04-10T11:00:00Z",
            comments: "Technical review OK.",
          },
          {
            stepOrder: 1,
            approver: {
              name: "Roberto Almeida",
              email: "ralmeida@oceaneering.com",
              role: "Operations Manager",
            },
            role: "Operations Manager",
            decision: "rejected",
            decisionDate: "2026-04-10T17:00:00Z",
            comments:
              "Pricing below margin threshold. Needs revision on mobilization costs.",
          },
          {
            stepOrder: 2,
            approver: {
              name: "Carlos Director",
              email: "cdirector@oceaneering.com",
              role: "Country Manager",
            },
            role: "Country Manager",
            decision: null,
            decisionDate: null,
            comments: null,
          },
        ],
      },
    ],
  },
];
