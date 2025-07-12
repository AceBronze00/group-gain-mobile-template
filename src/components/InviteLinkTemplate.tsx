
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Link, Key, Users, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface InviteLinkTemplateProps {
  group: {
    id: number;
    name: string;
    inviteCode: string;
    contributionAmount: number;
    frequency: string;
    members: number;
    nextPayout: string;
  };
}

const InviteLinkTemplate = ({ group }: InviteLinkTemplateProps) => {
  const { generateInviteUrl } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState<'code' | 'url' | null>(null);

  const inviteUrl = generateInviteUrl(group.inviteCode);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied('code');
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Invite Code Copied!",
      description: `Code "${group.inviteCode}" copied to clipboard`,
    });
  };

  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied('url');
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Invite URL Copied!",
      description: "Share this link for others to join your nest",
    });
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${group.name}`,
          text: `You're invited to join "${group.name}" - a savings group with ${group.members} members!`,
          url: inviteUrl,
        });
      } catch (error) {
        // Fallback to copy if share fails
        copyInviteUrl();
      }
    } else {
      copyInviteUrl();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-6">
        {/* Group Info Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Join "{group.name}"
          </h3>
          <p className="text-gray-600 text-sm">
            You're invited to join this savings group!
          </p>
        </div>

        {/* Group Details */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-gray-600">{group.members} members</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">
                {formatCurrency(group.contributionAmount)} {group.frequency}
              </span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-gray-600">
                Next payout: {new Date(group.nextPayout).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Invite Methods */}
        <div className="space-y-4">
          {/* Method 1: Invite Code */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-700">Method 1: Invite Code</span>
              </div>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                Manual Entry
              </Badge>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-3">
              <code className="font-mono text-lg font-bold text-purple-700 tracking-wider">
                {group.inviteCode}
              </code>
              <Button
                onClick={copyInviteCode}
                size="sm"
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-100"
              >
                {copied === 'code' ? 'Copied!' : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Share this code with trusted friends. They can enter it in the app to join.
            </p>
          </div>

          {/* Method 2: Direct Link */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Link className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">Method 2: Direct Link</span>
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                One-Click Join
              </Badge>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-600 font-mono break-all">
                {inviteUrl}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={copyInviteUrl}
                size="sm"
                variant="outline"
                className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                {copied === 'url' ? 'Copied!' : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                onClick={shareLink}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Click the link to automatically join the group. Perfect for messaging apps!
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-700 font-medium mb-1">
            💡 How to use:
          </p>
          <ul className="text-xs text-amber-600 space-y-1">
            <li>• Use the <strong>invite code</strong> for manual entry in the app</li>
            <li>• Use the <strong>direct link</strong> for one-click joining</li>
            <li>• Both methods work for the same group</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default InviteLinkTemplate;
