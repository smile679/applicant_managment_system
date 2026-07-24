import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../api/dashboard";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BiSolidError } from "react-icons/bi";
import { HiUsers, HiClock, HiCheckCircle, HiXCircle } from "react-icons/hi";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const STATUS_COLORS = {
  pending: "#eab308",
  shortlisted: "#3b82f6",
  accepted: "#22c55e",
  rejected: "#ef4444",
};

const statusChartConfig = {
  pending: { label: "Pending", color: STATUS_COLORS.pending },
  shortlisted: { label: "Shortlisted", color: STATUS_COLORS.shortlisted },
  accepted: { label: "Accepted", color: STATUS_COLORS.accepted },
  rejected: { label: "Rejected", color: STATUS_COLORS.rejected },
};

const trackChartConfig = {
  value: { label: "Applicants", color: "#6366f1" },
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load dashboard summary.";
      setError(message);
      toast.error(message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 md:p-6 flex flex-col items-center justify-center gap-3 py-20">
        <BiSolidError className="text-red-500 size-12" />
        <p className="text-red-500 font-medium">{error}</p>
        <Button variant="outline" onClick={fetchSummary}>
          Retry
        </Button>
      </div>
    );
  }

  if (!summary) return null;

   const totalApplicants = summary.totalApplicants;
   const pendingPercent = (
     (summary.byStatus.pending / totalApplicants) *
     100
   ).toFixed(1);

  const statusData = Object.entries(summary.byStatus).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name] || "#94a3b8",
  }));

  const trackData = Object.entries(summary.byTrack).map(([name, value]) => ({
    name: name.replace("-", "/"),
    value,
  }));

  const statCards = [
    {
      label: "Total Applicants",
      value: summary.totalApplicants,
      icon: HiUsers,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Pending",
      value: summary.byStatus.pending ?? 0,
      icon: HiClock,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      label: "Accepted",
      value: summary.byStatus.accepted ?? 0,
      icon: HiCheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Rejected",
      value: summary.byStatus.rejected ?? 0,
      icon: HiXCircle,
      color: "text-red-600 bg-red-100",
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-full ${color}`}>
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applicants by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut with center label */}
              <div className="relative shrink-0">
                <ChartContainer
                  config={statusChartConfig}
                  className="h-[220px] w-[220px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                {/* Center label, absolutely positioned over the donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold">{totalApplicants}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>

              {/* Custom legend with counts + percentages */}
              <div className="flex-1 w-full space-y-3">
                {statusData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <span className="capitalize text-muted-foreground">
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      {entry.value}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({((entry.value / totalApplicants) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info banner */}
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
              <span className="text-blue-600 font-semibold">
                {pendingPercent}%
              </span>
              <span className="text-muted-foreground">
                of applicants are still pending review.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applicants by Track</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trackChartConfig} className="h-70 w-full">
              <BarChart data={trackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
