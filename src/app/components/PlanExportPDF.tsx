"use client";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { GoalPlan } from "../types/pipeline";
import { ACCENT as LIME_HEX, NAVY as NAVY_HEX } from "@/app/theme";
const TEXT_COLOR = "#1a2a40";
const TEXT_LIGHT = "#5a7090";
const BORDER = "#e0e8f0";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: LIME_HEX,
    paddingBottom: 20,
  },
  brand: {
    fontSize: 10,
    color: TEXT_LIGHT,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: NAVY_HEX,
    marginBottom: 6,
  },
  goalText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    lineHeight: 1.5,
  },
  meta: {
    flexDirection: "row",
    gap: 24,
    marginTop: 12,
  },
  metaItem: {
    fontSize: 9,
    color: TEXT_LIGHT,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  phaseContainer: {
    marginBottom: 24,
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  phaseNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: LIME_HEX,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  phaseNumberText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY_HEX,
  },
  phaseName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: TEXT_COLOR,
  },
  phaseDuration: {
    fontSize: 10,
    color: TEXT_LIGHT,
    marginLeft: "auto",
  },
  phaseGoal: {
    fontSize: 11,
    color: TEXT_LIGHT,
    lineHeight: 1.5,
    marginBottom: 10,
    paddingLeft: 38,
  },
  milestoneLabel: {
    fontSize: 8,
    color: TEXT_LIGHT,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
    paddingLeft: 38,
  },
  milestone: {
    fontSize: 10,
    color: TEXT_COLOR,
    lineHeight: 1.5,
    paddingLeft: 48,
    marginBottom: 3,
  },
  stepContainer: {
    paddingLeft: 38,
    marginTop: 8,
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: TEXT_COLOR,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 10,
    color: TEXT_LIGHT,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  stepMetric: {
    fontSize: 9,
    color: "#0a5c3a",
    lineHeight: 1.4,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: TEXT_LIGHT,
  },
});

function PlanDocument({ plan, userName }: { plan: GoalPlan; userName: string }) {
  const dateStr = new Date(plan.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Behavio</Text>
          <Text style={styles.title}>
            {userName ? `${userName}'s ` : ""}
            {plan.horizon_weeks}-Week Plan
          </Text>
          <Text style={styles.goalText}>{plan.goal_raw}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaItem}>{plan.phases.length} phases</Text>
            <Text style={styles.metaItem}>{plan.horizon_weeks} weeks</Text>
            <Text style={styles.metaItem}>Generated {dateStr}</Text>
          </View>
        </View>

        {/* Phases */}
        {plan.phases.map((phase) => (
          <View key={phase.phase_number} style={styles.phaseContainer} wrap={false}>
            <View style={styles.phaseHeader}>
              <View style={styles.phaseNumber}>
                <Text style={styles.phaseNumberText}>{phase.phase_number}</Text>
              </View>
              <Text style={styles.phaseName}>{phase.phase_name}</Text>
              <Text style={styles.phaseDuration}>
                {phase.duration_weeks} week{phase.duration_weeks !== 1 ? "s" : ""}
              </Text>
            </View>

            <Text style={styles.phaseGoal}>{phase.goal}</Text>

            {phase.milestones.length > 0 && (
              <>
                <Text style={styles.milestoneLabel}>Milestones</Text>
                {phase.milestones.map((m, i) => (
                  <Text key={i} style={styles.milestone}>
                    {m}
                  </Text>
                ))}
              </>
            )}

            {phase.steps.map((step) => (
              <View key={step.step_number} style={styles.stepContainer}>
                <Text style={styles.stepTitle}>
                  {step.step_number}. {step.title}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
                {step.success_metric && (
                  <Text style={styles.stepMetric}>{step.success_metric}</Text>
                )}
              </View>
            ))}

            <View style={styles.divider} />
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by Behavio</Text>
          <Text style={styles.footerText}>{dateStr}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generatePlanPDF(plan: GoalPlan, userName: string): Promise<Blob> {
  const blob = await pdf(<PlanDocument plan={plan} userName={userName} />).toBlob();
  return blob;
}

export function downloadPlanPDF(plan: GoalPlan, userName: string) {
  generatePlanPDF(plan, userName).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `behavio-plan-${plan.goal_key || "roadmap"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
