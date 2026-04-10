import * as React from "react";
import styles from "./ApprovalRulesConfig.module.scss";

export const ApprovalRulesConfig: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Approval Rules Configuration</h3>
      <p className={styles.subtitle}>
        Configure approval chains, approvers, and escalation rules.
      </p>
      <div className={styles.placeholder}>
        Approval rules editor will be implemented here with chain management,
        approver assignment, and threshold configuration.
      </div>
    </div>
  );
};
