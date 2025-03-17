import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { MatchData } from "@/app/types";

type MatchTableProps = {
  data: MatchData[];
};

export function MatchTable({ data }: MatchTableProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No match data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
        <Text style={[styles.headerCell, styles.timeCell]}>Time</Text>
        <Text style={[styles.headerCell, styles.coordCell]}>Location</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.actionCell]} numberOfLines={1}>
              {item.id}
            </Text>
            <Text style={[styles.cell, styles.timeCell]}>{item.timestamp}</Text>
            <Text style={[styles.cell, styles.coordCell]}>
              {item.x !== undefined && item.y !== undefined
                ? `(${item.x.toFixed(0)}, ${item.y.toFixed(0)})`
                : "-"}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 10,
  },
  headerCell: {
    fontWeight: "600",
    color: "#475569",
    fontSize: 14,
  },
  cell: {
    fontSize: 14,
    color: "#1e293b",
  },
  actionCell: {
    flex: 2,
    paddingHorizontal: 12,
  },
  timeCell: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  coordCell: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: "right",
  },
  scrollView: {
    maxHeight: 300,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
});
