
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle, X } from "lucide-react";

interface RatingModalProps {
  showRatingModal: boolean;
  setShowRatingModal: (show: boolean) => void;
}

const RatingModal = ({ showRatingModal, setShowRatingModal }: RatingModalProps) => {
  const [ratingData, setRatingData] = useState({
    onTimePayments: '',
    wouldGroupAgain: '',
    starRating: 0
  });

  const handleStarClick = (rating: number) => {
    setRatingData(prev => ({ ...prev, starRating: rating }));
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', ratingData);
    // TODO: Submit rating to backend
    setShowRatingModal(false);
    setRatingData({ onTimePayments: '', wouldGroupAgain: '', starRating: 0 });
  };

  return (
    <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Rate Group Member
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Did this user make all their payments on time?
            </Label>
            <RadioGroup
              value={ratingData.onTimePayments}
              onValueChange={(value) => setRatingData(prev => ({ ...prev, onTimePayments: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="payments-yes" />
                <Label htmlFor="payments-yes" className="cursor-pointer">
                  <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="payments-no" />
                <Label htmlFor="payments-no" className="cursor-pointer">
                  <X className="h-4 w-4 text-red-500 inline mr-1" />
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Would you group with this user again?
            </Label>
            <RadioGroup
              value={ratingData.wouldGroupAgain}
              onValueChange={(value) => setRatingData(prev => ({ ...prev, wouldGroupAgain: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="group-yes" />
                <Label htmlFor="group-yes" className="cursor-pointer">
                  <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="group-no" />
                <Label htmlFor="group-no" className="cursor-pointer">
                  <X className="h-4 w-4 text-red-500 inline mr-1" />
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Overall Rating
            </Label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= ratingData.starRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center italic mt-2">
              Ratings are anonymous. Honest feedback helps protect the community.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRatingModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={!ratingData.onTimePayments || !ratingData.wouldGroupAgain || ratingData.starRating === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
