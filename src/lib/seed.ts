import { useMissions } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useConstitution } from "@/stores/constitution";
import { useMomentum } from "@/stores/momentum";

const SEED_FLAG = "blueverse:seeded:v1";

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEED_FLAG)) return;

  const missions = useMissions.getState();
  if (missions.missions.length === 0) {
    missions.add({
      name: "Forge BlueVerse v1",
      domain: "Creative",
      missionClass: "Project",
      difficulty: "Epic",
      priority: "High",
      status: "Active",
      progress: 35,
      health: "Healthy",
      flagship: true,
      supportingFlagship: false,
      story: "The first complete launch of the personal operating system.",
      successCriteria: "MVP shipped with Bridge, Missions, Finance, Archive, Constitution.",
      notes: "",
      recoveryPath: "",
    });
    missions.add({
      name: "Build Six-Month Runway",
      domain: "Finance",
      missionClass: "Financial",
      difficulty: "Advanced",
      priority: "Critical",
      status: "Active",
      progress: 48,
      health: "Needs Attention",
      flagship: true,
      supportingFlagship: false,
      story: "Stability is freedom. Build the cushion before the next leap.",
      successCriteria: "$X saved across emergency + operating funds.",
      notes: "",
      recoveryPath: "",
    });
    missions.add({
      name: "Daily Body Practice",
      domain: "Wellbeing",
      missionClass: "Maintenance",
      difficulty: "Routine",
      priority: "Medium",
      status: "Active",
      progress: 64,
      health: "Healthy",
      flagship: false,
      supportingFlagship: true,
      story: "The vessel must be cared for.",
      successCriteria: "Movement every day for 90 days.",
      notes: "",
      recoveryPath: "",
    });
  }

  const finance = useFinance.getState();
  if (finance.bills.length === 0) {
    finance.addBill({ name: "Rent", amount: 1450, dueDay: 1, category: "Housing" });
    finance.addBill({ name: "Internet", amount: 65, dueDay: 12, category: "Utilities" });
    finance.addBill({ name: "Subscriptions", amount: 48, dueDay: 20, category: "Software" });
    finance.addIncome({ source: "Primary Salary", amount: 4200, cadence: "Monthly" });
    finance.addDebt({ name: "Credit Card", balance: 1850, rate: 19.99, minPayment: 75 });
    finance.addSaving({ name: "Emergency Fund", target: 12000, current: 5800 });
  }

  const c = useConstitution.getState();
  if (!c.whatMatters) {
    c.setField("whatMatters", "Time, integrity, the people I love, and the work that outlives me.");
    c.setField("principles", "Move with intention. Tell the truth. Build slowly, ship constantly.");
    c.setField("vision", "A life of focused creation, deep relationships, and quiet strength.");
    c.setField("lessons", "Pressure passes. Systems beat willpower. Start before you're ready.");
  }

  useMomentum.getState().log("system", "BlueVerse bridge online. Systems calibrated.");

  window.localStorage.setItem(SEED_FLAG, "1");
}
