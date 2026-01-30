'use client';

import { Task, EnergyType, WorkContext } from '@/types/task';
import { getDateStatus, DateStatus } from './date-utils';

// Keywords that suggest energy type (simple heuristic - no AI required)
const DEEP_FOCUS_PATTERNS = [
  /\b(write|draft|design|develop|build|create|plan|analyze|research|review|implement|architect|refactor|debug)\b/i,
  /\b(proposal|report|strategy|document|specification|wireframe|prototype)\b/i,
  /\b(presentation|pitch|roadmap|analysis)\b/i,
];

const QUICK_WIN_PATTERNS = [
  /\b(call|email|text|message|reply|respond|send|check|confirm|approve|sign|pay|book|order|buy|schedule|ping)\b/i,
  /\b(quick|fast|5.?min|10.?min|brief|simple)\b/i,
];

const ADMIN_PATTERNS = [
  /\b(expense|invoice|receipt|timesheet|update|sync|backup|organize|clean|file|sort|cancel|renew|password)\b/i,
  /\b(admin|setup|configure|install|maintain|submit|register)\b/i,
];

/**
 * Auto-classify task energy type based on title content
 */
export function classifyEnergyType(title: string): EnergyType {
  // Check patterns in order of specificity
  if (QUICK_WIN_PATTERNS.some(p => p.test(title))) return 'quick';
  if (ADMIN_PATTERNS.some(p => p.test(title))) return 'admin';
  if (DEEP_FOCUS_PATTERNS.some(p => p.test(title))) return 'deep';
  
  // Default based on title length (longer = likely deeper work)
  return title.length > 40 ? 'deep' : 'quick';
}

// ============================================
// CONTEXT GROUPING
// ============================================

const CONTEXT_PATTERNS: Record<WorkContext, RegExp[]> = {
  client: [
    /\b(client|customer|stakeholder|meeting|call|proposal|invoice|deliverable)\b/i,
    /\b(presentation|demo|onboarding|support|feedback)\b/i,
  ],
  product: [
    /\b(build|develop|ship|deploy|feature|bug|fix|test|code|design|prototype|mvp)\b/i,
    /\b(roadmap|sprint|backlog|release|launch|iteration)\b/i,
  ],
  admin: [
    /\b(expense|hr|payroll|legal|compliance|tax|insurance|contract|invoice)\b/i,
    /\b(admin|operations|finance|accounting|setup)\b/i,
  ],
  personal: [
    /\b(personal|home|family|health|doctor|dentist|gym|grocery|appointment)\b/i,
    /\b(birthday|vacation|travel|hobby)\b/i,
  ],
  general: [], // Fallback
};

/**
 * Auto-classify task work context based on title and project
 */
export function classifyWorkContext(task: Task): WorkContext {
  const title = task.title.toLowerCase();
  const projectName = task.project?.name?.toLowerCase() || '';
  const combined = `${title} ${projectName}`;

  // Check each context pattern
  for (const [context, patterns] of Object.entries(CONTEXT_PATTERNS) as [WorkContext, RegExp[]][]) {
    if (context === 'general') continue;
    if (patterns.some(p => p.test(combined))) {
      return context;
    }
  }

  // Fallback based on project
  if (projectName.includes('work')) return 'product';
  if (projectName.includes('personal')) return 'personal';
  
  return 'general';
}

// ============================================
// SILENT PRIORITIZATION
// ============================================

interface TaskScore {
  task: Task;
  urgencyScore: number;
  energyScore: number;
  contextScore: number;
}

/**
 * Calculate urgency score (higher = more urgent)
 */
function getUrgencyScore(task: Task): number {
  const status = getDateStatus(task.dueDate);
  
  const urgencyMap: Record<DateStatus, number> = {
    overdue: 100,
    today: 80,
    tomorrow: 60,
    upcoming: 40,
    future: 20,
    none: 10,
  };
  
  return urgencyMap[status];
}

/**
 * Calculate energy preference score for time of day
 * Morning: favor deep work
 * Afternoon: favor admin
 * Late: favor quick wins
 */
function getEnergyTimeScore(energyType: EnergyType): number {
  const hour = new Date().getHours();
  
  // Morning (before noon): favor deep work
  if (hour < 12) {
    return energyType === 'deep' ? 10 : energyType === 'quick' ? 5 : 3;
  }
  // Afternoon (12-17): balanced
  if (hour < 17) {
    return energyType === 'admin' ? 8 : energyType === 'quick' ? 6 : 4;
  }
  // Evening: favor quick wins to wrap up
  return energyType === 'quick' ? 10 : energyType === 'admin' ? 5 : 2;
}

/**
 * Smart sort tasks for execution mode
 * Priority: Urgency > Energy fit > Context clustering
 */
export function sortTasksForExecution(tasks: Task[]): Task[] {
  if (tasks.length === 0) return [];

  const scored: TaskScore[] = tasks.map(task => {
    const energyType = task.energyType || classifyEnergyType(task.title);
    
    return {
      task,
      urgencyScore: getUrgencyScore(task),
      energyScore: getEnergyTimeScore(energyType),
      contextScore: 0, // Reserved for future use
    };
  });

  // Sort by combined score (urgency is weighted highest)
  scored.sort((a, b) => {
    const scoreA = a.urgencyScore * 10 + a.energyScore;
    const scoreB = b.urgencyScore * 10 + b.energyScore;
    return scoreB - scoreA;
  });

  return scored.map(s => s.task);
}

/**
 * Group tasks by work context for display
 */
export function groupTasksByContext(tasks: Task[]): Map<WorkContext, Task[]> {
  const groups = new Map<WorkContext, Task[]>();
  
  // Initialize empty groups
  const contextOrder: WorkContext[] = ['client', 'product', 'admin', 'personal', 'general'];
  contextOrder.forEach(ctx => groups.set(ctx, []));

  // Classify and group
  tasks.forEach(task => {
    const context = task.workContext || classifyWorkContext(task);
    const group = groups.get(context) || [];
    group.push(task);
    groups.set(context, group);
  });

  // Remove empty groups
  contextOrder.forEach(ctx => {
    if (groups.get(ctx)?.length === 0) {
      groups.delete(ctx);
    }
  });

  return groups;
}

/**
 * Get display label for work context
 */
export function getContextLabel(context: WorkContext): string {
  const labels: Record<WorkContext, string> = {
    client: 'Client Work',
    product: 'Product & Build',
    admin: 'Admin',
    personal: 'Personal',
    general: 'Tasks',
  };
  return labels[context];
}

/**
 * Get display label for energy type
 */
export function getEnergyLabel(energy: EnergyType): string {
  const labels: Record<EnergyType, string> = {
    deep: 'Deep Focus',
    quick: 'Quick Win',
    admin: 'Admin',
  };
  return labels[energy];
}
