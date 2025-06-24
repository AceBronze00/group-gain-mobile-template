
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  email: string;
  phone: string;
}

interface QuickInfoCardProps {
  user: User;
}

const QuickInfoCard = ({ user }: QuickInfoCardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Email</span>
          <span className="text-blue-600 text-sm">{user.email}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Phone</span>
          <span className="text-blue-600 text-sm">{user.phone}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Verification Status</span>
          <Badge className="bg-green-500">Verified</Badge>
        </div>
      </div>
    </Card>
  );
};

export default QuickInfoCard;
