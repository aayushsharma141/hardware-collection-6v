/**
 * ReviewResult Interface v2.0
 * 
 * Standardized communication protocol for agent handoffs within the Product OS v2 Confidence Engine.
 * All specialist agents MUST output this schema when concluding their execution.
 */

export interface ReviewResult {
  /** The ID of the agent executing the review (e.g., 'frontend-coder', 'accessibility-auditor') */
  agentId: string;

  /** Overall status of the task execution */
  status: 'PASS' | 'WARNING' | 'FAIL';

  /** 
   * Compliance or quality score from 0 to 100.
   */
  score: number;

  /**
   * Agent's confidence score in its own assessment from 0.00 to 1.00.
   * Low confidence (<0.75) automatically flags needsHumanReview.
   */
  confidence: number;

  /**
   * Flag indicating whether human override or review is strictly required.
   */
  needsHumanReview: boolean;

  /** 
   * Hard blockers that prevent merging or release.
   * If this array is not empty, status MUST be 'FAIL'.
   */
  blockers: Issue[];

  /**
   * Non-critical issues that should be logged as technical debt or addressed later.
   */
  warnings: Issue[];

  /** List of files that were modified during this execution */
  affectedFiles: string[];

  /**
   * Dynamically requested follow-up agents based on discovered issues.
   */
  requestedFollowUpAgents: string[];
}

export interface Issue {
  /** The policy rule ID that was violated (e.g., 'pol-design-001.typography') */
  ruleId: string;
  
  /** Human-readable description of the issue */
  description: string;

  /** The specific file where the issue occurred */
  file: string;

  /** Optional line number for code-level issues */
  line?: number;

  /** Issue severity level */
  severity: 'blocker' | 'warning' | 'info';
}
