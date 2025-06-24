
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Star } from "lucide-react";

interface PoolHistoryItemProps {
  pool: {
    id: number;
    groupName: string;
    status: string;
    totalAmount: number;
    myContribution: number;
    payout: number;
    participants: number;
    duration: string;
    completedDate?: string;
    failedDate?: string;
    reason?: string;
    membersToRate?: Array<{
      id: number;
      name: string;
      avatar: string;
      hasRated: boolean;
    }>;
  };
  onRateMember: (member: any, groupName: string) => void;
}

const PoolHistoryItem = ({ pool, onRateMember }: PoolHistoryItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {pool.status === 'completed' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800 text-sm">{pool.groupName}</h4>
            <Badge 
              className={`text-xs ${
                pool.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {pool.status === 'completed' ? 'Completed' : 'Failed'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <span className="text-gray-500">My Contribution:</span>
              <div className="font-medium">{formatCurrency(pool.myContribution)}</div>
            </div>
            <div>
              <span className="text-gray-500">
                {pool.status === 'completed' ? 'Payout:' : 'Refund:'}
              </span>
              <div className={`font-medium ${
                pool.status === 'completed' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {formatCurrency(pool.payout)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Total Pool:</span>
              <div className="font-medium">{formatCurrency(pool.totalAmount)}</div>
            </div>
            <div>
              <span className="text-gray-500">Participants:</span>
              <div className="font-medium">{pool.participants} members</div>
            </div>
          </div>

          {/* Members to Rate Section - only for completed groups */}
          {pool.status === 'completed' && pool.membersToRate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Rate Group Members</span>
                <span className="text-xs text-blue-600">
                  {pool.membersToRate.filter(m => !m.hasRated).length} pending
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {pool.membersToRate.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{member.name}</span>
                    </div>
                    <div>
                      {member.hasRated ? (
                        <Badge variant="outline" className="text-green-600 bg-green-50 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Rated
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onRateMember(member, pool.groupName)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-2"
                        >
                          <Star className="h-2 w-2 mr-1" />
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {pool.membersToRate.length > 3 && (
                  <div className="text-center">
                    <span className="text-xs text-gray-500">
                      +{pool.membersToRate.length - 3} more members
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Duration: {pool.duration}</span>
              <span>
                {pool.status === 'completed' ? 'Completed' : 'Failed'}: {' '}
                {new Date(pool.status === 'completed' ? pool.completedDate! : pool.failedDate!).toLocaleDateString()}
              </span>
            </div>
            {pool.status === 'failed' && pool.reason && (
              <div className="mt-1 text-xs text-red-600">
                Reason: {pool.reason}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PoolHistoryItem;
