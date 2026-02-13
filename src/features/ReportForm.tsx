import { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import type { ResolutionType, CallReport, Location } from '../types';

interface ReportFormProps {
  callId: string;
  resolution: ResolutionType;
  location: Location | null;
  onSubmit: (report: CallReport) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReportForm({ callId, resolution, location, onSubmit, onCancel, isSubmitting }: ReportFormProps) {
  const [notes, setNotes] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUrl = `https://picsum.photos/seed/${Math.random()}/200`;
    setImageUrls([...imageUrls, mockUrl]);
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    const report: CallReport = {
      callId,
      resolution,
      notes,
      imageUrls,
      location,
      timestamp: Date.now(),
      reason: resolution === 'rejected' ? reason : undefined,
      followUpDate: resolution === 'postponed' ? new Date(followUpDate).getTime() : undefined,
    };

    onSubmit(report);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Resolution-specific fields */}
        {resolution === 'rejected' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Reason for Rejection</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="flex h-14 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pointer-events-auto"
            >
              <option value="" disabled>Select a reason...</option>
              <option value="price">Price too high</option>
              <option value="competitor">Competitor deal</option>
              <option value="stock">Out of stock</option>
              <option value="closed">Pharmacy closed</option>
            </select>
          </div>
        )}

        {resolution === 'postponed' && (
          <div>
            <Input
              label="Follow-up Date"
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              required
            />
          </div>
        )}

        {/* Photo Upload — available for ALL resolution types */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            <Upload className="inline h-4 w-4 mr-1" />
            Upload Photos / Evidence
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleImageUpload}
              disabled={uploading}
              className="shrink-0 h-20 w-20 border-dashed border-2"
            >
              {uploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Upload className="h-6 w-6 text-primary" />
                </motion.div>
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
            </Button>
            {imageUrls.map((url, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-border"
              >
                <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0 right-0 p-1 bg-black/50 text-white backdrop-blur-sm rounded-bl-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
          {uploading && (
            <p className="text-xs text-primary mt-1 animate-pulse">Uploading photo...</p>
          )}
        </div>

        {/* Visit Notes */}
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Visit Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows={4}
            className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Enter detailed notes about the visit..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1 shadow-lg shadow-primary/20" isLoading={isSubmitting}>
          Submit Report
        </Button>
      </div>
    </form>
  );
}
