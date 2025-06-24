
import { Card } from "@/components/ui/card";

const GroupStatistics = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">My Group Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600">Completed Groups</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">98%</div>
          <div className="text-sm text-gray-600">On-Time Payments</div>
        </div>
      </div>
    </Card>
  );
};

export default GroupStatistics;
